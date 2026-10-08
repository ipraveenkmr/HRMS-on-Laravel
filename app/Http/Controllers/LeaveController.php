<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\LeaveTracker;
use App\Models\LeaveCalculator;
use App\Models\Leave;
use App\Models\FinancialYear;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;
use App\Models\Employee;
use Illuminate\Support\Facades\DB;

class LeaveController extends Controller
{
    private function normalizeLegacyAmounts(Request $request): void
    {
        $aliases = ['CL_Days' => 'cl_days', 'CL_Hours' => 'cl_hours', 'EI_Days' => 'ei_days',
            'EI_Hours' => 'ei_hours', 'LWP_Days' => 'lwp_days', 'LWP_Hours' => 'lwp_hours'];
        $normalized = [];
        foreach ($aliases as $old => $new) {
            if ($request->has($old) && !$request->has($new)) $normalized[$new] = $request->input($old);
        }
        $request->merge($normalized);
    }
    private function requireAdmin(Request $request): void
    {
        abort_unless($request->user()?->employee?->emp_type === 'Admin', 403);
    }

    private function auditLeave(LeaveTracker $leave, ?array $before, string $action, ?int $actorId): void
    {
        DB::table('leave_audits')->insert([
            'leave_tracker_id' => $leave->id,
            'actor_user_id' => $actorId,
            'action' => $action,
            'before' => $before ? json_encode($before) : null,
            'after' => json_encode($leave->fresh()->toArray()),
            'created_at' => now(),
        ]);
    }
    private const TYPE_DAYS = [
        'Casual Leave' => 'cl_days',
        'Half Day Leave' => 'cl_days',
        'Full Day Leave' => 'cl_days',
        'Earned Leave' => 'ei_days',
        'Medical Leave' => 'medical_leave_in_days',
        'Other Leave' => 'other_leave_in_days',
        'Unpaid Leave' => 'lwp_days',
    ];

    private function assignTypedDays(array $values, string $type, string $from, string $to): array
    {
        foreach (self::TYPE_DAYS as $field) $values[$field] = 0;
        $values[self::TYPE_DAYS[$type]] = $type === 'Half Day Leave' ? 0.5 : Carbon::parse($from)->diffInDays(Carbon::parse($to)) + 1;
        return $values;
    }

    private function normalizeLeaveDate($date, $month = null, $year = null): ?string
    {
        if (empty($date)) return null;
        if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
            return $date;
        }
        if ($month && $year) {
            $d = str_pad((string) $date, 2, '0', STR_PAD_LEFT);
            $m = str_pad((string) $month, 2, '0', STR_PAD_LEFT);
            $y = strlen((string) $year) === 2 ? '20' . $year : $year;
            return "$y-$m-$d";
        }
        try {
            return Carbon::parse($date)->toDateString();
        } catch (\Exception $e) {
            return null;
        }
    }

    private function overlaps(int $employeeId, string $from, string $to, ?int $exceptId = null): bool
    {
        return LeaveTracker::where('employee_id', $employeeId)
            ->whereIn('leave_status', ['Pending', 'Approved'])
            ->when($exceptId, fn ($query) => $query->where('id', '!=', $exceptId))
            ->get()
            ->contains(function ($leave) use ($from, $to) {
                $fromDate = $this->normalizeLeaveDate($leave->leave_from_date, $leave->leave_from_month, $leave->leave_from_year);
                $toDate = $this->normalizeLeaveDate($leave->leave_to_date, $leave->leave_to_month, $leave->leave_to_year);
                if (!$fromDate || !$toDate) return false;
                return $fromDate <= $to && $toDate >= $from;
            });
    }
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
    private function visibleLeaves(Request $request)
    {
        $actor = $request->user()?->employee;
        if (!$actor) abort(403, 'Employee profile not found');
        $query = LeaveTracker::query();
        if ($actor->emp_type === 'Manager') {
            $ids = Employee::where('manager_id', $actor->id)->pluck('id')->push($actor->id);
            $query->whereIn('employee_id', $ids);
        } elseif ($actor->emp_type !== 'Admin') {
            $query->where('employee_id', $actor->id);
        }
        return $query;
    }

    public function index(Request $request): JsonResponse
    {
        $leaves = $this->visibleLeaves($request)->with(['employee', 'department', 'financialYear'])
            ->orderBy('created_at')
            ->get();
        
        return response()->json($leaves);
    }

    public function show(Request $request, $id): JsonResponse
    {
        $leave = $this->visibleLeaves($request)->with(['employee', 'department', 'financialYear'])->find($id);
        
        if (!$leave) {
            return response()->json(['error' => 'Leave record not found'], 404);
        }
        
        return response()->json($leave);
    }

    public function store(Request $request): JsonResponse
    {
        $this->normalizeLegacyAmounts($request);
        $validated = $request->validate([
            'financial_year_id' => 'sometimes|exists:financial_years,id',
            'username' => 'nullable|string|max:200',
            'employee_id' => 'nullable|exists:employees,id',
            'department_id' => 'nullable|exists:departments,id',
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
            'leave_status' => 'nullable|in:Pending',
            'leave_type' => 'nullable|in:Casual Leave,Half Day Leave,Full Day Leave,Earned Leave,Medical Leave,Other Leave,Unpaid Leave',
            'leave_reason' => 'required|string|max:99',
            'leave_from_date' => 'required|date',
            'leave_from_month' => 'nullable|string|max:99',
            'leave_from_year' => 'nullable|string|max:99',
            'leave_to_date' => 'required|date|after_or_equal:leave_from_date',
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
        $actor = $request->user()?->employee;
        if (!$actor) {
            return response()->json(['detail' => 'Employee profile not found.'], 403);
        }
        $validated['employee_id'] = $actor->id;
        $validated['financial_year_id'] = $financialYear->id;
        $validated['username'] = $actor->username;
        $validated['department_id'] = $actor->department_id;
        $validated['leave_status'] = 'Pending';
        $validated['leave_from_date'] = Carbon::parse($validated['leave_from_date'])->toDateString();
        $validated['leave_to_date'] = Carbon::parse($validated['leave_to_date'])->toDateString();
        if (($validated['leave_type'] ?? null) === 'Half Day Leave' && $validated['leave_from_date'] !== $validated['leave_to_date']) {
            return response()->json(['detail' => 'Half day leave must start and end on the same date.'], 422);
        }
        if (isset($validated['leave_type'])) $validated = $this->assignTypedDays($validated, $validated['leave_type'], $validated['leave_from_date'], $validated['leave_to_date']);
        $totalDays = array_sum(array_map(fn ($field) => (float) ($validated[$field] ?? 0), array_unique(array_values(self::TYPE_DAYS))));
        $totalHours = array_sum(array_map(fn ($field) => (float) ($validated[$field] ?? 0), ['cl_hours', 'ei_hours', 'lwp_hours', 'medical_leave_in_hours', 'other_leave_in_hours']));
        if ($totalDays <= 0 && $totalHours <= 0) return response()->json(['detail' => 'Choose a leave type or enter the requested leave amount.'], 422);
        if ($totalDays > Carbon::parse($validated['leave_from_date'])->diffInDays(Carbon::parse($validated['leave_to_date'])) + 1) {
            return response()->json(['detail' => 'Leave days cannot exceed the selected date range.'], 422);
        }
        $leave = DB::transaction(function () use ($validated, $actor, $request) {
            Employee::whereKey($actor->id)->lockForUpdate()->first();
            if ($this->overlaps($actor->id, $validated['leave_from_date'], $validated['leave_to_date'])) return null;
            if ($error = $this->balanceError($actor->id, $validated['financial_year_id'], $validated)) return ['error' => $error];
            $leave = LeaveTracker::create($validated);
            $this->updateLeaveCalculatorAfterCreation($leave);
            $this->auditLeave($leave, null, 'created', $request->user()->id);
            return $leave;
        });
        if (is_array($leave)) return response()->json(['detail' => $leave['error']], 422);
        if (!$leave) return response()->json(['detail' => 'You already have a pending or approved leave for these dates.'], 422);
        
        return response()->json([
            'message' => 'Leave application created successfully',
            'leave' => $leave->load(['employee', 'department', 'financialYear'])
        ], 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $this->normalizeLegacyAmounts($request);
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
            'leave_status' => 'nullable|in:Pending,Approved,Rejected,Cancelled',
            'leave_type' => 'nullable|in:Casual Leave,Half Day Leave,Full Day Leave,Earned Leave,Medical Leave,Other Leave,Unpaid Leave',
            'leave_reason' => 'nullable|string|max:99',
            'leave_from_date' => 'sometimes|date',
            'leave_from_month' => 'nullable|string|max:99',
            'leave_from_year' => 'nullable|string|max:99',
            'leave_to_date' => 'sometimes|date',
            'leave_to_month' => 'nullable|string|max:99',
            'leave_to_year' => 'nullable|string|max:99',
        ]);

        $actor = $request->user()?->employee;
        if (!$actor) return response()->json(['detail' => 'Employee profile not found'], 403);
        $isOwner = $actor->id === (int) $leave->employee_id;
        $isApprover = $actor->emp_type === 'Admin' || ($actor->emp_type === 'Manager' && $leave->employee?->manager_id === $actor->id);
        $changingStatus = isset($validated['leave_status']) && $validated['leave_status'] !== $leave->leave_status;
        if ($changingStatus && !$isApprover) return response()->json(['detail' => 'Only an authorized approver may change leave status.'], 403);
        if (!$isOwner && !$isApprover) return response()->json(['detail' => 'You cannot edit this leave.'], 403);
        if ($leave->leave_status !== 'Pending') return response()->json(['detail' => 'Only pending leave can be updated.'], 409);
        if ($changingStatus) $validated = ['leave_status' => $validated['leave_status']];
        if (!$isOwner && !$changingStatus) return response()->json(['detail' => 'Only the requester may edit leave details.'], 403);
        unset($validated['employee_id'], $validated['username'], $validated['department_id'], $validated['financial_year_id']);
        $from = Carbon::parse($validated['leave_from_date'] ?? $leave->leave_from_date)->toDateString();
        $to = Carbon::parse($validated['leave_to_date'] ?? $leave->leave_to_date)->toDateString();
        if ($from > $to) return response()->json(['errors' => ['leave_to_date' => ['End date must be on or after start date.']]], 422);
        if (($validated['leave_type'] ?? $leave->leave_type) === 'Half Day Leave' && $from !== $to) {
            return response()->json(['detail' => 'Half day leave must start and end on the same date.'], 422);
        }
        $validated['leave_from_date'] = $from;
        $validated['leave_to_date'] = $to;
        $type = $validated['leave_type'] ?? $leave->leave_type;
        if (!$changingStatus && !$type && ($from !== $leave->leave_from_date || $to !== $leave->leave_to_date)) {
            return response()->json(['detail' => 'Choose a leave type before changing the dates of this older request.'], 422);
        }
        if (!$changingStatus && $type) $validated = $this->assignTypedDays($validated, $type, $from, $to);
        $result = DB::transaction(function () use ($leave, $validated, $changingStatus, $request) {
            Employee::whereKey($leave->employee_id)->lockForUpdate()->first();
            if ((!$changingStatus || $validated['leave_status'] === 'Approved')
                && $this->overlaps($leave->employee_id, $validated['leave_from_date'], $validated['leave_to_date'], $leave->id)) return false;
            $values = array_merge($leave->only(array_values(self::TYPE_DAYS)), $validated);
            if ((!$changingStatus || $validated['leave_status'] === 'Approved')
                && ($error = $this->balanceError($leave->employee_id, $leave->financial_year_id, $values, $leave->id, !$changingStatus))) return $error;
            $oldStatus = $leave->leave_status;
            $before = $leave->toArray();
            $leave->update($validated);
            if ($changingStatus) $this->updateLeaveCalculatorAfterStatusChange($leave, $oldStatus, $leave->leave_status);
            $this->auditLeave($leave, $before, $changingStatus ? 'status_changed' : 'updated', $request->user()->id);
            return true;
        });
        if (is_string($result)) return response()->json(['detail' => $result], 422);
        if (!$result) return response()->json(['detail' => 'You already have a pending or approved leave for these dates.'], 422);
        
        return response()->json([
            'message' => 'Leave record updated successfully',
            'leave' => $leave->load(['employee', 'department', 'financialYear'])
        ]);
    }

    public function destroy(Request $request, $id): JsonResponse
    {
        $leave = $this->visibleLeaves($request)->find($id);
        
        if (!$leave) {
            return response()->json(['error' => 'Leave record not found'], 404);
        }
        
        if ($request->user()->employee?->id !== $leave->employee_id) return response()->json(['detail' => 'Only the requester may cancel this leave.'], 403);
        if ($leave->leave_status !== 'Pending') return response()->json(['detail' => 'Only pending leave can be cancelled.'], 409);
        DB::transaction(function () use ($leave, $request) {
            $before = $leave->toArray();
            $leave->update(['leave_status' => 'Cancelled']);
            $this->auditLeave($leave, $before, 'cancelled', $request->user()->id);
        });
        
        return response()->json(['message' => 'Leave record deleted successfully']);
    }

    public function getEmployeeLeave(Request $request, $username): JsonResponse
    {
        $leaves = $this->visibleLeaves($request)->with(['employee', 'department', 'financialYear'])
            ->where('username', $username)
            ->orderBy('created_at', 'desc')
            ->get();
        
        return response()->json($leaves);
    }

    public function getEmployeeLeaves(Request $request, $employeeId): JsonResponse
    {
        $leaves = $this->visibleLeaves($request)->with(['department', 'financialYear'])
            ->where('employee_id', $employeeId)
            ->orderBy('created_at')
            ->get();
        
        return response()->json($leaves);
    }

    public function getLeaveByDepartment(Request $request, $dept_id): JsonResponse
    {
        $leaves = $this->visibleLeaves($request)->with(['employee', 'financialYear'])
            ->where('department_id', $dept_id)
            ->orderBy('created_at', 'desc')
            ->get();
        
        return response()->json($leaves);
    }

    public function getLeaveByManager(Request $request, $manager_id): JsonResponse
    {
        $leaves = $this->visibleLeaves($request)->with(['employee', 'department', 'financialYear'])
            ->whereHas('employee', function($query) use ($manager_id) {
                $query->where('manager_id', $manager_id);
            })
            ->orderBy('created_at', 'desc')
            ->get();
        
        return response()->json($leaves);
    }

    public function getLeavesByDepartment(Request $request, $departmentId): JsonResponse
    {
        $leaves = $this->visibleLeaves($request)->with(['employee', 'financialYear'])
            ->where('department_id', $departmentId)
            ->orderBy('created_at')
            ->get();
        
        return response()->json($leaves);
    }

    public function getLeaveCalculator(Request $request, $employeeId): JsonResponse
    {
        $actor = $request->user()->employee;
        $canView = $actor && ($actor->id === (int) $employeeId || $actor->emp_type === 'Admin'
            || ($actor->emp_type === 'Manager' && Employee::whereKey($employeeId)->where('manager_id', $actor->id)->exists()));
        if (!$canView) {
            return response()->json(['detail' => 'Not allowed to view this balance.'], 403);
        }
        $leaveCalculator = LeaveCalculator::with(['employee', 'financialYear'])
            ->where('employee_id', $employeeId)
            ->first();
        
        if (!$leaveCalculator) {
            return response()->json(['error' => 'Leave calculator not found'], 404);
        }
        
        return response()->json($leaveCalculator);
    }

    public function getLeaveCalculatorByUsername(Request $request, $username): JsonResponse
    {
        $employee = Employee::where('username', $username)->first();
        $actor = $request->user()->employee;
        $canView = $employee && $actor && ($actor->id === $employee->id || $actor->emp_type === 'Admin'
            || ($actor->emp_type === 'Manager' && $employee->manager_id === $actor->id));
        if (!$canView) {
            return response()->json(['detail' => 'Not allowed to view this balance.'], 403);
        }
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
        $this->requireAdmin($request);
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
        $this->requireAdmin($request);
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

    public function getManageLeave(Request $request): JsonResponse
    {
        $this->requireAdmin($request);
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
    public function indexLeaveConfig(Request $request): JsonResponse
    {
        $this->requireAdmin($request);
        $leaves = Leave::with(['financialYear'])
            ->orderBy('financial_year_id')
            ->get();
        
        return response()->json($leaves);
    }

    public function showLeaveConfig(Request $request, $id): JsonResponse
    {
        $this->requireAdmin($request);
        $leave = Leave::with(['financialYear'])->find($id);
        
        if (!$leave) {
            return response()->json(['error' => 'Leave configuration not found'], 404);
        }
        
        return response()->json($leave);
    }

    public function storeLeaveConfig(Request $request): JsonResponse
    {
        $this->requireAdmin($request);
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
        $this->requireAdmin($request);
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

    public function destroyLeaveConfig(Request $request, $id): JsonResponse
    {
        $this->requireAdmin($request);
        $leave = Leave::find($id);
        
        if (!$leave) {
            return response()->json(['error' => 'Leave configuration not found'], 404);
        }
        
        $leave->delete();
        
        return response()->json(['message' => 'Leave configuration deleted successfully']);
    }

    public function initializeAllEmployeeLeaveCalculators(Request $request): JsonResponse
    {
        $this->requireAdmin($request);
        $financialYear = $this->getCurrentFinancialYear();
        if (!$financialYear) {
            return response()->json(['error' => 'No active financial year found'], 400);
        }

        $leaveConfig = Leave::where('financial_year_id', $financialYear->id)->first();
        if (!$leaveConfig) {
            return response()->json(['error' => 'No leave configuration found for current financial year'], 400);
        }

        $employees = \App\Models\Employee::all();
        $created = 0;
        $skipped = 0;

        foreach ($employees as $employee) {
            $existingCalculator = LeaveCalculator::where('employee_id', $employee->id)
                ->where('financial_year_id', $financialYear->id)
                ->first();

            if (!$existingCalculator) {
                LeaveCalculator::create([
                    'financial_year_id' => $financialYear->id,
                    'username' => $employee->username,
                    'employee_id' => $employee->id,
                    'remaining_cl_days' => $leaveConfig->cl_days ?? 0,
                    'remaining_cl_hours' => $leaveConfig->cl_hours ?? 0,
                    'remaining_ei_days' => $leaveConfig->ei_days ?? 0,
                    'remaining_ei_hours' => $leaveConfig->ei_hours ?? 0,
                    'remaining_lwp_days' => $leaveConfig->lwp_days ?? 0,
                    'remaining_lwp_hours' => $leaveConfig->lwp_hours ?? 0,
                    'remaining_medical_leave_in_days' => $leaveConfig->medical_leave_in_days ?? 0,
                    'remaining_medical_leave_in_hours' => $leaveConfig->medical_leave_in_hours ?? 0,
                    'remaining_other_leave_in_days' => $leaveConfig->other_leave_in_days ?? 0,
                    'remaining_other_leave_in_hours' => $leaveConfig->other_leave_in_hours ?? 0,
                ]);
                $created++;
            } else {
                $skipped++;
            }
        }

        return response()->json([
            'message' => 'Leave calculator initialization completed',
            'created' => $created,
            'skipped' => $skipped,
            'total_employees' => $employees->count()
        ]);
    }

    private function updateLeaveCalculatorAfterCreation(LeaveTracker $leave)
    {
        // Find the leave calculator for this employee and financial year
        $leaveCalculator = LeaveCalculator::where('employee_id', $leave->employee_id)
            ->where('financial_year_id', $leave->financial_year_id)
            ->first()
            ?? LeaveCalculator::where('employee_id', $leave->employee_id)->first();
        
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
