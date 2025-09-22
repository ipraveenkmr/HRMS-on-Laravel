<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Employee;
use App\Models\Department;
use App\Models\PayGrade;
use App\Models\BranchDetail;
use App\Models\CompanyDetail;
use App\Models\FinancialYear;
use App\Models\LeaveCalculator;
use App\Models\LeaveTracker;
use App\Models\Leave;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;
use Carbon\Carbon;

class EmployeeController extends Controller
{
    // File upload configuration
    private const UPLOAD_DIR = 'uploads';
    private const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];

    private function getCurrentFinancialYear()
    {
        $currentDate = Carbon::now();
        $currentYear = $currentDate->year;
        $currentMonth = $currentDate->month;

        // Financial year typically runs from April to March
        // If current month is Jan-Mar, we're in the second year of the financial year
        // If current month is Apr-Dec, we're in the first year of the financial year
        if ($currentMonth >= 4) {
            // April to December: FY starts from current year
            $fyStart = $currentYear;
            $fyEnd = $currentYear + 1;
        } else {
            // January to March: FY started from previous year
            $fyStart = $currentYear - 1;
            $fyEnd = $currentYear;
        }

        // Try multiple possible formats for financial year string
        $possibleFormats = [
            $fyStart . '-' . $fyEnd,           // e.g., "2024-2025"
            $fyStart . '-' . substr($fyEnd, 2), // e.g., "2024-25"
            (string)$fyStart,                   // e.g., "2024"
            (string)$fyEnd                      // e.g., "2025"
        ];

        foreach ($possibleFormats as $format) {
            $financialYear = FinancialYear::where('year', $format)->first();
            if ($financialYear) {
                return $financialYear;
            }
        }

        // If no specific financial year found, try to get any available financial year
        return FinancialYear::first();
    }

    private function isValidImage($filename): bool
    {
        $extension = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
        return in_array('.' . $extension, self::ALLOWED_IMAGE_EXTENSIONS);
    }

    // File Upload Operations
    public function uploadProfilePicture(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'file' => 'required|file|image|max:5120' // 5MB max
            ]);

            $file = $request->file('file');

            if (!$this->isValidImage($file->getClientOriginalName())) {
                return response()->json([
                    'detail' => 'Invalid file type. Only image files are allowed.'
                ], 400);
            }

            $extension = $file->getClientOriginalExtension();
            $uniqueFilename = 'profile_' . Str::uuid() . '.' . $extension;

            $file->move(public_path(self::UPLOAD_DIR), $uniqueFilename);

            return response()->json([
                'message' => 'Profile picture uploaded successfully',
                'file_path' => '/' . self::UPLOAD_DIR . '/' . $uniqueFilename,
                'filename' => $uniqueFilename
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'detail' => 'Error uploading profile picture: ' . $e->getMessage()
            ], 500);
        }
    }

    public function uploadAadhaar(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'file' => 'required|file|image|max:5120' // 5MB max
            ]);

            $file = $request->file('file');

            if (!$this->isValidImage($file->getClientOriginalName())) {
                return response()->json([
                    'detail' => 'Invalid file type. Only image files are allowed.'
                ], 400);
            }

            $extension = $file->getClientOriginalExtension();
            $uniqueFilename = 'aadhaar_' . Str::uuid() . '.' . $extension;

            $file->move(public_path(self::UPLOAD_DIR), $uniqueFilename);

            return response()->json([
                'message' => 'Aadhaar document uploaded successfully',
                'file_path' => '/' . self::UPLOAD_DIR . '/' . $uniqueFilename,
                'filename' => $uniqueFilename
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'detail' => 'Error uploading Aadhaar document: ' . $e->getMessage()
            ], 500);
        }
    }

    public function uploadPan(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'file' => 'required|file|image|max:5120' // 5MB max
            ]);

            $file = $request->file('file');

            if (!$this->isValidImage($file->getClientOriginalName())) {
                return response()->json([
                    'detail' => 'Invalid file type. Only image files are allowed.'
                ], 400);
            }

            $extension = $file->getClientOriginalExtension();
            $uniqueFilename = 'pan_' . Str::uuid() . '.' . $extension;

            $file->move(public_path(self::UPLOAD_DIR), $uniqueFilename);

            return response()->json([
                'message' => 'PAN document uploaded successfully',
                'file_path' => '/' . self::UPLOAD_DIR . '/' . $uniqueFilename,
                'filename' => $uniqueFilename
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'detail' => 'Error uploading PAN document: ' . $e->getMessage()
            ], 500);
        }
    }

    // Employee CRUD Operations
    public function index(): JsonResponse
    {
        $employees = Employee::with(['department', 'payGrade', 'companyDetail', 'branchDetail'])
            ->orderBy('created_at')
            ->get();

        return response()->json($employees);
    }

    public function show($employee_id): JsonResponse
    {
        $employees = Employee::with(['department', 'payGrade', 'companyDetail', 'branchDetail'])
            ->where('id', $employee_id)
            ->get();

        if ($employees->isEmpty()) {
            return response()->json(['detail' => 'Employee not found'], 404);
        }

        return response()->json($employees);
    }

    public function getEmployeeByUsername($username): JsonResponse
    {
        $employees = Employee::with(['department', 'payGrade', 'companyDetail', 'branchDetail'])
            ->where('username', $username)
            ->get();

        if ($employees->isEmpty()) {
            return response()->json(['detail' => 'Employee not found'], 404);
        }

        return response()->json($employees);
    }

    public function getEmployeesByDepartment($dept_id): JsonResponse
    {
        $employees = Employee::with(['department', 'payGrade', 'companyDetail', 'branchDetail'])
            ->where('department_id', $dept_id)
            ->get();

        return response()->json($employees);
    }

    public function getEmployeesByManager($manager_id): JsonResponse
    {
        $employees = Employee::with(['department', 'payGrade', 'companyDetail', 'branchDetail'])
            ->where('manager_id', $manager_id)
            ->get();

        return response()->json($employees);
    }

    public function store(Request $request): JsonResponse
    {

        // dd($request->all());
        $validated = $request->validate([
            'username' => 'required|string|max:200|unique:employees',
            'emp_name' => 'required|string|max:200',
            'company_name_id' => 'required|exists:company_details,id',
            'branch_name_id' => 'required|exists:branch_details,id',
            'longitude' => 'nullable|string|max:99',
            'latitude' => 'nullable|string|max:99',
            'work_mode' => ['nullable', Rule::in(['Office', 'Field'])],
            'emp_email' => 'nullable|email|max:99',
            'emp_phone' => 'nullable|string|max:99',
            'emp_emergency_phone' => 'nullable|string|max:99',
            'gender' => ['nullable', Rule::in(['Male', 'Female', 'Other'])],
            'father_husband_name' => 'nullable|string|max:99',
            'mothers_name' => 'nullable|string|max:99',
            'permanent_address' => 'nullable|string',
            'present_address' => 'nullable|string',
            'city' => 'nullable|string|max:99',
            'state' => 'nullable|string|max:99',
            'pincode' => 'nullable|string|max:99',
            'pan' => 'nullable|string|max:99',
            'aadhaar' => 'nullable|string|max:99',
            'dob' => 'nullable|date',
            'emp_no' => 'nullable|string|max:99',
            'department_id' => 'required|exists:departments,id',
            'designation' => 'nullable|string|max:99',
            'emp_type' => ['nullable', Rule::in(['Employee', 'Manager', 'Asset Admin', 'Admin'])],
            'job_type' => ['nullable', Rule::in(['Permanent', 'Contractual'])],
            'probation_period_in_month' => 'nullable|integer|min:0',
            'emp_file_no' => 'nullable|string|max:99',
            'pf_account_number_uan' => 'nullable|string|max:99',
            'esi_account_number' => 'nullable|string|max:99',
            'emp_status' => ['nullable', Rule::in(['Working', 'Resigned', 'Notice Period'])],
            'full_and_final_settlement' => 'nullable',
            'emp_joining_date' => 'nullable|date',
            'emp_resignation_date' => 'nullable|date',
            'emp_last_working_date' => 'nullable|date',
            'pay_grade_id' => 'required|exists:pay_grades,id',
            'gross_salary' => 'nullable|integer|min:0',
            'ctc' => 'nullable',
            'pf' => 'nullable',
            'esi' => 'nullable',
            'is_edit' => 'nullable',
            'bank_name' => 'nullable|string|max:99',
            'bank_account_number' => 'nullable',
            'ifsc_code' => 'nullable|string|max:99',
            'bank_branch' => 'nullable|string|max:99',
            'bank_city' => 'nullable|string|max:99',
            'qualification' => ['nullable', Rule::in(['Under Graduate', 'Graduate', 'Post Graduate'])],
            'specialization' => 'nullable|string|max:99',
            'board_university' => 'nullable|string|max:99',
            'name_of_course' => 'nullable|string|max:99',
            'passing_year' => 'nullable|string|max:99',
            'employer' => 'nullable|string|max:99',
            'job_title' => 'nullable|string|max:99',
            'comment' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'reference_name' => 'nullable|string|max:99',
            'reference_designation' => 'nullable|string|max:99',
            'reference_department' => 'nullable|string|max:99',
            'reference_contact' => 'nullable|string|max:99',
            'reference_email' => 'nullable|email|max:99',
            'reference_name_if_any' => 'nullable|string|max:99',
            'reference_designation_if_any' => 'nullable|string|max:99',
            'reference_department_if_any' => 'nullable|string|max:99',
            'reference_contact_if_any' => 'nullable|string|max:99',
            'reference_email_if_any' => 'nullable|email|max:99',
            'photo' => 'nullable|string',
            'aadhaar_pic' => 'nullable|string',
            'pan_pic' => 'nullable|string',
            'isbasicpay' => 'nullable|boolean',
            'uan_number' => 'nullable|string|max:99',
            'manager_id' => 'nullable|exists:employees,id',
            'pf_employee_percent' => 'nullable',
            'pf_employer_percent' => 'nullable',
            'esi_employee_percent' => 'nullable',
            'esi_employer_percent' => 'nullable',
        ]);
        // dd($validated);
        // Check if employee with username already exists
        $existingEmployee = Employee::where('username', $validated['username'])->first();
        if ($existingEmployee) {
            return response()->json(['detail' => 'Employee with this username already exists'], 400);
        }
        // dd($validated);
        $employee = Employee::create($validated);

        // Create leave calculator data for the employee
        try {
            $financialYear = $this->getCurrentFinancialYear();
            if ($financialYear) {
                $leaveData = Leave::where('financial_year_id', $financialYear->id)->first();
                if ($leaveData) {
                    LeaveCalculator::create([
                        'financial_year_id' => $financialYear->id,
                        'username' => $validated['username'],
                        'employee_id' => $employee->id,
                        'remaining_cl_days' => $leaveData->cl_days ?? 0,
                        'remaining_cl_hours' => $leaveData->cl_hours ?? 0,
                        'remaining_ei_days' => $leaveData->ei_days ?? 0,
                        'remaining_ei_hours' => $leaveData->ei_hours ?? 0,
                        'remaining_lwp_days' => $leaveData->lwp_days ?? 0,
                        'remaining_lwp_hours' => $leaveData->lwp_hours ?? 0,
                        'remaining_medical_leave_in_days' => $leaveData->medical_leave_in_days ?? 0,
                        'remaining_medical_leave_in_hours' => $leaveData->medical_leave_in_hours ?? 0,
                        'remaining_other_leave_in_days' => $leaveData->other_leave_in_days ?? 0,
                        'remaining_other_leave_in_hours' => $leaveData->other_leave_in_hours ?? 0,
                    ]);
                }
            }
        } catch (\Exception $e) {
            // If leave calculator creation fails, we still return the employee
        }

        return response()->json($employee->load(['department', 'payGrade', 'companyDetail', 'branchDetail']));
    }

    public function update(Request $request, $employee_id): JsonResponse
    {
        $employee = Employee::find($employee_id);

        if (!$employee) {
            return response()->json(['detail' => 'Employee not found'], 404);
        }

        $validated = $request->validate([
            'username' => ['sometimes', 'string', 'max:200', Rule::unique('employees')->ignore($employee_id)],
            'emp_name' => 'sometimes|string|max:200',
            'company_name_id' => 'sometimes|exists:company_details,id',
            'branch_name_id' => 'sometimes|exists:branch_details,id',
            'longitude' => 'nullable|string|max:99',
            'latitude' => 'nullable|string|max:99',
            'work_mode' => ['nullable', Rule::in(['Office', 'Field'])],
            'emp_email' => 'nullable|email|max:99',
            'emp_phone' => 'nullable|string|max:99',
            'emp_emergency_phone' => 'nullable|string|max:99',
            'gender' => ['nullable', Rule::in(['Male', 'Female', 'Other'])],
            'father_husband_name' => 'nullable|string|max:99',
            'mothers_name' => 'nullable|string|max:99',
            'permanent_address' => 'nullable|string',
            'present_address' => 'nullable|string',
            'city' => 'nullable|string|max:99',
            'state' => 'nullable|string|max:99',
            'pincode' => 'nullable|string|max:99',
            'pan' => 'nullable|string|max:99',
            'aadhaar' => 'nullable|string|max:99',
            'dob' => 'nullable|date',
            'emp_no' => 'nullable|string|max:99',
            'department_id' => 'sometimes|exists:departments,id',
            'designation' => 'nullable|string|max:99',
            'emp_type' => ['nullable', Rule::in(['Employee', 'Manager', 'Asset Admin', 'Admin'])],
            'job_type' => ['nullable', Rule::in(['Permanent', 'Contractual'])],
            'probation_period_in_month' => 'nullable|integer|min:0',
            'emp_file_no' => 'nullable|string|max:99',
            'pf_account_number_uan' => 'nullable',
            'esi_account_number' => 'nullable',
            'emp_status' => ['nullable', Rule::in(['Working', 'Resigned', 'Notice Period'])],
            'full_and_final_settlement' => 'nullable',
            'emp_joining_date' => 'nullable|date',
            'emp_resignation_date' => 'nullable|date',
            'emp_last_working_date' => 'nullable|date',
            'pay_grade_id' => 'sometimes|exists:pay_grades,id',
            'gross_salary' => 'nullable|integer|min:0',
            'ctc' => 'nullable',
            'pf' => 'nullable',
            'esi' => 'nullable',
            'is_edit' => 'nullable',
            'bank_name' => 'nullable|string|max:99',
            'bank_account_number' => 'nullable|string|max:99',
            'ifsc_code' => 'nullable|string|max:99',
            'bank_branch' => 'nullable|string|max:99',
            'bank_city' => 'nullable|string|max:99',
            'qualification' => ['nullable', Rule::in(['Under Graduate', 'Graduate', 'Post Graduate'])],
            'specialization' => 'nullable|string|max:99',
            'board_university' => 'nullable|string|max:99',
            'name_of_course' => 'nullable|string|max:99',
            'passing_year' => 'nullable|string|max:99',
            'employer' => 'nullable|string|max:99',
            'job_title' => 'nullable|string|max:99',
            'comment' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'reference_name' => 'nullable|string|max:99',
            'reference_designation' => 'nullable|string|max:99',
            'reference_department' => 'nullable|string|max:99',
            'reference_contact' => 'nullable|string|max:99',
            'reference_email' => 'nullable|email|max:99',
            'reference_name_if_any' => 'nullable|string|max:99',
            'reference_designation_if_any' => 'nullable|string|max:99',
            'reference_department_if_any' => 'nullable|string|max:99',
            'reference_contact_if_any' => 'nullable|string|max:99',
            'reference_email_if_any' => 'nullable|email|max:99',
            'photo' => 'nullable|string',
            'aadhaar_pic' => 'nullable|string',
            'pan_pic' => 'nullable|string',
            'isbasicpay' => 'nullable|boolean',
            'uan_number' => 'nullable|string|max:99',
            'manager_id' => 'nullable|exists:employees,id',
            'pf_employee_percent' => 'nullable',
            'pf_employer_percent' => 'nullable',
            'esi_employee_percent' => 'nullable',
            'esi_employer_percent' => 'nullable',
        ]);

        $employee->update($validated);

        return response()->json($employee->load(['department', 'payGrade', 'companyDetail', 'branchDetail']));
    }

    public function updateByUsername(Request $request, $username): JsonResponse
    {
        $employee = Employee::where('username', $username)->first();

        if (!$employee) {
            return response()->json(['detail' => 'Employee not found'], 404);
        }

        $validated = $request->validate([
            'username' => ['sometimes', 'string', 'max:200', Rule::unique('employees')->ignore($employee->id)],
            'emp_name' => 'sometimes|string|max:200',
            'company_name_id' => 'sometimes|exists:company_details,id',
            'branch_name_id' => 'sometimes|exists:branch_details,id',
            'longitude' => 'nullable|string|max:99',
            'latitude' => 'nullable|string|max:99',
            'work_mode' => ['nullable', Rule::in(['Office', 'Field'])],
            'emp_email' => 'nullable|email|max:99',
            'emp_phone' => 'nullable|string|max:99',
            'emp_emergency_phone' => 'nullable|string|max:99',
            'gender' => ['nullable', Rule::in(['Male', 'Female', 'Other'])],
            'father_husband_name' => 'nullable|string|max:99',
            'mothers_name' => 'nullable|string|max:99',
            'permanent_address' => 'nullable|string',
            'present_address' => 'nullable|string',
            'city' => 'nullable|string|max:99',
            'state' => 'nullable|string|max:99',
            'pincode' => 'nullable|string|max:99',
            'pan' => 'nullable|string|max:99',
            'aadhaar' => 'nullable|string|max:99',
            'dob' => 'nullable|date',
            'emp_no' => 'nullable|string|max:99',
            'department_id' => 'sometimes|exists:departments,id',
            'designation' => 'nullable|string|max:99',
            'emp_type' => ['nullable', Rule::in(['Employee', 'Manager', 'Asset Admin', 'Admin'])],
            'job_type' => ['nullable', Rule::in(['Permanent', 'Contractual'])],
            'probation_period_in_month' => 'nullable|integer|min:0',
            'emp_file_no' => 'nullable|string|max:99',
            'pf_account_number_uan' => 'nullable',
            'esi_account_number' => 'nullable',
            'emp_status' => ['nullable', Rule::in(['Working', 'Resigned', 'Notice Period'])],
            'full_and_final_settlement' => 'nullable',
            'emp_joining_date' => 'nullable|date',
            'emp_resignation_date' => 'nullable|date',
            'emp_last_working_date' => 'nullable|date',
            'pay_grade_id' => 'sometimes|exists:pay_grades,id',
            'gross_salary' => 'nullable|integer|min:0',
            'ctc' => 'nullable',
            'pf' => 'nullable',
            'esi' => 'nullable',
            'is_edit' => 'nullable',
            'bank_name' => 'nullable|string|max:99',
            'bank_account_number' => 'nullable|string|max:99',
            'ifsc_code' => 'nullable|string|max:99',
            'bank_branch' => 'nullable|string|max:99',
            'bank_city' => 'nullable|string|max:99',
            'qualification' => ['nullable', Rule::in(['Under Graduate', 'Graduate', 'Post Graduate'])],
            'specialization' => 'nullable|string|max:99',
            'board_university' => 'nullable|string|max:99',
            'name_of_course' => 'nullable|string|max:99',
            'passing_year' => 'nullable|string|max:99',
            'employer' => 'nullable|string|max:99',
            'job_title' => 'nullable|string|max:99',
            'comment' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'reference_name' => 'nullable|string|max:99',
            'reference_designation' => 'nullable|string|max:99',
            'reference_department' => 'nullable|string|max:99',
            'reference_contact' => 'nullable|string|max:99',
            'reference_email' => 'nullable|email|max:99',
            'reference_name_if_any' => 'nullable|string|max:99',
            'reference_designation_if_any' => 'nullable|string|max:99',
            'reference_department_if_any' => 'nullable|string|max:99',
            'reference_contact_if_any' => 'nullable|string|max:99',
            'reference_email_if_any' => 'nullable|email|max:99',
            'photo' => 'nullable|string',
            'aadhaar_pic' => 'nullable|string',
            'pan_pic' => 'nullable|string',
            'isbasicpay' => 'nullable|boolean',
            'uan_number' => 'nullable|string|max:99',
            'manager_id' => 'nullable|exists:employees,id',
            'pf_employee_percent' => 'nullable',
            'pf_employer_percent' => 'nullable',
            'esi_employee_percent' => 'nullable',
            'esi_employer_percent' => 'nullable',
        ]);

        $employee->update($validated);

        return response()->json($employee->load(['department', 'payGrade', 'companyDetail', 'branchDetail']));
    }

    public function destroy($employee_id): JsonResponse
    {
        $employee = Employee::find($employee_id);

        if (!$employee) {
            return response()->json(['detail' => 'Employee not found'], 404);
        }

        $employee->delete();

        return response()->json(['message' => 'Data was deleted successfully!']);
    }

    // Supporting endpoints
    public function getDepartments(): JsonResponse
    {
        $departments = Department::all();
        return response()->json($departments);
    }

    public function getBranches(): JsonResponse
    {
        $branches = BranchDetail::with('companyName')->get();
        $result = [];

        foreach ($branches as $branch) {
            $branchData = [
                'id' => $branch->id,
                'company_name_id' => $branch->company_name_id,
                'branch_name' => $branch->branch_name,
                'branch_address' => $branch->branch_address,
                'longitude' => $branch->longitude,
                'latitude' => $branch->latitude,
                'created_at' => $branch->created_at
            ];

            if ($branch->companyName) {
                $branchData['company_name'] = $branch->companyName->company_name;
            }

            $result[] = $branchData;
        }

        return response()->json($result);
    }

    public function getPaygrades(): JsonResponse
    {
        $paygrades = PayGrade::all();
        return response()->json($paygrades);
    }

    public function getCompanies(): JsonResponse
    {
        $companies = CompanyDetail::where('status', 'Active')->get();
        return response()->json($companies);
    }
}
