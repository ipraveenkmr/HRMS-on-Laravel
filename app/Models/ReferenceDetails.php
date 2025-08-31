<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReferenceDetails extends Model
{
    protected $fillable = [
        'employee_details_id', 'email', 'reference_name', 'reference_email', 'phone', 'designation', 'company_department'
    ];

    public function employee()
    {
        return $this->belongsTo(EmployeeDetails::class);
    }
}
