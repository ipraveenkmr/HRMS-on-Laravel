<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLoanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'financial_year_id' => 'required|exists:financial_years,id',
            'username' => 'nullable|string|max:200',
            'employee_id' => 'required|exists:employees,id',
            'department_id' => 'required|exists:departments,id',
            'loan_amount' => 'required|numeric|min:1|max:10000000',
            'loan_period_in_month' => 'required|numeric|min:1|max:360',
            'interest_rate' => 'required|numeric|min:0|max:50',
            'status' => 'nullable|string|max:99',
            'apply_date' => 'nullable|string|max:99',
            'purpose' => 'required|string|max:1000',
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
            'loan_amount.required' => 'Loan amount is required',
            'loan_amount.min' => 'Loan amount must be at least ₹1',
            'loan_amount.max' => 'Loan amount cannot exceed ₹1,00,00,000',
            'loan_period_in_month.required' => 'Loan period is required',
            'loan_period_in_month.min' => 'Loan period must be at least 1 month',
            'loan_period_in_month.max' => 'Loan period cannot exceed 30 years (360 months)',
            'interest_rate.required' => 'Interest rate is required',
            'interest_rate.min' => 'Interest rate cannot be negative',
            'interest_rate.max' => 'Interest rate cannot exceed 50%',
            'purpose.required' => 'Loan purpose is required',
            'purpose.max' => 'Loan purpose cannot exceed 1000 characters',
        ];
    }
}