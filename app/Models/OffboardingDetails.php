<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OffboardingDetails extends Model
{
    protected $fillable = [
        'employee_details_id', 'email', 'resignation_date', 'last_working_day', 'exit_interview_status',
        'reason_for_leaving', 'documents_handover_status', 'clearance_status',
        'final_settlement_date', 'experience_certificate_issued', 'experience_certificate_date',
        'relieving_letter_issued', 'relieving_letter_date'
    ];

    protected $casts = [
        'experience_certificate_issued' => 'boolean',
        'relieving_letter_issued' => 'boolean',
    ];

    public function employee()
    {
        return $this->belongsTo(EmployeeDetails::class);
    }
}
