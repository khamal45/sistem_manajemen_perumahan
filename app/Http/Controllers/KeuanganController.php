<?php

namespace App\Http\Controllers;

use App\Models\Expenditure;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class KeuanganController extends Controller
{
    public function index()
    {
        return Inertia::render('keuangan/index');
    }

    public function chart()
    {
        $pemasukan = Payment::selectRaw("DATE_FORMAT(tanggal_pembayaran, '%Y-%m') as bulan, SUM(nominal) as total")
            ->groupBy('bulan')
            ->orderBy('bulan')
            ->pluck('total', 'bulan');

        $pengeluaran = DB::table('expenditures')
            ->join('fee_expenses', 'expenditures.fee_expense_id', '=', 'fee_expenses.id')
            ->selectRaw("DATE_FORMAT(expenditures.tanggal, '%Y-%m') as bulan, SUM(fee_expenses.amount) as total")
            ->groupBy('bulan')
            ->orderBy('bulan')
            ->pluck('total', 'bulan');

        $semuaBulan = collect($pemasukan->keys())
            ->merge($pengeluaran->keys())
            ->unique()
            ->sort()
            ->values();

        $data = $semuaBulan->map(fn($bulan) => [
            'bulan' => $bulan,
            'pemasukan' => (int) ($pemasukan[$bulan] ?? 0),
            'pengeluaran' => (int) ($pengeluaran[$bulan] ?? 0),
        ]);

        return response()->json([
            'data' => $data,
            'summary' => [
                'pemasukan' => $pemasukan->sum(),
                'pengeluaran' => $pengeluaran->sum(),
                'sisa_saldo' => $pemasukan->sum() - $pengeluaran->sum(),
            ],
        ]);
    }

    public function payments()
    {
        $payments = Payment::join('fee_types', 'payments.fee_type_id', '=', 'fee_types.id')
            ->join('house_residents', 'payments.house_residents_id', '=', 'house_residents.id')
            ->select(
                'payments.id',
                'payments.tanggal_pembayaran',
                'payments.periode_bulan',
                'payments.nominal',
                'fee_types.nama as fee_type_name',
                'house_residents.nama_keluarga'
            )
            ->orderByDesc('payments.created_at')
            ->limit(20)
            ->get();

        return response()->json($payments);
    }

    public function expenditures()
    {
        return Expenditure::with('feeExpense:id,name,amount,username')
            ->select('id', 'tanggal', 'fee_expense_id')
            ->orderByDesc('created_at')
            ->limit(20)
            ->get()
            ->map(function ($e) {
                return [
                    'id' => $e->id,
                    'tanggal' => $e->tanggal,
                    'amount' => $e->feeExpense->amount ?? 0,
                    'description' => $e->feeExpense->name ?? '-',
                    'username' => $e->feeExpense->username ?? '-',
                ];
            });
    }
}
