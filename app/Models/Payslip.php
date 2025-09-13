<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Payslip extends Model
{
    use HasFactory;

    protected $fillable = [
        'month_year',
        'username',
        'employee_id',
        'department_id',
        'date',
        'basic',
        'hra',
        'ta',
        'com',
        'medical',
        'edu',
        'sa',
        'pf',
        'esi',
        'income_tax',
        'cl_taken',
        'ei_taken',
        'lwp_taken',
        'advance_pay',
        'leave_travel_allowance',
        'telephone_expense',
        'fuel_and_maint_two_wheeler',
        'fuel_and_maint_four_wheeler',
        'other_expense',
        'paid_days',
        'total_days',
        'total_earning',
        'total_deduction',
        'total_reimbursement',
        'net_current_salary',
        'salary_status',
        'esi_number',
        'uan_number'
    ];

    protected $casts = [
        'basic' => 'float',
        'hra' => 'float',
        'ta' => 'float',
        'com' => 'float',
        'medical' => 'float',
        'edu' => 'float',
        'sa' => 'float',
        'pf' => 'float',
        'esi' => 'float',
        'income_tax' => 'float',
        'cl_taken' => 'float',
        'ei_taken' => 'float',
        'lwp_taken' => 'float',
        'advance_pay' => 'float',
        'leave_travel_allowance' => 'float',
        'telephone_expense' => 'float',
        'fuel_and_maint_two_wheeler' => 'float',
        'fuel_and_maint_four_wheeler' => 'float',
        'other_expense' => 'float',
        'paid_days' => 'integer',
        'total_days' => 'integer',
        'total_earning' => 'float',
        'total_deduction' => 'float',
        'total_reimbursement' => 'float',
        'net_current_salary' => 'float',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }
}