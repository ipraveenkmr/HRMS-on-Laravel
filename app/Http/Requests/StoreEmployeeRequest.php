<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreEmployeeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'username' => 'required|string|max:200|unique:employees',
            'emp_name' => 'required|string|max:200',
            'company_name_id' => 'required|exists:company_details,id',
            'branch_name_id' => 'required|exists:branch_details,id',
            'longitude' => 'nullable|string|max:99',
            'latitude' => 'nullable|string|max:99',
            'emp_email' => 'nullable|email|max:99',
            'dob' => 'nullable|string|max:99',
            'gender' => ['nullable', Rule::in(['Male', 'Female', 'Other'])],
            'father_husband_name' => 'nullable|string|max:99',
            'mothers_name' => 'nullable|string|max:99',
            'permanent_address' => 'nullable|string',
            'present_address' => 'nullable|string',
            'city' => 'nullable|string|max:99',
            'state' => 'nullable|string|max:99',
            'pincode' => 'nullable|string|max:99',
            'emp_phone' => 'nullable|string|max:99',
            'emp_emergency_phone' => 'nullable|string|max:99',
            'pan' => 'nullable|string|max:99',
            'aadhaar' => 'nullable|string|max:99',
            'work_mode' => ['nullable', Rule::in(['Office', 'Field'])],
            'qualification' => ['nullable', Rule::in(['Under Graduate', 'Graduate', 'Post Graduate'])],
            'board_university' => 'nullable|string|max:99',
            'specialization' => 'nullable|string|max:99',
            'name_of_course' => 'nullable|string|max:99',
            'passing_year' => 'nullable|string|max:99',
            'employer' => 'nullable|string|max:99',
            'job_title' => 'nullable|string|max:99',
            'start_date' => 'nullable|string|max:99',
            'end_date' => 'nullable|string|max:99',
            'comment' => 'nullable|string',
            'reference_name' => 'nullable|string|max:200',
            'reference_designation' => 'nullable|string|max:200',
            'reference_department' => 'nullable|string|max:200',
            'reference_contact' => 'nullable|string|max:200',
            'reference_email' => 'nullable|email|max:200',
            'reference_name_if_any' => 'nullable|string|max:200',
            'reference_designation_if_any' => 'nullable|string|max:200',
            'reference_department_if_any' => 'nullable|string|max:200',
            'reference_contact_if_any' => 'nullable|string|max:200',
            'reference_email_if_any' => 'nullable|email|max:200',
            'emp_no' => 'nullable|string|max:99',
            'joining_date' => 'nullable|string|max:99',
            'department_id' => 'required|exists:departments,id',
            'designation' => 'nullable|string|max:99',
            'emp_type' => ['nullable', Rule::in(['Employee', 'Manager', 'Asset Admin', 'Admin'])],
            'job_type' => ['nullable', Rule::in(['Pemanent', 'Contractual'])],
            'probation_period_in_month' => 'nullable|string|max:99',
            'pf_account_number_uan' => 'nullable|string|max:99',
            'esi_account_number' => 'nullable|string|max:99',
            'emp_file_no' => 'nullable|string|max:99',
            'emp_status' => ['nullable', Rule::in(['Working', 'Resigned', 'Notice Period'])],
            'emp_joining_date' => 'nullable|string|max:99',
            'emp_resignation_date' => 'nullable|string|max:99',
            'emp_last_working_date' => 'nullable|string|max:99',
            'full_and_final_settlement' => 'nullable|string|max:99',
            'pay_grade_id' => 'required|exists:pay_grades,id',
            'gross_salary' => 'nullable|integer|min:0',
            'bank_name' => 'nullable|string|max:99',
            'bank_account_number' => 'nullable|string|max:99',
            'ifsc_code' => 'nullable|string|max:99',
            'bank_branch' => 'nullable|string|max:99',
            'bank_city' => 'nullable|string|max:99',
            'pf' => 'nullable|numeric|between:0,99.99',
            'esi' => 'nullable|numeric|between:0,99.99',
            'photo' => 'nullable|string|max:200',
            'aadhaar_pic' => 'nullable|string|max:200',
            'pan_pic' => 'nullable|string|max:200',
            'isbasicpay' => 'nullable|boolean',
            'esi_number' => 'nullable|string|max:200',
            'uan_number' => 'nullable|string|max:200',
        ];
    }

    public function messages(): array
    {
        return [
            'username.required' => 'Username is required',
            'username.unique' => 'Username already exists',
            'emp_name.required' => 'Employee name is required',
            'company_name_id.required' => 'Company is required',
            'company_name_id.exists' => 'Invalid company selected',
            'branch_name_id.required' => 'Branch is required',
            'branch_name_id.exists' => 'Invalid branch selected',
            'department_id.required' => 'Department is required',
            'department_id.exists' => 'Invalid department selected',
            'pay_grade_id.required' => 'Pay grade is required',
            'pay_grade_id.exists' => 'Invalid pay grade selected',
            'emp_email.email' => 'Please enter a valid email address',
            'reference_email.email' => 'Please enter a valid reference email address',
            'reference_email_if_any.email' => 'Please enter a valid reference email address',
        ];
    }
}