<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FeeExpense extends Model
{
    protected $fillable = ['name', 'amount', 'tanggal_berlaku', 'username'];

    public function expenditures()
    {
        return $this->hasMany(Expenditure::class);
    }
}
