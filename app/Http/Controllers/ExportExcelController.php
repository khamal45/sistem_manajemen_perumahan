<?php

namespace App\Http\Controllers;

use App\Models\Expenditure;
use App\Models\Payment;
use Illuminate\Http\Request;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use Carbon\Carbon;

class ExportExcelController extends Controller
{
    public function export(Request $request)
    {
        $bulan = $request->query('bulan'); // Format '2025-06'

        // Load data pembayaran
        $payments = Payment::with('houseResident', 'feeType')
            ->when($bulan, fn($q) => $q->where('periode_bulan', $bulan))
            ->get();

        // Load data pengeluaran
        $expenditures = Expenditure::with('feeExpense')
            ->when(
                $bulan,
                fn($q) =>
                $q->whereYear('tanggal', substr($bulan, 0, 4))
                    ->whereMonth('tanggal', substr($bulan, 5, 2))
            )
            ->get();

        $rows = [];

        // Format pembayaran
        foreach ($payments as $p) {
            $periodeBulan = $p->periode_bulan ? Carbon::createFromFormat('Y-m', $p->periode_bulan) : null;
            $rows[] = [
                'tanggal' => Carbon::parse($p->tanggal_pembayaran)->format('Y-m-d'),
                'jenis' => 'Pemasukan',
                'nama' => $p->houseResident?->nama_keluarga ?? '-',
                'keterangan' => ($p->feeType?->nama ?? '-') . ' (' . ($periodeBulan ? $periodeBulan->translatedFormat('F Y') : '-') . ')',
                'debit' => floatval($p->nominal),
                'kredit' => 0,
            ];
        }

        // Format pengeluaran dari relasi feeExpense
        foreach ($expenditures as $e) {
            $rows[] = [
                'tanggal' => Carbon::parse($e->tanggal)->format('Y-m-d'),
                'jenis' => 'Pengeluaran',
                'nama' => $e->feeExpense?->username ?? '-',
                'keterangan' => $e->feeExpense?->name ?? '-',
                'debit' => 0,
                'kredit' => floatval($e->feeExpense?->amount ?? 0),
            ];
        }

        // Sort berdasarkan tanggal
        usort($rows, fn($a, $b) => strcmp($a['tanggal'], $b['tanggal']));

        // Hitung saldo berjalan
        $saldo = 0;
        foreach ($rows as &$r) {
            $saldo += $r['debit'] - $r['kredit'];
            $r['saldo'] = $saldo;
        }
        unset($r);

        // Spreadsheet setup
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Laporan Keuangan');

        $headers = ['No', 'Tanggal', 'Jenis', 'Nama', 'Keterangan', 'Debit', 'Kredit', 'Saldo'];
        $sheet->fromArray($headers, null, 'A1');

        foreach ($rows as $i => $r) {
            $sheet->fromArray([
                $i + 1,
                $r['tanggal'],
                $r['jenis'],
                $r['nama'],
                $r['keterangan'],
                $r['debit'],
                $r['kredit'],
                $r['saldo'],
            ], null, 'A' . ($i + 2));
        }

        // Baris total
        $totalRow = count($rows) + 2;
        $sheet->setCellValue("E{$totalRow}", 'TOTAL');
        $sheet->setCellValue("F{$totalRow}", "=SUM(F2:F" . ($totalRow - 1) . ")");
        $sheet->setCellValue("G{$totalRow}", "=SUM(G2:G" . ($totalRow - 1) . ")");
        $sheet->setCellValue("H{$totalRow}", $saldo); // saldo akhir langsung nilai

        // Styling
        $sheet->getStyle("A1:H1")->getFont()->setBold(true);
        $sheet->getStyle("A1:H1")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle("A1:H{$totalRow}")->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_THIN);

        $sheet->getStyle("A{$totalRow}:H{$totalRow}")
            ->getFill()
            ->setFillType(Fill::FILL_SOLID)
            ->getStartColor()
            ->setARGB('FFECECEC');

        foreach (['F', 'G', 'H'] as $col) {
            $sheet->getStyle("{$col}2:{$col}{$totalRow}")
                ->getNumberFormat()
                ->setFormatCode('#,##0');
        }

        foreach (range('A', 'H') as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }

        // Output
        $writer = new Xlsx($spreadsheet);
        $filename = 'laporan_keuangan_' . ($bulan ?? 'semua') . '.xlsx';

        return response()->streamDownload(function () use ($writer) {
            $writer->save('php://output');
        }, $filename, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ]);
    }
}
