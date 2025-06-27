<?php

use App\Http\Controllers\HouseController;
use App\Http\Controllers\TagihanController;
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
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
