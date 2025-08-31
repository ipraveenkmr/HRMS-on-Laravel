<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AccountDetails extends Model
{
    protected $fillable = [
        'employee_details_id', 'email', 'pay_grade', 'gross_salary', 'net_salary', 'ctc', 'pf_account_number',
        'uan_number', 'esi_number', 'bank_name', 'bank_account_number', 'ifsc_code',
        'branch_name', 'bank_city', 'tax_regime'
    ];

    public function employee()
    {
        return $this->belongsTo(EmployeeDetails::class);
    }
}
