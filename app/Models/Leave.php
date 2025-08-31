<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Leave extends Model
{
    use HasFactory;

    protected $fillable = [
        'financial_year_id',
        'cl_days',
        'cl_hours',
        'ei_days',
        'ei_hours',
        'lwp_days',
        'lwp_hours',
        'medical_leave_in_days',
        'medical_leave_in_hours',
        'other_leave_in_days',
        'other_leave_in_hours'
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
        'other_leave_in_hours' => 0
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

    public function financialYear()
    {
        return $this->belongsTo(FinancialYear::class);
    }
}