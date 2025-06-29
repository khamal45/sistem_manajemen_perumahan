<?php

namespace Database\Seeders;

use App\Models\Expenditure;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ExpenditureSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (range(1, 10) as $i) {
            Expenditure::create([
                'tanggal' => now()->subDays(rand(1, 60)),
                'amount' => rand(50000, 500000),
                'description' => 'Pengeluaran umum ke-' . $i,
                'username' => 'Pak RT'
            ]);
        }
    }
}
