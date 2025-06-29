<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = ['house_residents_id', 'fee_type_id', 'tanggal_pembayaran', 'nominal', 'periode_bulan'];

    public function houseResident()
    {
        return $this->belongsTo(HouseResidents::class, 'house_residents_id');
    }

    public function feeType()
    {
        return $this->belongsTo(FeeType::class);
    }
}
