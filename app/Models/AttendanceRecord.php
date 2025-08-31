<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AttendanceRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'financial_year_id',
        'employee_id',
        'department_id',
        'attendance_date',
        'username',
        'attendance',
        'login_at',
        'logout_at',
        'log_time',
        'longitude',
        'latitude',
        'device',
        'ip_address',
        'login_date',
        'login_month',
        'login_year'
    ];

    protected $attributes = [
        'log_time' => 0
    ];

    protected $casts = [
        'log_time' => 'float',
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
}