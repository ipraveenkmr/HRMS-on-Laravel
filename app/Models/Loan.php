<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Loan extends Model
{
    use HasFactory;

    protected $fillable = [
        'financial_year_id',
        'username',
        'employee_id',
        'department_id',
        'loan_amount',
        'loan_period_in_month',
        'interest_rate',
        'status',
        'apply_date',
        'purpose'
    ];

    protected $attributes = [
        'loan_amount' => 0,
        'loan_period_in_month' => 0,
        'interest_rate' => 0,
        'status' => 'Active'
    ];

    protected $casts = [
        'loan_amount' => 'float',
        'loan_period_in_month' => 'float',
        'interest_rate' => 'float',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

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

    public function loanCalculator()
    {
        return $this->hasOne(LoanCalculator::class);
    }
}