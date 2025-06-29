<?php

namespace Database\Seeders;

use App\Models\House;
use App\Models\HouseResidents;
use App\Models\Resident;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class HouseSeeder extends Seeder
{
    protected $firstNames = ['Ahmad', 'Budi', 'Siti', 'Dewi', 'Andi', 'Rina', 'Eka', 'Toni', 'Fitri', 'Joko'];
    protected $lastNames = ['Santoso', 'Wijaya', 'Lestari', 'Saputra', 'Siregar', 'Pratama', 'Susanti', 'Rahmawati', 'Gunawan', 'Hidayat'];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (range(1, 20) as $i) {
            $house = House::create([
                'nomor_rumah' => "RUMAH-$i"
            ]);

            if ($i <= 15) {
                // Rumah aktif
                $namaKeluarga = $this->randomLastName();
                $houseResident = HouseResidents::create([
                    'house_id' => $house->id,
                    'nama_keluarga' => "Keluarga $namaKeluarga",
                    'tanggal_masuk' => now()->subYears(rand(1, 3))->subMonths(rand(0, 11)),
                    'tanggal_keluar' => null,
                ]);

                foreach (range(1, rand(2, 4)) as $j) {
                    Resident::create([
                        'house_residents_id' => $houseResident->id,
                        'nama_lengkap' => $this->randomFullName(),
                        'foto_ktp' => 'ktp.jpg',
                        'no_telp' => '08' . rand(1111111111, 9999999999),
                        'status_menikah' => rand(0, 1),
                        'tipe_penghuni' => 'Tetap',
                    ]);
                }

                $houseResident = HouseResidents::create([
                    'house_id' => $house->id,
                    'nama_keluarga' => "Keluarga " . $this->randomFullName(),
                    'tanggal_masuk' => now()->subYears(rand(1, 3))->subMonths(rand(0, 11)),
                    'tanggal_keluar' => now()->subYears(5),
                ]);

                foreach (range(1, rand(2, 4)) as $j) {
                    Resident::create([
                        'house_residents_id' => $houseResident->id,
                        'nama_lengkap' => $this->randomFullName(),
                        'foto_ktp' => 'ktp.jpg',
                        'no_telp' => '08' . rand(1111111111, 9999999999),
                        'status_menikah' => rand(0, 1),
                        'tipe_penghuni' => 'Tetap',
                    ]);
                }
            } elseif ($i <= 18) {
                // Rumah dengan histori penghuni
                $namaKeluarga = $this->randomLastName();
                $start = now()->subYears(rand(2, 4))->subMonths(rand(0, 11));
                $end = (clone $start)->addMonths(rand(4, 12));

                $houseResident = HouseResidents::create([
                    'house_id' => $house->id,
                    'nama_keluarga' => "Keluarga $namaKeluarga",
                    'tanggal_masuk' => $start,
                    'tanggal_keluar' => $end,
                ]);

                Resident::create([
                    'house_residents_id' => $houseResident->id,
                    'nama_lengkap' => $this->randomFullName(),
                    'foto_ktp' => 'ktp_history.jpg',
                    'no_telp' => '08' . rand(1111111111, 9999999999),
                    'status_menikah' => rand(0, 1),
                    'tipe_penghuni' => 'Kontrak',
                ]);
            }
            // Rumah 19 dan 20 dibiarkan kosong
        }
    }

    private function randomFullName(): string
    {
        return $this->firstNames[array_rand($this->firstNames)] . ' ' .
            $this->lastNames[array_rand($this->lastNames)];
    }

    private function randomLastName(): string
    {
        return $this->lastNames[array_rand($this->lastNames)];
    }
}
