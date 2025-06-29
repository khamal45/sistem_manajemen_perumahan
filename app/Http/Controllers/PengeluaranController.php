<?php

namespace App\Http\Controllers;

use App\Models\Expenditure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class PengeluaranController extends Controller
{
    public function index()
    {
        return Inertia::render('keuangan/pengeluaran-index');
    }

    public function create()
    {
        return Inertia::render('keuangan/pengeluaran-create');
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'tanggal'     => 'required|date',
            'amount'      => 'required|numeric|min:0',
            'description' => 'required|string|max:255',
            'username'    => 'nullable|string|max:100',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        Expenditure::create($validator->validated());

        return redirect()->route('pengeluaran.index')->with('success', 'Pengeluaran berhasil ditambahkan.');
    }

    public function edit($id)
    {
        $pengeluaran = Expenditure::findOrFail($id);

        return Inertia::render('keuangan/pengeluaran-edit', [
            'pengeluaran' => $pengeluaran,
        ]);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'tanggal'     => 'required|date',
            'amount'      => 'required|numeric|min:0',
            'description' => 'required|string|max:255',
            'username'    => 'nullable|string|max:100',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $pengeluaran = Expenditure::findOrFail($id);
        $pengeluaran->update($validator->validated());

        return redirect()->route('pengeluaran.index')->with('success', 'Pengeluaran berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $pengeluaran = Expenditure::findOrFail($id);
        $pengeluaran->delete();

        return response()->json(['success' => true]);
    }
}
