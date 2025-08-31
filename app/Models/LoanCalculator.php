<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class LoanCalculator extends Model
{
    use HasFactory;

    protected $fillable = [
        'loan_id',
        'financial_year_id',
        'username',
        'employee_id',
        'department_id',
        'total_amount',
        'status',
        'emi',
        'remaining_loan_amount',
        'remaining_loan_period_in_month'
    ];

    protected $attributes = [
        'total_amount' => 0,
        'status' => 'Active',
        'emi' => 0,
        'remaining_loan_amount' => 0,
        'remaining_loan_period_in_month' => 0
    ];

    protected $casts = [
        'total_amount' => 'float',
        'emi' => 'float',
        'remaining_loan_amount' => 'float',
        'remaining_loan_period_in_month' => 'float',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    public function loan()
    {
        return $this->belongsTo(Loan::class);
    }

    public function financialYear()
    {
        return $this->belongsTo(FinancialYear::class);
    }

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }
}