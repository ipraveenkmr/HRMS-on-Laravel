<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TravelExpense extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'department_id',
        'expense_type',
        'amount',
        'currency',
        'description',
        'expense_date',
        'from_location',
        'to_location',
        'purpose',
        'receipt_document',
        'status',
        'approved_by',
        'approval_date',
        'remarks',
        'username'
    ];

    protected $casts = [
        'expense_date' => 'date',
        'approval_date' => 'datetime',
        'amount' => 'decimal:2'
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class, 'employee_id');
    }

    public function approver()
    {
        return $this->belongsTo(Employee::class, 'approved_by');
    }
}