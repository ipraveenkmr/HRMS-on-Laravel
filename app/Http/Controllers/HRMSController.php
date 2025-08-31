<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Employee;
use App\Models\Department;
use App\Models\CompanyDetail;
use App\Models\BranchDetail;
use App\Models\FinancialYear;
use App\Models\PayGrade;
use App\Models\NotificationDetail;
use App\Models\AssetCategory;
use App\Models\Asset;
use App\Models\AttendanceRecord;
use Illuminate\Http\JsonResponse;

class HRMSController extends Controller
{
    public function index()
    {
        return response()->json(['message' => 'HRMS Laravel API']);
    }

    public function getDashboard(): JsonResponse
    {
        $employees = Employee::count();
        $departments = Department::count();
        $activeEmployees = Employee::where('emp_status', 'Working')->count();
        $todayAttendance = AttendanceRecord::whereDate('created_at', today())->count();
        
        return response()->json([
            'employees' => $employees,
            'departments' => $departments,
            'active_employees' => $activeEmployees,
            'today_attendance' => $todayAttendance
        ]);
    }

    public function getDepartments(): JsonResponse
    {
        $departments = Department::orderBy('created_at')->get();
        return response()->json($departments);
    }

    public function getBranches(): JsonResponse
    {
        $branches = BranchDetail::with('companyDetail')->orderBy('created_at')->get();
        return response()->json($branches);
    }

    public function getFinancialYears(): JsonResponse
    {
        $years = FinancialYear::orderBy('created_at')->get();
        return response()->json($years);
    }

    public function getNotifications(): JsonResponse
    {
        $notifications = NotificationDetail::orderBy('created_at')->get();
        return response()->json($notifications);
    }

    public function getAssetList(): JsonResponse
    {
        $assets = Asset::with('assetCategory')->orderBy('created_at')->get();
        return response()->json($assets);
    }

    public function getAssetCategories(): JsonResponse
    {
        $categories = AssetCategory::orderBy('created_at')->get();
        return response()->json($categories);
    }

    public function getUserList(): JsonResponse
    {
        $users = Employee::with(['department', 'payGrade'])->orderBy('created_at')->get();
        return response()->json($users);
    }

    public function getPayGrades(): JsonResponse
    {
        $payGrades = PayGrade::orderBy('created_at')->get();
        return response()->json($payGrades);
    }

    public function getCompanyDetails(): JsonResponse
    {
        $companies = CompanyDetail::orderBy('created_at')->get();
        return response()->json($companies);
    }

    public function getProfile($id): JsonResponse
    {
        $employee = Employee::with(['department', 'payGrade', 'companyDetail', 'branchDetail'])
            ->find($id);
        
        if (!$employee) {
            return response()->json(['error' => 'Employee not found'], 404);
        }
        
        return response()->json($employee);
    }

    public function updateProfile(Request $request, $id): JsonResponse
    {
        $employee = Employee::find($id);
        
        if (!$employee) {
            return response()->json(['error' => 'Employee not found'], 404);
        }
        
        $employee->update($request->all());
        
        return response()->json([
            'message' => 'Profile updated successfully',
            'employee' => $employee
        ]);
    }
}