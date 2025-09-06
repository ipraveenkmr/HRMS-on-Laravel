<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Employee extends Model
{
    use HasFactory;

    protected $fillable = [
        'username',
        'emp_name',
        'company_name_id',
        'branch_name_id',
        'longitude',
        'latitude',
        'emp_email',
        'dob',
        'gender',
        'father_husband_name',
        'mothers_name',
        'permanent_address',
        'present_address',
        'city',
        'state',
        'pincode',
        'emp_phone',
        'emp_emergency_phone',
        'pan',
        'aadhaar',
        'work_mode',
        'qualification',
        'board_university',
        'specialization',
        'name_of_course',
        'passing_year',
        'employer',
        'job_title',
        'start_date',
        'end_date',
        'comment',
        'reference_name',
        'reference_designation',
        'reference_department',
        'reference_contact',
        'reference_email',
        'reference_name_if_any',
        'reference_designation_if_any',
        'reference_department_if_any',
        'reference_contact_if_any',
        'reference_email_if_any',
        'emp_no',
        'joining_date',
        'department_id',
        'designation',
        'emp_type',
        'job_type',
        'probation_period_in_month',
        'pf_account_number_uan',
        'esi_account_number',
        'emp_file_no',
        'emp_status',
        'emp_joining_date',
        'emp_resignation_date',
        'emp_last_working_date',
        'full_and_final_settlement',
        'pay_grade_id',
        'gross_salary',
        'ctc',
        'bank_name',
        'bank_account_number',
        'ifsc_code',
        'bank_branch',
        'bank_city',
        'pf',
        'esi',
        'photo',
        'aadhaar_pic',
        'pan_pic',
        'isbasicpay',
        'esi_number',
        'uan_number',
        'manager_id'
    ];

    protected $attributes = [
        'gender' => 'Male',
        'work_mode' => 'Office',
        'emp_type' => 'Employee',
        'job_type' => 'Permanent',
        'qualification' => 'Under Graduate',
        'emp_status' => 'Working',
        'isbasicpay' => false
    ];

    protected $casts = [
        'gross_salary' => 'integer',
        'pf' => 'decimal:2',
        'esi' => 'decimal:2',
        'isbasicpay' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    const GENDER_CHOICES = ['Male', 'Female', 'Other'];
    const WORKMODE_CHOICES = ['Office', 'Field'];
    const EMPTYPE_CHOICES = ['Employee', 'Manager', 'Asset Admin', 'Admin'];
    const JOBTYPE_CHOICES = ['Permanent', 'Contractual'];
    const QUALIFICATION_CHOICES = ['Under Graduate', 'Graduate', 'Post Graduate'];
    const EMPSTATUS_CHOICES = ['Working', 'Resigned', 'Notice Period'];
    const FNF_CHOICES = ['Pending', 'Completed'];

    public function companyDetail()
    {
        return $this->belongsTo(CompanyDetail::class, 'company_name_id');
    }

    public function branchDetail()
    {
        return $this->belongsTo(BranchDetail::class, 'branch_name_id');
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function payGrade()
    {
        return $this->belongsTo(PayGrade::class);
    }

    public function payslips()
    {
        return $this->hasMany(Payslip::class);
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

    public function leaveCalculator()
    {
        return $this->hasOne(LeaveCalculator::class);
    }

    public function attendanceRecords()
    {
        return $this->hasMany(AttendanceRecord::class);
    }
}