<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Department extends Model
{
    use HasFactory;

    protected $fillable = [
        'department_name'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    public function employees()
    {
        return $this->hasMany(Employee::class);
    }

    public function attendanceRecords()
    {
        return $this->hasMany(AttendanceRecord::class);
    }

    public function assignedJobs()
    {
        return $this->hasMany(AssignedJob::class);
    }

    public function dailyTasks()
    {
        return $this->hasMany(DailyTask::class);
    }

    public function assetAllocations()
    {
        return $this->hasMany(AssetAllocation::class);
    }

    public function loans()
    {
        return $this->hasMany(Loan::class);
    }

    public function leaveTrackers()
    {
        return $this->hasMany(LeaveTracker::class);
    }

    public function payslips()
    {
        return $this->hasMany(Payslip::class);
    }
}