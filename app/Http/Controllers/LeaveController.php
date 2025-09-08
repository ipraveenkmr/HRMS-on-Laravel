<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\LeaveTracker;
use App\Models\LeaveCalculator;
use App\Models\Leave;
use Illuminate\Http\JsonResponse;

class LeaveController extends Controller
{
    // Leave Tracker
    public function index(): JsonResponse
    {
        $leaves = LeaveTracker::with(['employee', 'department', 'financialYear'])
            ->orderBy('created_at')
            ->get();
        
        return response()->json($leaves);
    }

    public function show($id): JsonResponse
    {
        $leave = LeaveTracker::with(['employee', 'department', 'financialYear'])->find($id);
        
        if (!$leave) {
            return response()->json(['error' => 'Leave record not found'], 404);
        }
        
        return response()->json($leave);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'financial_year_id' => 'required|exists:financial_years,id',
            'username' => 'nullable|string|max:200',
            'employee_id' => 'required|exists:employees,id',
            'department_id' => 'required|exists:departments,id',
            'cl_days' => 'nullable|numeric|min:0',
            'cl_hours' => 'nullable|numeric|min:0',
            'ei_days' => 'nullable|numeric|min:0',
            'ei_hours' => 'nullable|numeric|min:0',
            'lwp_days' => 'nullable|numeric|min:0',
            'lwp_hours' => 'nullable|numeric|min:0',
            'medical_leave_in_days' => 'nullable|numeric|min:0',
            'medical_leave_in_hours' => 'nullable|numeric|min:0',
            'other_leave_in_days' => 'nullable|numeric|min:0',
            'other_leave_in_hours' => 'nullable|numeric|min:0',
            'leave_status' => 'nullable|string|max:99',
            'leave_reason' => 'nullable|string|max:99',
            'leave_from_date' => 'nullable|string|max:99',
            'leave_from_month' => 'nullable|string|max:99',
            'leave_from_year' => 'nullable|string|max:99',
            'leave_to_date' => 'nullable|string|max:99',
            'leave_to_month' => 'nullable|string|max:99',
            'leave_to_year' => 'nullable|string|max:99',
        ]);

        $leave = LeaveTracker::create($validated);
        
        return response()->json([
            'message' => 'Leave application created successfully',
            'leave' => $leave->load(['employee', 'department', 'financialYear'])
        ], 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $leave = LeaveTracker::find($id);
        
        if (!$leave) {
            return response()->json(['error' => 'Leave record not found'], 404);
        }

        $validated = $request->validate([
            'financial_year_id' => 'sometimes|exists:financial_years,id',
            'username' => 'nullable|string|max:200',
            'employee_id' => 'sometimes|exists:employees,id',
            'department_id' => 'sometimes|exists:departments,id',
            'cl_days' => 'nullable|numeric|min:0',
            'cl_hours' => 'nullable|numeric|min:0',
            'ei_days' => 'nullable|numeric|min:0',
            'ei_hours' => 'nullable|numeric|min:0',
            'lwp_days' => 'nullable|numeric|min:0',
            'lwp_hours' => 'nullable|numeric|min:0',
            'medical_leave_in_days' => 'nullable|numeric|min:0',
            'medical_leave_in_hours' => 'nullable|numeric|min:0',
            'other_leave_in_days' => 'nullable|numeric|min:0',
            'other_leave_in_hours' => 'nullable|numeric|min:0',
            'leave_status' => 'nullable|string|max:99',
            'leave_reason' => 'nullable|string|max:99',
            'leave_from_date' => 'nullable|string|max:99',
            'leave_from_month' => 'nullable|string|max:99',
            'leave_from_year' => 'nullable|string|max:99',
            'leave_to_date' => 'nullable|string|max:99',
            'leave_to_month' => 'nullable|string|max:99',
            'leave_to_year' => 'nullable|string|max:99',
        ]);

        $leave->update($validated);
        
        return response()->json([
            'message' => 'Leave record updated successfully',
            'leave' => $leave->load(['employee', 'department', 'financialYear'])
        ]);
    }

    public function destroy($id): JsonResponse
    {
        $leave = LeaveTracker::find($id);
        
        if (!$leave) {
            return response()->json(['error' => 'Leave record not found'], 404);
        }
        
        $leave->delete();
        
        return response()->json(['message' => 'Leave record deleted successfully']);
    }

    public function getEmployeeLeave($username): JsonResponse
    {
        $leaves = LeaveTracker::with(['employee', 'department', 'financialYear'])
            ->where('username', $username)
            ->orderBy('created_at', 'desc')
            ->get();
        
        return response()->json($leaves);
    }

    public function getEmployeeLeaves($employeeId): JsonResponse
    {
        $leaves = LeaveTracker::with(['department', 'financialYear'])
            ->where('employee_id', $employeeId)
            ->orderBy('created_at')
            ->get();
        
        return response()->json($leaves);
    }

    public function getLeaveByDepartment($dept_id): JsonResponse
    {
        $leaves = LeaveTracker::with(['employee', 'financialYear'])
            ->where('department_id', $dept_id)
            ->orderBy('created_at', 'desc')
            ->get();
        
        return response()->json($leaves);
    }

    public function getLeaveByManager($manager_id): JsonResponse
    {
        $leaves = LeaveTracker::with(['employee', 'department', 'financialYear'])
            ->whereHas('employee', function($query) use ($manager_id) {
                $query->where('manager_id', $manager_id);
            })
            ->orderBy('created_at', 'desc')
            ->get();
        
        return response()->json($leaves);
    }

    public function getLeavesByDepartment($departmentId): JsonResponse
    {
        $leaves = LeaveTracker::with(['employee', 'financialYear'])
            ->where('department_id', $departmentId)
            ->orderBy('created_at')
            ->get();
        
        return response()->json($leaves);
    }

    public function getLeaveCalculator($employeeId): JsonResponse
    {
        $leaveCalculator = LeaveCalculator::with(['employee', 'financialYear'])
            ->where('employee_id', $employeeId)
            ->first();
        
        if (!$leaveCalculator) {
            return response()->json(['error' => 'Leave calculator not found'], 404);
        }
        
        return response()->json($leaveCalculator);
    }

    public function createLeaveCalculator(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'financial_year_id' => 'required|exists:financial_years,id',
            'username' => 'required|string|max:200',
            'employee_id' => 'required|exists:employees,id',
            'remaining_CL_Days' => 'nullable|numeric|min:0',
            'remaining_CL_Hours' => 'nullable|numeric|min:0',
            'remaining_EI_Days' => 'nullable|numeric|min:0',
            'remaining_EI_Hours' => 'nullable|numeric|min:0',
            'remaining_LWP_Days' => 'nullable|numeric|min:0',
            'remaining_LWP_Hours' => 'nullable|numeric|min:0',
            'remaining_medical_leave_in_days' => 'nullable|numeric|min:0',
            'remaining_medical_leave_in_hours' => 'nullable|numeric|min:0',
            'remaining_other_leave_in_days' => 'nullable|numeric|min:0',
            'remaining_other_leave_in_hours' => 'nullable|numeric|min:0',
        ]);

        $leaveCalculator = LeaveCalculator::create($validated);
        
        return response()->json([
            'message' => 'Leave calculator created successfully',
            'leave_calculator' => $leaveCalculator->load(['employee', 'financialYear'])
        ], 201);
    }

    public function updateLeaveCalculator(Request $request, $calculator_id): JsonResponse
    {
        $leaveCalculator = LeaveCalculator::find($calculator_id);
        
        if (!$leaveCalculator) {
            return response()->json(['error' => 'Leave calculator not found'], 404);
        }

        $validated = $request->validate([
            'financial_year_id' => 'sometimes|exists:financial_years,id',
            'username' => 'sometimes|string|max:200',
            'employee_id' => 'sometimes|exists:employees,id',
            'remaining_CL_Days' => 'nullable|numeric|min:0',
            'remaining_CL_Hours' => 'nullable|numeric|min:0',
            'remaining_EI_Days' => 'nullable|numeric|min:0',
            'remaining_EI_Hours' => 'nullable|numeric|min:0',
            'remaining_LWP_Days' => 'nullable|numeric|min:0',
            'remaining_LWP_Hours' => 'nullable|numeric|min:0',
            'remaining_medical_leave_in_days' => 'nullable|numeric|min:0',
            'remaining_medical_leave_in_hours' => 'nullable|numeric|min:0',
            'remaining_other_leave_in_days' => 'nullable|numeric|min:0',
            'remaining_other_leave_in_hours' => 'nullable|numeric|min:0',
        ]);

        $leaveCalculator->update($validated);
        
        return response()->json([
            'message' => 'Leave calculator updated successfully',
            'leave_calculator' => $leaveCalculator->load(['employee', 'financialYear'])
        ]);
    }

    public function getManageLeave(): JsonResponse
    {
        $pendingLeaves = LeaveTracker::with(['employee', 'department', 'financialYear'])
            ->where('leave_status', 'Pending')
            ->orderBy('created_at')
            ->get();
        
        return response()->json($pendingLeaves);
    }

    public function createLeaveManager(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'leave_id' => 'required|exists:leave_trackers,id',
            'status' => 'required|in:Approved,Rejected',
            'comments' => 'nullable|string'
        ]);

        $leave = LeaveTracker::find($validated['leave_id']);
        
        if (!$leave) {
            return response()->json(['error' => 'Leave record not found'], 404);
        }

        $leave->update(['leave_status' => $validated['status']]);

        return response()->json([
            'message' => 'Leave status updated successfully',
            'leave' => $leave->load(['employee', 'department', 'financialYear'])
        ]);
    }
}