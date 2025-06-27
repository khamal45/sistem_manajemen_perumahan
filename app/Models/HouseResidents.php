<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HouseResidents extends Model
{
    protected $fillable = ['house_id', 'nama_keluarga', 'tanggal_masuk', 'tanggal_keluar'];

    public function house()
    {
        return $this->belongsTo(House::class);
    }

    public function residents()
    {
        return $this->hasMany(Resident::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}
