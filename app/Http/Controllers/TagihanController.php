<?php

namespace App\Http\Controllers;

use App\Models\{FeeType, HouseResidents, Payment};
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class TagihanController extends Controller
{
    public static function getUnpaidFees(HouseResidents $resident)
    {
        $feeTypes = FeeType::all();
        $unpaid = [];


        $paidKeys = $resident->payments->map(fn($p) => $p->fee_type_id . '_' . $p->periode_bulan);
        $now = now()->startOfMonth();

        foreach ($feeTypes as $fee) {

            $feeStart = Carbon::parse($fee->tanggal_berlaku)->startOfMonth();
            $feeEnd = $fee->tanggal_berakhir
                ? Carbon::parse($fee->tanggal_berakhir)->startOfMonth()
                : $now;
            if ($feeStart->gt($now)) continue;

            $residentStart = Carbon::parse($resident->tanggal_masuk)->startOfMonth();
            $start = $residentStart->greaterThan($feeStart) ? $residentStart : $feeStart;
            $end = $feeEnd->greaterThan($now) ? $now : $feeEnd;

            $current = $start->copy();

            while ($current <= $end) {
                $key = $fee->id . '_' . $current->format('Y-m');



                if (!$paidKeys->contains($key)) {
                    $unpaid[] = [
                        'fee_type' => $fee->nama,
                        'periode_bulan' => $current->format('Y-m'),
                        'nominal' => (int) $fee->nominal,
                        'fee_type_id' => $fee->id,
                    ];
                }

                $current->addMonth();
            }
        }

        return $unpaid;
    }



    public function index($house_resident_id)
    {
        $houseResident = HouseResidents::with('payments')->findOrFail($house_resident_id);
        $feeTypes = FeeType::all();

        $unpaid = self::getUnpaidFees($houseResident);

        $futureOptions = [];
        foreach ($feeTypes as $fee) {
            $lastPaid = $houseResident->payments
                ->where('fee_type_id', $fee->id)
                ->sortByDesc('periode_bulan')
                ->first();

            if ($lastPaid <= $fee->tanggal_berakhir || $fee->tanggal_berakhir == null) {


                $awal = $lastPaid
                    ? Carbon::parse($lastPaid->periode_bulan)->addMonth()
                    : max(
                        Carbon::parse($houseResident->tanggal_masuk)->startOfMonth(),
                        Carbon::parse($fee->tanggal_berlaku)->startOfMonth()
                    );

                $akhir = $fee->tanggal_berakhir
                    ? Carbon::parse($fee->tanggal_berakhir)->startOfMonth()
                    : $awal->copy()->addMonths(11);



                $futureOptions[] = [
                    'fee_type_id' => $fee->id,
                    'fee_type_name' => $fee->nama,
                    'bulan_awal' => $awal->format('Y-m'),
                    'bulan_akhir' => $akhir->format('Y-m'),
                    'nominal' => (int) $fee->nominal,
                ];
            }
        }
        return Inertia::render('tagihan/index', [
            'house_resident' => [
                'id' => $houseResident->id,
                'nama_keluarga' => $houseResident->nama_keluarga,
                'tanggal_masuk' => $houseResident->tanggal_masuk,
                'tanggal_keluar' => $houseResident->tanggal_keluar,
            ],
            'unpaid_fees' => $unpaid,
            'future_payment_options' => $futureOptions,
        ]);
    }

    public function bayar(Request $request, $house_resident_id)
    {
        $validator = Validator::make($request->all(), [
            'data' => 'required|array|min:1',
            'data.*.fee_type_id' => 'required|exists:fee_types,id',
            'data.*.periode_bulan' => 'required|date_format:Y-m',
            'data.*.nominal' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated()['data'];

        DB::beginTransaction();

        try {
            foreach ($data as $item) {
                $exists = Payment::where('house_residents_id', $house_resident_id)
                    ->where('fee_type_id', $item['fee_type_id'])
                    ->where('periode_bulan', $item['periode_bulan'])
                    ->exists();

                if (! $exists) {
                    Payment::create([
                        'house_residents_id' => $house_resident_id,
                        'fee_type_id' => $item['fee_type_id'],
                        'periode_bulan' => $item['periode_bulan'],
                        'tanggal_pembayaran' => now(),
                        'nominal' => $item['nominal'],
                    ]);
                }
            }

            DB::commit();
            return response()->json(['success' => true, 'message' => 'Pembayaran berhasil ditambahkan.']);
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Gagal memproses pembayaran.',
                'debug' => $e->getMessage(),
            ], 500);
        }
    }
}
