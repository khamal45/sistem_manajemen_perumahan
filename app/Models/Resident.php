<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Resident extends Model
{
    protected $fillable = ['house_resident_id', 'nama_lengkap', 'foto_ktp', 'no_telp', 'status_menikah', 'tipe_penghuni'];

    public function houseResident()
    {
        return $this->belongsTo(HouseResidents::class);
    }
}
