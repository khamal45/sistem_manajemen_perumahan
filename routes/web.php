<?php

use App\Http\Controllers\ExportExcelController;
use App\Http\Controllers\FixedExpenseController;
use App\Http\Controllers\HouseController;
use App\Http\Controllers\HouseResidentController;
use App\Http\Controllers\KeuanganController;
use App\Http\Controllers\PengeluaranController;
use App\Http\Controllers\ResidentController;
use App\Http\Controllers\TagihanController;
use App\Models\HouseResidents;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::resource('houses', HouseController::class);
    Route::get('/house-management', [HouseController::class, 'management'])->name('houses.management');
    Route::get('tagihan/{house_resident_id}', [TagihanController::class, 'index']);
    Route::post('/tagihan/{house_resident_id}/bayar', [TagihanController::class, 'bayar']);
    Route::resource('house-resident', HouseResidentController::class)->except(['create']);
    Route::get('house-resident/{house_id}/create', [HouseResidentController::class, 'create']);

    Route::get('/houses/{house}/residents', [HouseResidentController::class, 'showByHouse'])->name('house_resident.by_house');

    //resident
    Route::get('/resident/{house_residents_id}/create', [ResidentController::class, 'create']);
    Route::post('/residents', [ResidentController::class, 'store'])->name('residents.store');
    Route::get('/residents/{resident}/edit', [ResidentController::class, 'edit']);
    Route::put('/residents/{resident}', [ResidentController::class, 'update'])->name('residents.update');
    Route::delete('/residents/{resident}', [ResidentController::class, 'destroy'])->name('residents.destroy');
    Route::get('/resident/search', [ResidentController::class, 'search']);
    Route::get('/resident/search-ui', [ResidentController::class, 'searchUI']);

    //keuangan
    Route::get('/keuangan', [KeuanganController::class, 'index'])->name('keuangan.index');
    Route::get('/keuangan/chart', [KeuanganController::class, 'chart']);
    Route::get('/keuangan/payments', [KeuanganController::class, 'payments']);
    Route::get('/keuangan/expenditures', [KeuanganController::class, 'expenditures']);
    Route::resource('pengeluaran', PengeluaranController::class);
    Route::get('/pengeluaran-tetap/unpaid', [FixedExpenseController::class, 'getUnpaidFixedExpenses'])
        ->name('pengeluaran_tetap.unpaid');
    Route::get('/pengeluaran-tetap/unpaid-ui', [FixedExpenseController::class, 'getUnpaidUI'])
        ->name('pengeluaran_tetap.unpaid');
    Route::post('/pengeluaran-tetap/bayar', [FixedExpenseController::class, 'bayarUnpaid'])->name('pengeluaran.bayar_unpaid');
    Route::resource('/fixed-expense', FixedExpenseController::class);
    Route::get('/export-keuangan', [ExportExcelController::class, 'export']);
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
