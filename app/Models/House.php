<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class House extends Model
{
    protected $fillable = ['nomor_rumah'];

    public function houseResidents()
    {
        return $this->hasMany(HouseResidents::class);
    }
}
