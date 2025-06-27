<?php

namespace App\Http\Controllers;

use App\Models\HouseResidents;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HouseResidentController extends Controller
{

    // Menampilkan detail penghuni satu rumah
    public function show($id)
    {
        $houseResident = HouseResidents::with(['residents', 'house'])->findOrFail($id);

        return Inertia::render('HouseResident/Show', [
            'house_resident' => $houseResident
        ]);
    }

    // Form tambah penghuni baru (keluarga)
    public function create($house_id)
    {
        return Inertia::render('HouseResident/Create', [
            'house_id' => $house_id
        ]);
    }

    // Simpan penghuni baru
    public function store(Request $request)
    {
        $validated = $request->validate([
            'house_id' => 'required|exists:houses,id',
            'nama_keluarga' => 'required|string|max:255',
            'tanggal_masuk' => 'required|date',
        ]);

        $houseResident = HouseResidents::create($validated);

        return redirect()->route('houses.show', $validated['house_id'])->with('success', 'Keluarga berhasil ditambahkan');
    }

    // Form edit data keluarga
    public function edit($id)
    {
        $houseResident = HouseResidents::findOrFail($id);

        return Inertia::render('HouseResident/Edit', [
            'house_resident' => $houseResident
        ]);
    }

    // Update data keluarga (misalnya untuk tanggal keluar)
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'nama_keluarga' => 'required|string|max:255',
            'tanggal_masuk' => 'required|date',
            'tanggal_keluar' => 'nullable|date|after_or_equal:tanggal_masuk',
        ]);

        $houseResident = HouseResidents::findOrFail($id);
        $houseResident->update($validated);

        return redirect()->back()->with('success', 'Data penghuni diperbarui');
    }
}
