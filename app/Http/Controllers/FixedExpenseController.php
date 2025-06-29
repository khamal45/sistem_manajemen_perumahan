<?php

namespace App\Http\Controllers;

use Illuminate\Support\Carbon;
use App\Models\{FixedExpense, Expenditure};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class FixedExpenseController extends Controller
{
    public function index()
    {
        $expenses = FixedExpense::latest()->get();
        return Inertia::render('fixed-expense/index', [
            'expenses' => $expenses,
        ]);
    }

    public function create()
    {
        return Inertia::render('fixed-expense/create');
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'tanggal_berlaku' => 'required|date',
            'username' => 'nullable|string|max:100',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        FixedExpense::create($validator->validated());

        return redirect()->route('fixed-expense.index')->with('success', 'Pengeluaran tetap berhasil ditambahkan.');
    }

    public function edit($id)
    {
        $expense = FixedExpense::findOrFail($id);
        return Inertia::render('fixed-expense/edit', [
            'expense' => $expense,
        ]);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'tanggal_berlaku' => 'required|date',
            'username' => 'nullable|string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $expense = FixedExpense::findOrFail($id);
        $expense->update($validator->validated());

        return response()->json([
            'success' => true,
            'message' => 'Pengeluaran tetap berhasil diperbarui.',
            'data' => $expense,
        ]);
    }


    public function destroy($id)
    {
        $expense = FixedExpense::findOrFail($id);
        $expense->delete();

        return redirect()->route('fixed-expense.index')->with('success', 'Pengeluaran tetap berhasil dihapus.');
    }

    public function getUnpaidUI()
    {
        return Inertia::render('fixed-expense/unpaid');
    }

    public function getUnpaidFixedExpenses()
    {
        $now = Carbon::now()->startOfMonth();
        $result = [];
        $fixedExpenses = FixedExpense::all();

        foreach ($fixedExpenses as $fixed) {
            $start = Carbon::parse($fixed->tanggal_berlaku)->startOfMonth();
            $monthsPassed = $start->diffInMonths($now) + 1;
            $countPaid = Expenditure::where('description', $fixed->name)->count();
            $unpaidCount = $monthsPassed - $countPaid;

            if ($unpaidCount > 0) {
                $unpaidMonths = [];
                $cursor = $start->copy();
                while (count($unpaidMonths) < $unpaidCount) {
                    $alreadyPaid = Expenditure::where('description', $fixed->name)
                        ->whereMonth('tanggal', $cursor->month)
                        ->whereYear('tanggal', $cursor->year)
                        ->exists();

                    if (! $alreadyPaid) {
                        $unpaidMonths[] = $cursor->format('Y-m');
                    }

                    $cursor->addMonth();
                }

                $result[] = [
                    'id' => $fixed->id,
                    'name' => $fixed->name,
                    'amount' => $fixed->amount,
                    'username' => $fixed->username,
                    'unpaid_months' => $unpaidMonths,
                ];
            }
        }

        return response()->json($result);
    }

    public function bayarUnpaid(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'data' => 'required|array|min:1',
            'data.*.tanggal' => 'required|date',
            'data.*.amount' => 'required|numeric|min:0',
            'data.*.description' => 'required|string|max:255',
            'data.*.username' => 'nullable|string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            DB::beginTransaction();
            foreach ($validator->validated()['data'] as $entry) {
                Expenditure::create($entry);
            }
            DB::commit();
            return response()->json(['success' => true, 'message' => 'Semua pengeluaran berhasil disimpan.']);
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json(['error' => 'Gagal menyimpan pengeluaran.', 'debug' => $e->getMessage()], 500);
        }
    }
}
