<?php

namespace App\Http\Controllers;

use Illuminate\Support\Carbon;
use App\Models\{Expenditure, FeeExpense};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class FixedExpenseController extends Controller
{
    public function index()
    {
        $expenses = FeeExpense::whereNotNull('tanggal_berlaku')->latest()->get();
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
            'tanggal_berlaku' => 'nullable|date',
            'username' => 'nullable|string|max:100',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        FeeExpense::create($validator->validated());

        return redirect()->route('fixed-expense.index')->with('success', 'Pengeluaran berhasil ditambahkan.');
    }

    public function edit($id)
    {
        $expense = FeeExpense::findOrFail($id);
        return Inertia::render('fixed-expense/edit', [
            'expense' => $expense,
        ]);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'tanggal_berlaku' => 'nullable|date',
            'username' => 'nullable|string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $expense = FeeExpense::findOrFail($id);
        $expense->update($validator->validated());

        return response()->json([
            'success' => true,
            'message' => 'Pengeluaran berhasil diperbarui.',
            'data' => $expense,
        ]);
    }

    public function destroy($id)
    {
        $expense = FeeExpense::findOrFail($id);
        $expense->tanggal_berlaku = null;
        $expense->save();

        return redirect()->route('fixed-expense.index')->with('success', 'Pengeluaran berhasil di-nonaktifkan.');
    }

    public function getUnpaidUI()
    {
        $now = Carbon::now()->startOfMonth();
        $result = [];

        $fixedExpenses = FeeExpense::whereNotNull('tanggal_berlaku')->get();

        foreach ($fixedExpenses as $fixed) {
            $start = Carbon::parse($fixed->tanggal_berlaku)->startOfMonth();
            $monthsPassed = $start->diffInMonths($now) + 1;

            $existingMonths = Expenditure::where('fee_expense_id', $fixed->id)
                ->selectRaw("DATE_FORMAT(tanggal, '%Y-%m') as bulan")
                ->pluck('bulan')
                ->toArray();

            $unpaidMonths = [];
            $cursor = $start->copy();

            while ($cursor <= $now) {
                $bulan = $cursor->format('Y-m');
                if (!in_array($bulan, $existingMonths)) {
                    $unpaidMonths[] = $bulan;
                }
                $cursor->addMonth();
            }

            if (count($unpaidMonths) > 0) {
                $result[] = [
                    'id' => $fixed->id,
                    'name' => $fixed->name,
                    'amount' => $fixed->amount,
                    'username' => $fixed->username,
                    'unpaid_months' => $unpaidMonths,
                ];
            }
        }

        return Inertia::render('fixed-expense/unpaid', [
            'unpaid' => $result
        ]);
    }


    public function getUnpaidFixedExpenses()
    {
        $now = Carbon::now()->startOfMonth();
        $result = [];

        $fixedExpenses = FeeExpense::whereNotNull('tanggal_berlaku')->get();

        foreach ($fixedExpenses as $fixed) {
            $start = Carbon::parse($fixed->tanggal_berlaku)->startOfMonth();
            $monthsPassed = $start->diffInMonths($now) + 1;

            $paidMonths = Expenditure::where('fee_expense_id', $fixed->id)
                ->get()
                ->map(fn($exp) => Carbon::parse($exp->tanggal)->format('Y-m'));

            $unpaidMonths = [];
            $cursor = $start->copy();

            while (count($unpaidMonths) < $monthsPassed) {
                $key = $cursor->format('Y-m');
                if (! $paidMonths->contains($key)) {
                    $unpaidMonths[] = $key;
                }
                $cursor->addMonth();
            }

            if (count($unpaidMonths)) {
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
            'data.*.fee_expense_id' => 'required|exists:fee_expenses,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            DB::beginTransaction();

            foreach ($request->data as $item) {
                Expenditure::create([
                    'tanggal' => $item['tanggal'],
                    'fee_expense_id' => $item['fee_expense_id'],
                ]);
            }

            DB::commit();
            return response()->json(['success' => true, 'message' => 'Pengeluaran berhasil disimpan.']);
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json(['error' => 'Gagal menyimpan pengeluaran.', 'debug' => $e->getMessage()], 500);
        }
    }
}
