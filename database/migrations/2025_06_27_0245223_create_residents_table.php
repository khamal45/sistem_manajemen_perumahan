<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Migration: create_residents_table.php
        Schema::create('residents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('house_residents_id')->nullable()->constrained('house_residents')->nullOnDelete();
            $table->string('nama_lengkap');
            $table->string('foto_ktp');
            $table->string('no_telp');
            $table->boolean('status_menikah');
            $table->string('tipe_penghuni');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('residents');
    }
};
