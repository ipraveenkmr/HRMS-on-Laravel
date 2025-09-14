<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\LeaveTracker;
use App\Models\LeaveCalculator;
use App\Models\Leave;
use App\Models\FinancialYear;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;

class LeaveController extends Controller
{
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
            'financial_year_id' => 'sometimes|exists:financial_years,id',
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

        // Always set financial year automatically based on current date
        $financialYear = $this->getCurrentFinancialYear();
        if (!$financialYear) {
            // Get all available financial years for debugging
            $allFinancialYears = FinancialYear::pluck('year')->toArray();
            return response()->json([
                'message' => 'No active financial year found for the current date',
                'available_financial_years' => $allFinancialYears,
                'current_date' => Carbon::now()->format('Y-m-d'),
                'suggestion' => 'Please create a financial year record or ensure one exists for the current period'
            ], 400);
        }
        $validated['financial_year_id'] = $financialYear->id;

        $leave = LeaveTracker::create($validated);
        
        // Update leave calculator when leave tracker is created
        $this->updateLeaveCalculatorAfterCreation($leave);
        
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

        $oldStatus = $leave->leave_status;
        $leave->update($validated);
        
        // Update leave calculator if status changed to/from Approved
        if (isset($validated['leave_status']) && $oldStatus !== $validated['leave_status']) {
            $this->updateLeaveCalculatorAfterStatusChange($leave, $oldStatus, $validated['leave_status']);
        }
        
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

    public function getLeaveCalculatorByUsername($username): JsonResponse
    {
        $leaveCalculator = LeaveCalculator::with(['employee', 'financialYear'])
            ->whereHas('employee', function($query) use ($username) {
                $query->where('username', $username);
            })
            ->get();
        
        if ($leaveCalculator->isEmpty()) {
            return response()->json(['error' => 'Leave calculator not found for username: ' . $username], 404);
        }
        
        // Format data to match frontend expectations
        $formattedData = $leaveCalculator->map(function ($calculator) {
            return [
                'id' => $calculator->id,
                'employee_id' => $calculator->employee_id,
                'username' => $calculator->username,
                'remaining_cl_days' => $calculator->remaining_cl_days ?? 0,
                'remaining_ei_days' => $calculator->remaining_ei_days ?? 0,
                'remaining_lwp_days' => $calculator->remaining_lwp_days ?? 0,
                'remaining_other_leave_in_days' => $calculator->remaining_other_leave_in_days ?? 0,
                'remaining_cl_hours' => $calculator->remaining_cl_hours ?? 0,
                'remaining_ei_hours' => $calculator->remaining_ei_hours ?? 0,
                'remaining_lwp_hours' => $calculator->remaining_lwp_hours ?? 0,
                'remaining_medical_leave_in_days' => $calculator->remaining_medical_leave_in_days ?? 0,
                'remaining_medical_leave_in_hours' => $calculator->remaining_medical_leave_in_hours ?? 0,
                'remaining_other_leave_in_hours' => $calculator->remaining_other_leave_in_hours ?? 0,
                'financial_year_id' => $calculator->financial_year_id,
                // Legacy format for compatibility
                'remaining_CL_Days' => $calculator->remaining_cl_days ?? 0,
                'remaining_EI_Days' => $calculator->remaining_ei_days ?? 0,
                'remaining_LWP_Days' => $calculator->remaining_lwp_days ?? 0,
            ];
        });
        
        return response()->json($formattedData);
    }

    public function createLeaveCalculator(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'financial_year_id' => 'required|exists:financial_years,id',
            'username' => 'required|string|max:200',
            'employee_id' => 'required|exists:employees,id',
            'remaining_cl_days' => 'nullable|numeric|min:0',
            'remaining_cl_hours' => 'nullable|numeric|min:0',
            'remaining_ei_days' => 'nullable|numeric|min:0',
            'remaining_ei_hours' => 'nullable|numeric|min:0',
            'remaining_lwp_days' => 'nullable|numeric|min:0',
            'remaining_lwp_hours' => 'nullable|numeric|min:0',
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
            'remaining_cl_days' => 'nullable|numeric|min:0',
            'remaining_cl_hours' => 'nullable|numeric|min:0',
            'remaining_ei_days' => 'nullable|numeric|min:0',
            'remaining_ei_hours' => 'nullable|numeric|min:0',
            'remaining_lwp_days' => 'nullable|numeric|min:0',
            'remaining_lwp_hours' => 'nullable|numeric|min:0',
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
        $leaveCalculators = LeaveCalculator::with(['employee', 'financialYear'])
            ->orderBy('created_at')
            ->get();
        
        // Format data to match frontend expectations
        $formattedData = $leaveCalculators->map(function ($calculator) {
            return [
                'id' => $calculator->id,
                'employee_id' => $calculator->employee_id,
                'username' => $calculator->username,
                'employee' => $calculator->employee_id,
                'remaining_CL_Days' => $calculator->remaining_cl_days ?? 0,
                'remaining_EI_Days' => $calculator->remaining_ei_days ?? 0,
                'remaining_LWP_Days' => $calculator->remaining_lwp_days ?? 0,
                'remaining_other_leave_in_days' => $calculator->remaining_other_leave_in_days ?? 0,
                'remaining_cl_hours' => $calculator->remaining_cl_hours ?? 0,
                'remaining_ei_hours' => $calculator->remaining_ei_hours ?? 0,
                'remaining_lwp_hours' => $calculator->remaining_lwp_hours ?? 0,
                'remaining_medical_leave_in_days' => $calculator->remaining_medical_leave_in_days ?? 0,
                'remaining_medical_leave_in_hours' => $calculator->remaining_medical_leave_in_hours ?? 0,
                'remaining_other_leave_in_hours' => $calculator->remaining_other_leave_in_hours ?? 0,
                'financial_year_id' => $calculator->financial_year_id,
            ];
        });
        
        return response()->json($formattedData);
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

        $oldStatus = $leave->leave_status;
        $leave->update(['leave_status' => $validated['status']]);
        
        // Update leave calculator if status changed
        if ($oldStatus !== $validated['status']) {
            $this->updateLeaveCalculatorAfterStatusChange($leave, $oldStatus, $validated['status']);
        }

        return response()->json([
            'message' => 'Leave status updated successfully',
            'leave' => $leave->load(['employee', 'department', 'financialYear'])
        ]);
    }

    // Leave Configuration Management (for Super Admin)
    public function indexLeaveConfig(): JsonResponse
    {
        $leaves = Leave::with(['financialYear'])
            ->orderBy('financial_year_id')
            ->get();
        
        return response()->json($leaves);
    }

    public function showLeaveConfig($id): JsonResponse
    {
        $leave = Leave::with(['financialYear'])->find($id);
        
        if (!$leave) {
            return response()->json(['error' => 'Leave configuration not found'], 404);
        }
        
        return response()->json($leave);
    }

    public function storeLeaveConfig(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'financial_year_id' => 'required|exists:financial_years,id|unique:leaves',
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
        ]);

        $leave = Leave::create($validated);
        
        return response()->json([
            'message' => 'Leave configuration created successfully',
            'leave' => $leave->load(['financialYear'])
        ], 201);
    }

    public function updateLeaveConfig(Request $request, $id): JsonResponse
    {
        $leave = Leave::find($id);
        
        if (!$leave) {
            return response()->json(['error' => 'Leave configuration not found'], 404);
        }

        $validated = $request->validate([
            'financial_year_id' => 'sometimes|exists:financial_years,id|unique:leaves,financial_year_id,' . $leave->id,
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
        ]);

        $leave->update($validated);
        
        return response()->json([
            'message' => 'Leave configuration updated successfully',
            'leave' => $leave->load(['financialYear'])
        ]);
    }

    public function destroyLeaveConfig($id): JsonResponse
    {
        $leave = Leave::find($id);
        
        if (!$leave) {
            return response()->json(['error' => 'Leave configuration not found'], 404);
        }
        
        $leave->delete();
        
        return response()->json(['message' => 'Leave configuration deleted successfully']);
    }

    private function updateLeaveCalculatorAfterCreation(LeaveTracker $leave)
    {
        // Find the leave calculator for this employee and financial year
        $leaveCalculator = LeaveCalculator::where('employee_id', $leave->employee_id)
            ->where('financial_year_id', $leave->financial_year_id)
            ->first();
        
        // If no leave calculator exists, create one with leave totals from Leave config
        if (!$leaveCalculator) {
            // Get leave config for this financial year
            $leaveConfig = Leave::where('financial_year_id', $leave->financial_year_id)->first();
            
            if ($leaveConfig) {
                $leaveCalculator = LeaveCalculator::create([
                    'financial_year_id' => $leave->financial_year_id,
                    'username' => $leave->username,
                    'employee_id' => $leave->employee_id,
                    'remaining_cl_days' => $leaveConfig->cl_days,
                    'remaining_cl_hours' => $leaveConfig->cl_hours,
                    'remaining_ei_days' => $leaveConfig->ei_days,
                    'remaining_ei_hours' => $leaveConfig->ei_hours,
                    'remaining_lwp_days' => $leaveConfig->lwp_days,
                    'remaining_lwp_hours' => $leaveConfig->lwp_hours,
                    'remaining_medical_leave_in_days' => $leaveConfig->medical_leave_in_days,
                    'remaining_medical_leave_in_hours' => $leaveConfig->medical_leave_in_hours,
                    'remaining_other_leave_in_days' => $leaveConfig->other_leave_in_days,
                    'remaining_other_leave_in_hours' => $leaveConfig->other_leave_in_hours,
                ]);
            } else {
                // Create with defaults if no config exists
                $leaveCalculator = LeaveCalculator::create([
                    'financial_year_id' => $leave->financial_year_id,
                    'username' => $leave->username,
                    'employee_id' => $leave->employee_id,
                ]);
            }
        }
        
        // Only deduct leave if the status is approved
        if ($leave->leave_status === 'Approved') {
            // Update remaining leave counts by subtracting the used leave
            $leaveCalculator->update([
                'remaining_cl_days' => max(0, $leaveCalculator->remaining_cl_days - ($leave->cl_days ?? 0)),
                'remaining_cl_hours' => max(0, $leaveCalculator->remaining_cl_hours - ($leave->cl_hours ?? 0)),
                'remaining_ei_days' => max(0, $leaveCalculator->remaining_ei_days - ($leave->ei_days ?? 0)),
                'remaining_ei_hours' => max(0, $leaveCalculator->remaining_ei_hours - ($leave->ei_hours ?? 0)),
                'remaining_lwp_days' => max(0, $leaveCalculator->remaining_lwp_days - ($leave->lwp_days ?? 0)),
                'remaining_lwp_hours' => max(0, $leaveCalculator->remaining_lwp_hours - ($leave->lwp_hours ?? 0)),
                'remaining_medical_leave_in_days' => max(0, $leaveCalculator->remaining_medical_leave_in_days - ($leave->medical_leave_in_days ?? 0)),
                'remaining_medical_leave_in_hours' => max(0, $leaveCalculator->remaining_medical_leave_in_hours - ($leave->medical_leave_in_hours ?? 0)),
                'remaining_other_leave_in_days' => max(0, $leaveCalculator->remaining_other_leave_in_days - ($leave->other_leave_in_days ?? 0)),
                'remaining_other_leave_in_hours' => max(0, $leaveCalculator->remaining_other_leave_in_hours - ($leave->other_leave_in_hours ?? 0)),
            ]);
        }
    }

    private function updateLeaveCalculatorAfterStatusChange(LeaveTracker $leave, $oldStatus, $newStatus)
    {
        $leaveCalculator = LeaveCalculator::where('employee_id', $leave->employee_id)
            ->where('financial_year_id', $leave->financial_year_id)
            ->first();
        
        if (!$leaveCalculator) {
            return;
        }
        
        // If changing from non-approved to approved, deduct leave
        if ($oldStatus !== 'Approved' && $newStatus === 'Approved') {
            $leaveCalculator->update([
                'remaining_cl_days' => max(0, $leaveCalculator->remaining_cl_days - ($leave->cl_days ?? 0)),
                'remaining_cl_hours' => max(0, $leaveCalculator->remaining_cl_hours - ($leave->cl_hours ?? 0)),
                'remaining_ei_days' => max(0, $leaveCalculator->remaining_ei_days - ($leave->ei_days ?? 0)),
                'remaining_ei_hours' => max(0, $leaveCalculator->remaining_ei_hours - ($leave->ei_hours ?? 0)),
                'remaining_lwp_days' => max(0, $leaveCalculator->remaining_lwp_days - ($leave->lwp_days ?? 0)),
                'remaining_lwp_hours' => max(0, $leaveCalculator->remaining_lwp_hours - ($leave->lwp_hours ?? 0)),
                'remaining_medical_leave_in_days' => max(0, $leaveCalculator->remaining_medical_leave_in_days - ($leave->medical_leave_in_days ?? 0)),
                'remaining_medical_leave_in_hours' => max(0, $leaveCalculator->remaining_medical_leave_in_hours - ($leave->medical_leave_in_hours ?? 0)),
                'remaining_other_leave_in_days' => max(0, $leaveCalculator->remaining_other_leave_in_days - ($leave->other_leave_in_days ?? 0)),
                'remaining_other_leave_in_hours' => max(0, $leaveCalculator->remaining_other_leave_in_hours - ($leave->other_leave_in_hours ?? 0)),
            ]);
        }
        // If changing from approved to non-approved, add leave back
        elseif ($oldStatus === 'Approved' && $newStatus !== 'Approved') {
            // Get the original leave config to check max limits
            $leaveConfig = Leave::where('financial_year_id', $leave->financial_year_id)->first();
            
            $updates = [
                'remaining_cl_days' => $leaveCalculator->remaining_cl_days + ($leave->cl_days ?? 0),
                'remaining_cl_hours' => $leaveCalculator->remaining_cl_hours + ($leave->cl_hours ?? 0),
                'remaining_ei_days' => $leaveCalculator->remaining_ei_days + ($leave->ei_days ?? 0),
                'remaining_ei_hours' => $leaveCalculator->remaining_ei_hours + ($leave->ei_hours ?? 0),
                'remaining_lwp_days' => $leaveCalculator->remaining_lwp_days + ($leave->lwp_days ?? 0),
                'remaining_lwp_hours' => $leaveCalculator->remaining_lwp_hours + ($leave->lwp_hours ?? 0),
                'remaining_medical_leave_in_days' => $leaveCalculator->remaining_medical_leave_in_days + ($leave->medical_leave_in_days ?? 0),
                'remaining_medical_leave_in_hours' => $leaveCalculator->remaining_medical_leave_in_hours + ($leave->medical_leave_in_hours ?? 0),
                'remaining_other_leave_in_days' => $leaveCalculator->remaining_other_leave_in_days + ($leave->other_leave_in_days ?? 0),
                'remaining_other_leave_in_hours' => $leaveCalculator->remaining_other_leave_in_hours + ($leave->other_leave_in_hours ?? 0),
            ];
            
            // Cap at original allocation if config exists
            if ($leaveConfig) {
                $updates['remaining_cl_days'] = min($updates['remaining_cl_days'], $leaveConfig->cl_days ?? 0);
                $updates['remaining_cl_hours'] = min($updates['remaining_cl_hours'], $leaveConfig->cl_hours ?? 0);
                $updates['remaining_ei_days'] = min($updates['remaining_ei_days'], $leaveConfig->ei_days ?? 0);
                $updates['remaining_ei_hours'] = min($updates['remaining_ei_hours'], $leaveConfig->ei_hours ?? 0);
                $updates['remaining_lwp_days'] = min($updates['remaining_lwp_days'], $leaveConfig->lwp_days ?? 0);
                $updates['remaining_lwp_hours'] = min($updates['remaining_lwp_hours'], $leaveConfig->lwp_hours ?? 0);
                $updates['remaining_medical_leave_in_days'] = min($updates['remaining_medical_leave_in_days'], $leaveConfig->medical_leave_in_days ?? 0);
                $updates['remaining_medical_leave_in_hours'] = min($updates['remaining_medical_leave_in_hours'], $leaveConfig->medical_leave_in_hours ?? 0);
                $updates['remaining_other_leave_in_days'] = min($updates['remaining_other_leave_in_days'], $leaveConfig->other_leave_in_days ?? 0);
                $updates['remaining_other_leave_in_hours'] = min($updates['remaining_other_leave_in_hours'], $leaveConfig->other_leave_in_hours ?? 0);
            }
            
            $leaveCalculator->update($updates);
        }
    }
}