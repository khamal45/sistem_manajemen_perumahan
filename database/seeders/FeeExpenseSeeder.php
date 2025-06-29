<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\FeeExpense;

class FeeExpenseSeeder extends Seeder
{
    public function run(): void
    {
        FeeExpense::insert([
            [
                'name' => 'Bayar Gaji Satpam',
                'amount' => 500000,
                'tanggal_berlaku' => '2025-06-01',
                'username' => 'pos satpam',
            ],
            [
                'name' => 'Bayar Token Listrik Pos Ronda',
                'amount' => 50000,
                'tanggal_berlaku' => '2025-06-01',
                'username' => 'pak rt',
            ],
            [
                'name' => 'Bayar Tukang Sampah',
                'amount' => 50000,
                'tanggal_berlaku' => '2025-06-01',
                'username' => 'pak rt',
            ],
        ]);
    }
}
