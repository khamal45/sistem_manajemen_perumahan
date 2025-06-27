<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FeeType extends Model
{
    protected $fillable = ['nama', 'nominal', 'tanggal_berlaku'];

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}
