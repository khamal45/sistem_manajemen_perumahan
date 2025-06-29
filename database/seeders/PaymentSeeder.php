<?php

namespace Database\Seeders;

use App\Models\FeeType;
use App\Models\HouseResidents;
use App\Models\Payment;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PaymentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $feeTypes = FeeType::all();
        $houseResidents = HouseResidents::whereNull('tanggal_keluar')->get(); // hanya yang aktif

        // Ambil 2-3 bulan terakhir, exclude bulan sekarang
        $months = collect([
            now()->subMonths(2)->format('Y-m'), // 2 bulan lalu
            now()->subMonth()->format('Y-m'),   // 1 bulan lalu
        ]);

        foreach ($houseResidents as $hr) {
            foreach ($feeTypes as $feeType) {
                foreach ($months as $periode) {
                    Payment::create([
                        'house_residents_id' => $hr->id,
                        'fee_type_id' => $feeType->id,
                        'tanggal_pembayaran' => now()->subDays(rand(1, 30)),
                        'nominal' => $feeType->nominal,
                        'periode_bulan' => $periode,
                    ]);
                }
            }
        }
    }
}
