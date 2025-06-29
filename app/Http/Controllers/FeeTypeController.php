<?php

namespace App\Http\Controllers;

use App\Models\FeeType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class FeeTypeController extends Controller
{
    public function index()
    {
        $feeTypes = FeeType::orderBy('nama')->get();

        return Inertia::render('fee-type/index', [
            'fee_types' => $feeTypes,
        ]);
    }

    public function create()
    {
        return Inertia::render('fee-type/create');
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama' => 'required|string|max:255',
            'nominal' => 'required|numeric|min:0',
            'tanggal_berlaku' => 'required|date',
            'tanggal_berakhir' => 'nullable|date|after_or_equal:tanggal_berlaku',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        FeeType::create($validator->validated());

        return redirect()->route('pemasukan.index')->with('success', 'Jenis tagihan berhasil ditambahkan.');
    }

    public function edit($id)
    {
        $feeType = FeeType::findOrFail($id);

        return Inertia::render('fee-type/edit', [
            'fee_type' => $feeType,
        ]);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'nama' => 'required|string|max:255',
            'nominal' => 'required|numeric|min:0',
            'tanggal_berlaku' => 'required|date',
            'tanggal_berakhir' => 'nullable|date|after_or_equal:tanggal_berlaku',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $feeType = FeeType::findOrFail($id);
        $feeType->update($validator->validated());

        return redirect()->route('pemasukan.index')->with('success', 'Jenis tagihan berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $feeType = FeeType::findOrFail($id);
        $feeType->delete();

        return redirect()->route('pemasukan.index')->with('success', 'Jenis tagihan berhasil dihapus.');
    }
}
