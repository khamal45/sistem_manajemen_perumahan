<?php

namespace Database\Seeders;

use App\Models\Expenditure;
use App\Models\FeeExpense;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Log;

class ExpenditureSeeder extends Seeder
{
    public function run(): void
    {
        if (FeeExpense::count() === 0) {
            Log::warning('Seeder Gagal: Tidak ada fee_expense ditemukan.');
            return;
        }

        $feeExpenses = FeeExpense::all();

        // Ambil bulan 3, 2, dan 1 bulan yang lalu
        $months = collect([
            now()->subMonths(2),
            now()->subMonth(),
        ]);

        foreach (range(1, 10) as $i) {
            // Pilih salah satu bulan
            $baseDate = $months->random();

            // Buat tanggal acak dalam bulan tersebut
            $randomDay = rand(1, $baseDate->daysInMonth);
            $tanggal = $baseDate->copy()->startOfMonth()->addDays($randomDay - 1);

            Expenditure::create([
                'tanggal' => $tanggal,
                'fee_expense_id' => $feeExpenses->random()->id,
            ]);
        }
    }
}
