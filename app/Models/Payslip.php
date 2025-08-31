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
        'basic' => 'integer',
        'hra' => 'integer',
        'ta' => 'integer',
        'com' => 'integer',
        'medical' => 'integer',
        'edu' => 'integer',
        'sa' => 'integer',
        'pf' => 'integer',
        'esi' => 'integer',
        'income_tax' => 'integer',
        'cl_taken' => 'integer',
        'ei_taken' => 'integer',
        'lwp_taken' => 'integer',
        'advance_pay' => 'integer',
        'leave_travel_allowance' => 'integer',
        'telephone_expense' => 'integer',
        'fuel_and_maint_two_wheeler' => 'integer',
        'fuel_and_maint_four_wheeler' => 'integer',
        'other_expense' => 'integer',
        'paid_days' => 'integer',
        'total_days' => 'integer',
        'total_earning' => 'integer',
        'total_deduction' => 'integer',
        'total_reimbursement' => 'integer',
        'net_current_salary' => 'integer',
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