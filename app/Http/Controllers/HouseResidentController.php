<?php

namespace App\Http\Controllers;

use App\Models\House;
use App\Models\HouseResidents;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HouseResidentController extends Controller
{
    // Tampilkan semua house resident
    public function index()
    {
        $houseResidents = HouseResidents::with('house')->latest()->get();

        return Inertia::render('houseresident/index', [
            'house_residents' => $houseResidents,
        ]);
    }

    // Form tambah data
    public function create($house_id)
    {
        // Cek apakah ada penghuni aktif
        $hasActiveResident = HouseResidents::where('house_id', $house_id)
            ->whereNull('tanggal_keluar')
            ->exists();

        if ($hasActiveResident) {
            return redirect()->route('house_resident.by_house', ['house' => $house_id])
                ->with('error', 'Rumah masih memiliki penghuni aktif.');
        }

        return Inertia::render('house-resident/create', [
            'house_id' => $house_id
        ]);
    }
    // Simpan data baru
    public function store(Request $request)
    {
        $validated = $request->validate([
            'house_id' => 'required|exists:houses,id',
            'nama_keluarga' => 'required|string|max:255',
            'tanggal_masuk' => 'required|date',
        ]);

        HouseResidents::create($validated);

        return response()->json(['house_id' => $validated['house_id']]);
    }

    // Form edit data
    public function edit($id)
    {
        $houseResident = HouseResidents::findOrFail($id);

        return Inertia::render('house-resident/edit', [
            'house_resident' => $houseResident,
        ]);
    }


    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'nama_keluarga' => 'sometimes|required|string|max:255',
            'tanggal_masuk' => 'sometimes|required|date',
            'tanggal_keluar' => 'nullable|date|after_or_equal:tanggal_masuk',
        ]);

        $houseResident = HouseResidents::findOrFail($id);
        $houseResident->update($validated);


        $house_id = $houseResident->house_id;

        return redirect()->route('house_resident.by_house', ['house' => $house_id])
            ->with('success', 'Data penghuni berhasil diperbarui.');
    }

    // Hapus penghuni
    public function destroy($id)
    {
        $houseResident = HouseResidents::findOrFail($id);
        $houseResident->delete();

        return redirect()->route('house_resident.index')->with('success', 'Data penghuni berhasil dihapus.');
    }

    public function showByHouse($house_id)
    {
        // Dapatkan rumah
        $house = House::findOrFail($house_id);

        // Dapatkan semua HouseResident untuk rumah tersebut
        $houseResidents = $house->houseResidents()
            ->with('residents') // relasi ke anggota keluarga
            ->orderByDesc('tanggal_masuk')
            ->get();

        return Inertia::render('houses/resident', [
            'house' => $house,
            'house_residents' => $houseResidents,
        ]);
    }
}
