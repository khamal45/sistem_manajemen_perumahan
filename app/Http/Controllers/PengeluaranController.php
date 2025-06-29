<?php

namespace App\Http\Controllers;

use App\Models\Expenditure;
use App\Models\FeeExpense;
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

        $validated = $validator->validated();

        // Cari atau buat fee_expense berdasarkan nama (description)
        $feeExpense = FeeExpense::firstOrCreate(
            ['name' => $validated['description']],
            [
                'amount' => $validated['amount'],
                'tanggal_berlaku' => null, // karena pengeluaran manual
                'username' => $validated['username'] ?? null,
            ]
        );

        // Simpan ke expenditures
        Expenditure::create([
            'tanggal' => $validated['tanggal'],
            'fee_expense_id' => $feeExpense->id,
        ]);

        return redirect()->route('pengeluaran.index')->with('success', 'Pengeluaran berhasil ditambahkan.');
    }

    public function edit($id)
    {
        $pengeluaran = Expenditure::with('feeExpense')->findOrFail($id);

        return Inertia::render('keuangan/pengeluaran-edit', [
            'pengeluaran' => $pengeluaran,
        ]);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'tanggal'        => 'required|date',
            'fee_expense_id' => 'required|exists:fee_expenses,id',
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
