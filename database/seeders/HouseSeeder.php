<?php

namespace Database\Seeders;

use App\Models\House;
use App\Models\HouseResidents;
use App\Models\Resident;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class HouseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (range(1, 20) as $i) {
            $house = House::create([
                'nomor_rumah' => "RUMAH-$i"
            ]);

            // 15 rumah pertama aktif
            if ($i <= 15) {
                $houseResident = HouseResidents::create([
                    'house_id' => $house->id,
                    'nama_keluarga' => "Keluarga $i",
                    'tanggal_masuk' => now()->subYears(rand(1, 3)),
                    'tanggal_keluar' => null,
                ]);

                foreach (range(1, rand(2, 4)) as $j) {
                    Resident::create([
                        'house_residents_id' => $houseResident->id,
                        'nama_lengkap' => "Penghuni $j Rumah $i",
                        'foto_ktp' => 'ktp.jpg',
                        'no_telp' => '08' . rand(100000000, 999999999),
                        'status_menikah' => rand(0, 1),
                        'tipe_penghuni' => 'Tetap'
                    ]);
                }
            } else {
                // 3 rumah history, 2 kosong
                if ($i <= 18) {
                    $start = now()->subYears(rand(1, 2));
                    $end = $start->copy()->addMonths(rand(3, 6));

                    $houseResident = HouseResidents::create([
                        'house_id' => $house->id,
                        'nama_keluarga' => "Keluarga History $i",
                        'tanggal_masuk' => $start,
                        'tanggal_keluar' => $end,
                    ]);

                    Resident::create([
                        'house_residents_id' => $houseResident->id,
                        'nama_lengkap' => "Penghuni History Rumah $i",
                        'foto_ktp' => 'ktp_history.jpg',
                        'no_telp' => '08' . rand(100000000, 999999999),
                        'status_menikah' => rand(0, 1),
                        'tipe_penghuni' => 'Kontrak'
                    ]);
                }
            }
        }
    }
}
