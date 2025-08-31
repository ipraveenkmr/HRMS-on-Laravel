<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class LeaveTracker extends Model
{
    use HasFactory;

    protected $fillable = [
        'financial_year_id',
        'username',
        'employee_id',
        'department_id',
        'cl_days',
        'cl_hours',
        'ei_days',
        'ei_hours',
        'lwp_days',
        'lwp_hours',
        'medical_leave_in_days',
        'medical_leave_in_hours',
        'other_leave_in_days',
        'other_leave_in_hours',
        'leave_status',
        'leave_reason',
        'leave_from_date',
        'leave_from_month',
        'leave_from_year',
        'leave_to_date',
        'leave_to_month',
        'leave_to_year'
    ];

    protected $attributes = [
        'cl_days' => 0,
        'cl_hours' => 0,
        'ei_days' => 0,
        'ei_hours' => 0,
        'lwp_days' => 0,
        'lwp_hours' => 0,
        'medical_leave_in_days' => 0,
        'medical_leave_in_hours' => 0,
        'other_leave_in_days' => 0,
        'other_leave_in_hours' => 0,
        'leave_status' => 'Pending'
    ];

    protected $casts = [
        'cl_days' => 'float',
        'cl_hours' => 'float',
        'ei_days' => 'float',
        'ei_hours' => 'float',
        'lwp_days' => 'float',
        'lwp_hours' => 'float',
        'medical_leave_in_days' => 'float',
        'medical_leave_in_hours' => 'float',
        'other_leave_in_days' => 'float',
        'other_leave_in_hours' => 'float',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    const LEAVE_CHOICES = [
        'Casual Leave',
        'Half Day Leave',
        'Full Day Leave',
        'Medical Leave',
        'Other Leave'
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
}