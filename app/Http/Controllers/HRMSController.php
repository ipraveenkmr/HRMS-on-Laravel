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
use Illuminate\Validation\Rule;

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

    public function getDashboardStats(): JsonResponse
    {
        $employees = Employee::count();
        $todayAttendance = AttendanceRecord::whereDate('created_at', today())->count();

        // Get attendance data for last 30 days
        $attendanceData = AttendanceRecord::selectRaw('DATE(created_at) as date, COUNT(*) as present_count')
            ->where('created_at', '>=', now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get();

        // Format data for Google Charts (2D array format)
        $chartData = [['Date', 'Present', 'Absent']]; // Header row
        
        foreach ($attendanceData as $record) {
            $date = date('M j', strtotime($record->date)); // Format: "Jan 1"
            $present = $record->present_count;
            $absent = max(0, $employees - $present); // Calculate absent (ensure non-negative)
            
            $chartData[] = [$date, $present, $absent];
        }

        return response()->json([
            'emp_count' => $employees,
            'asset_count' => Asset::count(),
            'attendance_chart_data' => $chartData,
            'attendance_count' => $todayAttendance
        ]);
    }

    public function getFinancialYearInfo(): JsonResponse
    {
        $currentYear = date('Y');
        $currentFinancialYear = FinancialYear::where('year', 'LIKE', '%' . $currentYear . '%')
            ->orWhere('year', 'LIKE', '%' . ($currentYear - 1) . '%')
            ->first();

        if (!$currentFinancialYear) {
            // If no current financial year found, get the latest one
            $currentFinancialYear = FinancialYear::latest('created_at')->first();
        }

        $allFinancialYears = FinancialYear::orderBy('created_at', 'desc')->get();

        return response()->json([
            'current_financial_year' => $currentFinancialYear,
            'all_financial_years' => $allFinancialYears
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

    public function storeFinancialYear(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'year' => 'required|string|max:99|unique:financial_years,year',
            'working_hours' => 'sometimes|numeric|min:0|max:24',
            'loan_interest_rate' => 'sometimes|numeric|min:0|max:100',
            'login_time' => 'sometimes|string|max:99',
            'logout_time' => 'sometimes|string|max:99'
        ]);

        $financialYear = FinancialYear::create($validated);

        return response()->json($financialYear, 201);
    }

    public function showFinancialYear($year_id): JsonResponse
    {
        $financialYear = FinancialYear::find($year_id);

        if (!$financialYear) {
            return response()->json(['detail' => 'Financial Year not found'], 404);
        }

        return response()->json($financialYear);
    }

    public function updateFinancialYear(Request $request, $year_id): JsonResponse
    {
        $financialYear = FinancialYear::find($year_id);

        if (!$financialYear) {
            return response()->json(['detail' => 'Financial Year not found'], 404);
        }

        $validated = $request->validate([
            'year' => [
                'sometimes',
                'string',
                'max:99',
                Rule::unique('financial_years', 'year')->ignore($year_id)
            ],
            'working_hours' => 'sometimes|numeric|min:0|max:24',
            'loan_interest_rate' => 'sometimes|numeric|min:0|max:100',
            'login_time' => 'sometimes|string|max:99',
            'logout_time' => 'sometimes|string|max:99'
        ]);

        $financialYear->update($validated);

        return response()->json($financialYear);
    }

    public function destroyFinancialYear($year_id): JsonResponse
    {
        $financialYear = FinancialYear::find($year_id);

        if (!$financialYear) {
            return response()->json(['detail' => 'Financial Year not found'], 404);
        }

        $financialYear->delete();

        return response()->json(['message' => 'Financial Year deleted successfully']);
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

    public function storePayGrade(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'grade' => 'required|integer|unique:pay_grades,grade',
            'min_gross_range' => 'required|integer|min:0',
            'max_gross_range' => 'required|integer|min:0|gt:min_gross_range',
            'basic' => 'required|integer|min:0',
            'hra' => 'required|integer|min:0',
            'ta' => 'required|integer|min:0',
            'com' => 'required|integer|min:0',
            'medical' => 'required|integer|min:0',
            'edu' => 'required|integer|min:0',
            'sa' => 'required|integer|min:0',
            'income_tax' => 'required|integer|min:0'
        ]);

        $payGrade = PayGrade::create($validated);

        return response()->json($payGrade, 201);
    }

    public function showPayGrade($paygrade_id): JsonResponse
    {
        $payGrade = PayGrade::find($paygrade_id);

        if (!$payGrade) {
            return response()->json(['detail' => 'PayGrade not found'], 404);
        }

        return response()->json($payGrade);
    }

    public function updatePayGrade(Request $request, $paygrade_id): JsonResponse
    {
        $payGrade = PayGrade::find($paygrade_id);

        if (!$payGrade) {
            return response()->json(['detail' => 'PayGrade not found'], 404);
        }

        $validated = $request->validate([
            'grade' => [
                'sometimes',
                'integer',
                Rule::unique('pay_grades', 'grade')->ignore($paygrade_id)
            ],
            'min_gross_range' => 'sometimes|integer|min:0',
            'max_gross_range' => 'sometimes|integer|min:0',
            'basic' => 'sometimes|integer|min:0',
            'hra' => 'sometimes|integer|min:0',
            'ta' => 'sometimes|integer|min:0',
            'com' => 'sometimes|integer|min:0',
            'medical' => 'sometimes|integer|min:0',
            'edu' => 'sometimes|integer|min:0',
            'sa' => 'sometimes|integer|min:0',
            'income_tax' => 'sometimes|integer|min:0'
        ]);

        $payGrade->update($validated);

        return response()->json($payGrade);
    }

    public function destroyPayGrade($paygrade_id): JsonResponse
    {
        $payGrade = PayGrade::find($paygrade_id);

        if (!$payGrade) {
            return response()->json(['detail' => 'PayGrade not found'], 404);
        }

        $payGrade->delete();

        return response()->json(['message' => 'PayGrade deleted successfully']);
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

    // Department CRUD Methods
    public function storeDepartment(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'department_name' => 'required|string|max:99|unique:departments,department_name'
        ]);

        $department = Department::create($validated);

        return response()->json($department, 201);
    }

    public function showDepartment($dept_id): JsonResponse
    {
        $department = Department::find($dept_id);

        if (!$department) {
            return response()->json(['detail' => 'Department not found'], 404);
        }

        return response()->json($department);
    }

    public function updateDepartment(Request $request, $dept_id): JsonResponse
    {
        $department = Department::find($dept_id);

        if (!$department) {
            return response()->json(['detail' => 'Department not found'], 404);
        }

        $validated = $request->validate([
            'department_name' => [
                'sometimes',
                'string',
                'max:99',
                Rule::unique('departments', 'department_name')->ignore($dept_id)
            ]
        ]);

        $department->update($validated);

        return response()->json($department);
    }

    public function destroyDepartment($dept_id): JsonResponse
    {
        $department = Department::find($dept_id);

        if (!$department) {
            return response()->json(['detail' => 'Department not found'], 404);
        }

        $department->delete();

        return response()->json(['message' => 'Department deleted successfully']);
    }
}
