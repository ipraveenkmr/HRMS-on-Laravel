<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class EmployeeDetails extends Model
{
    use HasFactory;
    protected $fillable = [
        'full_name',
        'email',
        'phone_number',
        'gender',
        'dob',
        'marital_status',
        'nationality',
        'address',
        'city',
        'state',
        'pin_code',
        'pan_number',
        'aadhaar_number',
        'employee_number',
        'employment_type',
        'department',
        'designation',
        'reporting_manager',
        'joining_date',
        'work_mode',
        'shift_type',
        'qualification',
        'specialization',
        'experience_years',
    ];

    protected $dates = ['dob', 'joining_date'];

    public function account()
    {
        return $this->hasOne(AccountDetails::class);
    }

    public function references()
    {
        return $this->hasMany(ReferenceDetails::class);
    }

    public function offboarding()
    {
        return $this->hasOne(OffboardingDetails::class);
    }
}
