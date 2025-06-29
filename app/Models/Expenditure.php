<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Expenditure extends Model
{
    protected $fillable = ['tanggal', 'fee_expense_id'];

    public function feeExpense()
    {
        return $this->belongsTo(feeExpense::class);
    }
}
