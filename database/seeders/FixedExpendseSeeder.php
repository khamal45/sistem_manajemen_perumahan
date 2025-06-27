<?php

namespace Database\Seeders;

use App\Models\FixedExpense;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FixedExpendseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        FixedExpense::insert([
            ['name' => 'Langganan Internet', 'amount' => 300000],
            ['name' => 'Servis Kebersihan Bulanan', 'amount' => 50000],
        ]);
    }
}
