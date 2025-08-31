<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAttendanceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'financial_year_id' => 'required|exists:financial_years,id',
            'employee_id' => 'required|exists:employees,id',
            'department_id' => 'required|exists:departments,id',
            'attendance_date' => 'required|string|max:99|unique:attendance_records',
            'username' => 'nullable|string|max:200',
            'attendance' => 'nullable|string|max:99',
            'login_at' => 'nullable|string|max:99',
            'logout_at' => 'nullable|string|max:99',
            'log_time' => 'nullable|numeric|min:0|max:24',
            'longitude' => 'nullable|string|max:99',
            'latitude' => 'nullable|string|max:99',
            'device' => 'nullable|string|max:99',
            'ip_address' => 'nullable|ip',
            'login_date' => 'nullable|string|max:99',
            'login_month' => 'nullable|string|max:99',
            'login_year' => 'nullable|string|max:99',
        ];
    }

    public function messages(): array
    {
        return [
            'financial_year_id.required' => 'Financial year is required',
            'financial_year_id.exists' => 'Invalid financial year selected',
            'employee_id.required' => 'Employee is required',
            'employee_id.exists' => 'Invalid employee selected',
            'department_id.required' => 'Department is required',
            'department_id.exists' => 'Invalid department selected',
            'attendance_date.required' => 'Attendance date is required',
            'attendance_date.unique' => 'Attendance record already exists for this date',
            'log_time.max' => 'Log time cannot exceed 24 hours',
            'ip_address.ip' => 'Please enter a valid IP address',
        ];
    }
}