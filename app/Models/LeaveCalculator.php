<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class LeaveCalculator extends Model
{
    use HasFactory;

    protected $fillable = [
        'financial_year_id',
        'username',
        'employee_id',
        'remaining_cl_days',
        'remaining_cl_hours',
        'remaining_ei_days',
        'remaining_ei_hours',
        'remaining_lwp_days',
        'remaining_lwp_hours',
        'remaining_medical_leave_in_days',
        'remaining_medical_leave_in_hours',
        'remaining_other_leave_in_days',
        'remaining_other_leave_in_hours'
    ];

    protected $attributes = [
        'remaining_cl_days' => 0,
        'remaining_cl_hours' => 0,
        'remaining_ei_days' => 0,
        'remaining_ei_hours' => 0,
        'remaining_lwp_days' => 0,
        'remaining_lwp_hours' => 0,
        'remaining_medical_leave_in_days' => 0,
        'remaining_medical_leave_in_hours' => 0,
        'remaining_other_leave_in_days' => 0,
        'remaining_other_leave_in_hours' => 0
    ];

    protected $casts = [
        'remaining_cl_days' => 'float',
        'remaining_cl_hours' => 'float',
        'remaining_ei_days' => 'float',
        'remaining_ei_hours' => 'float',
        'remaining_lwp_days' => 'float',
        'remaining_lwp_hours' => 'float',
        'remaining_medical_leave_in_days' => 'float',
        'remaining_medical_leave_in_hours' => 'float',
        'remaining_other_leave_in_days' => 'float',
        'remaining_other_leave_in_hours' => 'float',
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
}