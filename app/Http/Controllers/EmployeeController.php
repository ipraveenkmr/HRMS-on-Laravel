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
            'emp_email' => 'nullable|email|max:99',
            'gender' => ['nullable', Rule::in(['Male', 'Female', 'Other'])],
            'work_mode' => ['nullable', Rule::in(['Office', 'Field'])],
            'qualification' => ['nullable', Rule::in(['Under Graduate', 'Graduate', 'Post Graduate'])],
            'department_id' => 'required|exists:departments,id',
            'emp_type' => ['nullable', Rule::in(['Employee', 'Manager', 'Asset Admin', 'Admin'])],
            'job_type' => ['nullable', Rule::in(['Permanent', 'Contractual'])],
            'emp_status' => ['nullable', Rule::in(['Working', 'Resigned', 'Notice Period'])],
            'pay_grade_id' => 'required|exists:pay_grades,id',
            'gross_salary' => 'nullable|integer|min:0',
            // 'manager_id' => 'nullable|exists:employees,id',
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
            $currentYear = Carbon::now()->year;
            $financialYear = FinancialYear::where('year', (string)$currentYear)->first();
            if ($financialYear) {
                $leaveData = Leave::where('financial_year_id', $financialYear->id)->first();
                if ($leaveData) {
                    LeaveCalculator::create([
                        'financial_year_id' => $financialYear->id,
                        'username' => $validated['username'],
                        'employee_id' => $employee->id,
                        'remaining_CL_Days' => $leaveData->CL_Days ?? 0,
                        'remaining_CL_Hours' => $leaveData->CL_Hours ?? 0,
                        'remaining_EI_Days' => $leaveData->EI_Days ?? 0,
                        'remaining_EI_Hours' => $leaveData->EI_Hours ?? 0,
                        'remaining_LWP_Days' => $leaveData->LWP_Days ?? 0,
                        'remaining_LWP_Hours' => $leaveData->LWP_Hours ?? 0,
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
            'emp_email' => 'nullable|email|max:99',
            'gender' => ['nullable', Rule::in(['Male', 'Female', 'Other'])],
            'work_mode' => ['nullable', Rule::in(['Office', 'Field'])],
            'qualification' => ['nullable', Rule::in(['Under Graduate', 'Graduate', 'Post Graduate'])],
            'department_id' => 'sometimes|exists:departments,id',
            'emp_type' => ['nullable', Rule::in(['Employee', 'Manager', 'Asset Admin', 'Admin'])],
            'job_type' => ['nullable', Rule::in(['Permanent', 'Contractual'])],
            'emp_status' => ['nullable', Rule::in(['Working', 'Resigned', 'Notice Period'])],
            'pay_grade_id' => 'sometimes|exists:pay_grades,id',
            'gross_salary' => 'nullable|integer|min:0',
            'manager_id' => 'nullable|exists:employees,id',
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
            'emp_email' => 'nullable|email|max:99',
            'gender' => ['nullable', Rule::in(['Male', 'Female', 'Other'])],
            'work_mode' => ['nullable', Rule::in(['Office', 'Field'])],
            'qualification' => ['nullable', Rule::in(['Under Graduate', 'Graduate', 'Post Graduate'])],
            'department_id' => 'sometimes|exists:departments,id',
            'emp_type' => ['nullable', Rule::in(['Employee', 'Manager', 'Asset Admin', 'Admin'])],
            'job_type' => ['nullable', Rule::in(['Permanent', 'Contractual'])],
            'emp_status' => ['nullable', Rule::in(['Working', 'Resigned', 'Notice Period'])],
            'pay_grade_id' => 'sometimes|exists:pay_grades,id',
            'gross_salary' => 'nullable|integer|min:0',
            'manager_id' => 'nullable|exists:employees,id',
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
