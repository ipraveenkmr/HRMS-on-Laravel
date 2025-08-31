<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class FinancialYear extends Model
{
    use HasFactory;

    protected $fillable = [
        'year',
        'working_hours',
        'loan_interest_rate',
        'login_time',
        'logout_time'
    ];

    protected $attributes = [
        'working_hours' => 8.5,
        'loan_interest_rate' => 7.5
    ];

    protected $casts = [
        'working_hours' => 'float',
        'loan_interest_rate' => 'float',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    const MONTH_CHOICES = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    public function loans()
    {
        return $this->hasMany(Loan::class);
    }

    public function loanCalculators()
    {
        return $this->hasMany(LoanCalculator::class);
    }

    public function leave()
    {
        return $this->hasOne(Leave::class);
    }

    public function leaveTrackers()
    {
        return $this->hasMany(LeaveTracker::class);
    }

    public function leaveCalculators()
    {
        return $this->hasMany(LeaveCalculator::class);
    }

    public function attendanceRecords()
    {
        return $this->hasMany(AttendanceRecord::class);
    }
}