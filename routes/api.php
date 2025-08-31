<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\HRMSController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\PayslipController;
use App\Http\Controllers\LeaveController;
use App\Http\Controllers\AssetController;
use App\Http\Controllers\LoanController;

// Root route
Route::get('/', [HRMSController::class, 'index']);

// Health check
Route::get('/health', function () {
    return response()->json(['status' => 'healthy']);
});

// Authentication routes (public)
Route::prefix('/auth')->group(function () {
    Route::post('/signup', [AuthController::class, 'signup']);
    Route::post('/token', [AuthController::class, 'login']);
    Route::get('/users', [AuthController::class, 'getUsers']);
    Route::put('/users/{user_id}', [AuthController::class, 'updateUser']);
    Route::put('/users/username/{username}', [AuthController::class, 'updateUserByUsername']);
    Route::post('/users/{user_id}/reset-password', [AuthController::class, 'resetUserPassword']);
    Route::post('/users/username/{username}/reset-password', [AuthController::class, 'resetPasswordByUsername']);
    Route::delete('/users/{user_id}', [AuthController::class, 'deleteUser']);
});

// Employee routes (protected)
Route::prefix('/employees')->middleware('auth:sanctum')->group(function () {
    Route::get('/', [EmployeeController::class, 'index']);
    Route::post('/', [EmployeeController::class, 'store']);
    Route::get('/{employee_id}', [EmployeeController::class, 'show']);
    Route::put('/{employee_id}', [EmployeeController::class, 'update']);
    Route::delete('/{employee_id}', [EmployeeController::class, 'destroy']);
    Route::get('/username/{username}', [EmployeeController::class, 'getEmployeeByUsername']);
    Route::get('/department/{dept_id}', [EmployeeController::class, 'getEmployeesByDepartment']);
    Route::get('/manager/{manager_id}', [EmployeeController::class, 'getEmployeesByManager']);
    Route::post('/upload-profile-picture', [EmployeeController::class, 'uploadProfilePicture']);
    Route::post('/upload-aadhaar', [EmployeeController::class, 'uploadAadhaar']);
    Route::post('/upload-pan', [EmployeeController::class, 'uploadPan']);
    Route::get('/departments', [EmployeeController::class, 'getDepartments']);
    Route::get('/branches', [EmployeeController::class, 'getBranches']);
    Route::get('/paygrades', [EmployeeController::class, 'getPaygrades']);
    Route::get('/companies', [EmployeeController::class, 'getCompanies']);
});

// Attendance routes (protected)
Route::prefix('/attendance')->middleware('auth:sanctum')->group(function () {
    Route::get('/', [AttendanceController::class, 'index']);
    Route::post('/', [AttendanceController::class, 'store']);
    Route::get('/{attendance_id}', [AttendanceController::class, 'show']);
    Route::put('/{attendance_id}', [AttendanceController::class, 'update']);
    Route::delete('/{attendance_id}', [AttendanceController::class, 'destroy']);
    Route::get('/employee/{username}', [AttendanceController::class, 'getEmployeeAttendance']);
    Route::get('/check/{date}/{username}', [AttendanceController::class, 'checkEmployeeAttendance']);
    Route::get('/department/{dept_id}', [AttendanceController::class, 'getAttendanceByDepartment']);
    Route::get('/manager/{manager_id}', [AttendanceController::class, 'getAttendanceByManager']);
    Route::get('/date-range/{date_from}/{date_to}', [AttendanceController::class, 'getAttendanceByDateRange']);
    Route::get('/export-csv/{date_from}/{date_to}', [AttendanceController::class, 'exportAttendanceCsv']);
});

// Tasks routes (protected)
Route::prefix('/tasks')->middleware('auth:sanctum')->group(function () {
    Route::get('/', [TaskController::class, 'index']);
    Route::post('/', [TaskController::class, 'store']);
    Route::get('/{task_id}', [TaskController::class, 'show']);
    Route::put('/{task_id}', [TaskController::class, 'update']);
    Route::delete('/{task_id}', [TaskController::class, 'destroy']);
    Route::get('/employee/{username}', [TaskController::class, 'getEmployeeTasks']);
    Route::get('/department/{dept_id}', [TaskController::class, 'getTasksByDepartment']);
    Route::get('/manager/{manager_id}', [TaskController::class, 'getTasksByManager']);
});

// Daily Tasks routes (protected)
Route::prefix('/daily-tasks')->middleware('auth:sanctum')->group(function () {
    Route::get('/', [TaskController::class, 'indexDailyTasks']);
    Route::post('/', [TaskController::class, 'storeDailyTask']);
    Route::get('/{task_id}', [TaskController::class, 'showDailyTask']);
    Route::put('/{task_id}', [TaskController::class, 'updateDailyTask']);
    Route::delete('/{task_id}', [TaskController::class, 'destroyDailyTask']);
    Route::get('/employee/{username}', [TaskController::class, 'getEmployeeDailyTasks']);
    Route::get('/department/{dept_id}', [TaskController::class, 'getDailyTasksByDepartment']);
    Route::get('/manager/{manager_id}', [TaskController::class, 'getDailyTasksByManager']);
});

// Leave routes (protected)
Route::prefix('/leave')->middleware('auth:sanctum')->group(function () {
    Route::get('/', [LeaveController::class, 'index']);
    Route::post('/', [LeaveController::class, 'store']);
    Route::get('/{leave_id}', [LeaveController::class, 'show']);
    Route::put('/{leave_id}', [LeaveController::class, 'update']);
    Route::delete('/{leave_id}', [LeaveController::class, 'destroy']);
    Route::get('/employee/{username}', [LeaveController::class, 'getEmployeeLeave']);
    Route::get('/department/{dept_id}', [LeaveController::class, 'getLeaveByDepartment']);
    Route::get('/manager/{manager_id}', [LeaveController::class, 'getLeaveByManager']);
    Route::get('/calculator/{employee_id}', [LeaveController::class, 'getLeaveCalculator']);
    Route::post('/calculator', [LeaveController::class, 'createLeaveCalculator']);
    Route::put('/calculator/{calculator_id}', [LeaveController::class, 'updateLeaveCalculator']);
});

// Assets routes (protected)
Route::prefix('/assets')->middleware('auth:sanctum')->group(function () {
    Route::get('/', [AssetController::class, 'index']);
    Route::post('/', [AssetController::class, 'store']);
    Route::get('/{asset_id}', [AssetController::class, 'show']);
    Route::put('/{asset_id}', [AssetController::class, 'update']);
    Route::delete('/{asset_id}', [AssetController::class, 'destroy']);
    Route::get('/employee/{username}', [AssetController::class, 'getEmployeeAssets']);
    Route::get('/department/{dept_id}', [AssetController::class, 'getAssetsByDepartment']);
    Route::get('/manager/{manager_id}', [AssetController::class, 'getAssetsByManager']);
    Route::get('/category/{category_id}', [AssetController::class, 'getAssetsByCategory']);
});

// Asset Categories routes (protected)
Route::prefix('/asset-categories')->middleware('auth:sanctum')->group(function () {
    Route::get('/', [AssetController::class, 'indexCategories']);
    Route::post('/', [AssetController::class, 'storeCategory']);
    Route::get('/{category_id}', [AssetController::class, 'showCategory']);
    Route::put('/{category_id}', [AssetController::class, 'updateCategory']);
    Route::delete('/{category_id}', [AssetController::class, 'destroyCategory']);
});

// Payroll routes (protected)
Route::prefix('/payroll')->middleware('auth:sanctum')->group(function () {
    Route::get('/', [PayslipController::class, 'index']);
    Route::post('/', [PayslipController::class, 'store']);
    Route::get('/{payslip_id}', [PayslipController::class, 'show']);
    Route::put('/{payslip_id}', [PayslipController::class, 'update']);
    Route::delete('/{payslip_id}', [PayslipController::class, 'destroy']);
    Route::get('/employee/{username}', [PayslipController::class, 'getEmployeePayslips']);
    Route::get('/department/{dept_id}', [PayslipController::class, 'getPayslipsByDepartment']);
    Route::get('/manager/{manager_id}', [PayslipController::class, 'getPayslipsByManager']);
});

// Loans routes (protected)
Route::prefix('/loans')->middleware('auth:sanctum')->group(function () {
    Route::get('/', [LoanController::class, 'index']);
    Route::post('/', [LoanController::class, 'store']);
    Route::get('/{loan_id}', [LoanController::class, 'show']);
    Route::put('/{loan_id}', [LoanController::class, 'update']);
    Route::delete('/{loan_id}', [LoanController::class, 'destroy']);
    Route::get('/employee/{username}', [LoanController::class, 'getEmployeeLoans']);
    Route::get('/department/{dept_id}', [LoanController::class, 'getLoansByDepartment']);
    Route::get('/manager/{manager_id}', [LoanController::class, 'getLoansByManager']);
    Route::post('/calculate-emi', [LoanController::class, 'calculateEmi']);
    Route::get('/check/{employee_id}', [LoanController::class, 'checkLoan']);
});

// Dashboard routes (protected)
Route::prefix('/dashboard')->middleware('auth:sanctum')->group(function () {
    Route::get('/stats', [HRMSController::class, 'getDashboardStats']);
    Route::get('/notifications', [HRMSController::class, 'getNotifications']);
    Route::get('/financial-year', [HRMSController::class, 'getFinancialYearInfo']);
});

// Companies routes (protected)
Route::prefix('/companies')->middleware('auth:sanctum')->group(function () {
    Route::get('/', [HRMSController::class, 'getCompanies']);
    Route::post('/', [HRMSController::class, 'storeCompany']);
    Route::get('/{company_id}', [HRMSController::class, 'showCompany']);
    Route::put('/{company_id}', [HRMSController::class, 'updateCompany']);
    Route::delete('/{company_id}', [HRMSController::class, 'destroyCompany']);
});

// Departments routes (protected)
Route::prefix('/departments')->middleware('auth:sanctum')->group(function () {
    Route::get('/', [HRMSController::class, 'getDepartments']);
    Route::post('/', [HRMSController::class, 'storeDepartment']);
    Route::get('/{dept_id}', [HRMSController::class, 'showDepartment']);
    Route::put('/{dept_id}', [HRMSController::class, 'updateDepartment']);
    Route::delete('/{dept_id}', [HRMSController::class, 'destroyDepartment']);
});

// Paygrade routes (protected)
Route::prefix('/paygrade')->middleware('auth:sanctum')->group(function () {
    Route::get('/', [HRMSController::class, 'getPayGrades']);
    Route::post('/', [HRMSController::class, 'storePayGrade']);
    Route::get('/{paygrade_id}', [HRMSController::class, 'showPayGrade']);
    Route::put('/{paygrade_id}', [HRMSController::class, 'updatePayGrade']);
    Route::delete('/{paygrade_id}', [HRMSController::class, 'destroyPayGrade']);
});

// Financial Years routes (protected)
Route::prefix('/financial-years')->middleware('auth:sanctum')->group(function () {
    Route::get('/', [HRMSController::class, 'getFinancialYears']);
    Route::post('/', [HRMSController::class, 'storeFinancialYear']);
    Route::get('/{year_id}', [HRMSController::class, 'showFinancialYear']);
    Route::put('/{year_id}', [HRMSController::class, 'updateFinancialYear']);
    Route::delete('/{year_id}', [HRMSController::class, 'destroyFinancialYear']);
});

// Travel Expenses routes (protected)
Route::prefix('/travel-expenses')->middleware('auth:sanctum')->group(function () {
    Route::get('/', [HRMSController::class, 'getTravelExpenses']);
    Route::post('/', [HRMSController::class, 'storeTravelExpense']);
    Route::get('/{expense_id}', [HRMSController::class, 'showTravelExpense']);
    Route::put('/{expense_id}', [HRMSController::class, 'updateTravelExpense']);
    Route::delete('/{expense_id}', [HRMSController::class, 'destroyTravelExpense']);
    Route::get('/employee/{username}', [HRMSController::class, 'getEmployeeTravelExpenses']);
    Route::get('/department/{dept_id}', [HRMSController::class, 'getTravelExpensesByDepartment']);
    Route::get('/manager/{manager_id}', [HRMSController::class, 'getTravelExpensesByManager']);
});

// Fallback route for SPA
Route::fallback(function () {
    return response()->json(['message' => 'Route not found'], 404);
});