<?php

namespace Database\Seeders;

use App\Models\FeeType;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FeeTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        FeeType::insert([
            ['nama' => 'Uang Satpam', 'nominal' => 100000, 'tanggal_berlaku' => Carbon::parse('2025-06-01')],
            ['nama' => 'Kebersihan', 'nominal' => 15000, 'tanggal_berlaku' => Carbon::parse('2025-06-01')],
        ]);
    }
}
