<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AttendanceRecord;
use App\Models\Employee;
use App\Models\FinancialYear;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;

class AttendanceController extends Controller
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

    public function index(): JsonResponse
    {
        $attendances = AttendanceRecord::orderByDesc('created_at')->get();
        return response()->json($attendances);
    }

    public function show($attendance_id): JsonResponse
    {
        $attendances = AttendanceRecord::where('id', $attendance_id)->get();
        
        if ($attendances->isEmpty()) {
            return response()->json(['detail' => 'Attendance record not found'], 404);
        }
        
        return response()->json($attendances);
    }

    public function getEmployeeAttendance($username): JsonResponse
    {
        $attendances = AttendanceRecord::where('username', $username)
            ->orderByDesc('created_at')
            ->get();
        
        return response()->json($attendances);
    }

    public function checkEmployeeAttendance($date, $username): JsonResponse
    {
        $attendances = AttendanceRecord::where('login_date', $date)
            ->where('username', $username)
            ->get();
        
        return response()->json($attendances);
    }

    public function getAttendanceByDepartment($dept_id): JsonResponse
    {
        $attendances = AttendanceRecord::where('department_id', $dept_id)->get();
        return response()->json($attendances);
    }

    public function getAttendanceByManager($manager_id): JsonResponse
    {
        $attendances = AttendanceRecord::join('employees', 'attendance_records.employee_id', '=', 'employees.id')
            ->where('employees.manager_id', $manager_id)
            ->select('attendance_records.*')
            ->get();
        
        return response()->json($attendances);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'financial_year_id' => 'sometimes|exists:financial_years,id',
            'employee_id' => 'required|exists:employees,id',
            'department_id' => 'required|exists:departments,id',
            'attendance_date' => 'required|string|max:99',
            'username' => 'required|string|max:200',
            'attendance' => 'nullable|string|max:99',
            'login_at' => 'nullable|string|max:99',
            'logout_at' => 'nullable|string|max:99',
            'log_time' => 'nullable|numeric|min:0',
            'longitude' => 'nullable|string|max:99',
            'latitude' => 'nullable|string|max:99',
            'device' => 'nullable|string|max:99',
            'ip_address' => 'nullable|string|max:99',
            'login_date' => 'nullable|string|max:99',
            'login_month' => 'nullable|string|max:99',
            'login_year' => 'nullable|string|max:99',
        ]);

        // Always set financial year automatically based on current date
        $financialYear = $this->getCurrentFinancialYear();
        if (!$financialYear) {
            // Get all available financial years for debugging
            $allFinancialYears = FinancialYear::pluck('year')->toArray();
            return response()->json([
                'detail' => 'No active financial year found for the current date',
                'available_financial_years' => $allFinancialYears,
                'current_date' => Carbon::now()->format('Y-m-d'),
                'suggestion' => 'Please create a financial year record or ensure one exists for the current period'
            ], 400);
        }
        $validated['financial_year_id'] = $financialYear->id;

        // Check for duplicate attendance record
        $existingAttendance = AttendanceRecord::where('employee_id', $validated['employee_id'])
            ->where('attendance_date', $validated['attendance_date'])
            ->first();

        if ($existingAttendance) {
            return response()->json(['detail' => 'Attendance record already exists for this employee on this date'], 400);
        }

        $attendance = AttendanceRecord::create($validated);
        
        return response()->json($attendance);
    }

    public function update(Request $request, $attendance_id): JsonResponse
    {
        $attendance = AttendanceRecord::find($attendance_id);
        
        if (!$attendance) {
            return response()->json(['detail' => 'Attendance record not found'], 404);
        }

        $validated = $request->validate([
            'financial_year_id' => 'sometimes|exists:financial_years,id',
            'employee_id' => 'sometimes|exists:employees,id',
            'department_id' => 'sometimes|exists:departments,id',
            'attendance_date' => 'sometimes|string|max:99',
            'username' => 'sometimes|string|max:200',
            'attendance' => 'nullable|string|max:99',
            'login_at' => 'nullable|string|max:99',
            'logout_at' => 'nullable|string|max:99',
            'log_time' => 'nullable|numeric|min:0',
            'longitude' => 'nullable|string|max:99',
            'latitude' => 'nullable|string|max:99',
            'device' => 'nullable|string|max:99',
            'ip_address' => 'nullable|string|max:99',
            'login_date' => 'nullable|string|max:99',
            'login_month' => 'nullable|string|max:99',
            'login_year' => 'nullable|string|max:99',
        ]);

        $attendance->update($validated);
        
        return response()->json($attendance);
    }

    public function destroy($attendance_id): JsonResponse
    {
        $attendance = AttendanceRecord::find($attendance_id);
        
        if (!$attendance) {
            return response()->json(['detail' => 'Attendance record not found'], 404);
        }
        
        $attendance->delete();
        
        return response()->json(['message' => 'Attendance record deleted successfully']);
    }

    public function getAttendanceByDateRange($date_from, $date_to): JsonResponse
    {
        try {
            $attendances = AttendanceRecord::whereBetween('login_date', [$date_from, $date_to])
                ->orderByDesc('created_at')
                ->get();
            
            return response()->json($attendances);
        } catch (\Exception $e) {
            return response()->json(['detail' => 'Invalid date format'], 400);
        }
    }

    public function exportAttendanceCsv($date_from, $date_to)
    {
        try {
            $attendances = AttendanceRecord::with(['employee', 'department'])
                ->whereBetween('login_date', [$date_from, $date_to])
                ->orderByDesc('created_at')
                ->get();

            $output = fopen('php://output', 'w');
            
            // Set headers for CSV download
            $headers = [
                'Content-Type' => 'text/csv; charset=utf-8',
                'Content-Disposition' => 'attachment; filename="attendance_export_' . $date_from . '_to_' . $date_to . '.csv"',
                'Pragma' => 'no-cache',
                'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
                'Expires' => '0'
            ];

            // Write CSV headers
            fputcsv($output, [
                'Employee ID',
                'Username', 
                'Employee Name',
                'Department',
                'Date',
                'Login Time',
                'Logout Time',
                'Total Hours',
                'Status',
                'Device',
                'IP Address'
            ]);

            // Write data rows
            foreach ($attendances as $attendance) {
                fputcsv($output, [
                    $attendance->employee_id,
                    $attendance->username,
                    $attendance->employee->emp_name ?? '',
                    $attendance->department->department_name ?? '',
                    $attendance->login_date,
                    $attendance->login_at,
                    $attendance->logout_at,
                    $attendance->log_time,
                    $attendance->attendance,
                    $attendance->device,
                    $attendance->ip_address
                ]);
            }

            fclose($output);
            
            return response()->stream(function() {}, 200, $headers);

        } catch (\Exception $e) {
            return response()->json(['detail' => 'Error generating CSV: ' . $e->getMessage()], 500);
        }
    }

    public function getBulkAttendanceReport(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'date_from' => 'required|date',
            'date_to' => 'required|date|after_or_equal:date_from',
            'department_id' => 'sometimes|exists:departments,id',
            'employee_id' => 'sometimes|exists:employees,id',
        ]);

        $query = AttendanceRecord::with(['employee', 'department']);

        // Apply date filter
        $query->whereBetween('login_date', [$validated['date_from'], $validated['date_to']]);

        // Apply optional filters
        if (isset($validated['department_id'])) {
            $query->where('department_id', $validated['department_id']);
        }

        if (isset($validated['employee_id'])) {
            $query->where('employee_id', $validated['employee_id']);
        }

        $attendances = $query->orderByDesc('created_at')->get();

        // Calculate summary statistics
        $totalRecords = $attendances->count();
        $presentCount = $attendances->where('attendance', 'Present')->count();
        $absentCount = $attendances->where('attendance', 'Absent')->count();
        $halfDayCount = $attendances->where('attendance', 'Half Day')->count();

        return response()->json([
            'attendances' => $attendances,
            'summary' => [
                'total_records' => $totalRecords,
                'present_count' => $presentCount,
                'absent_count' => $absentCount,
                'half_day_count' => $halfDayCount,
                'date_from' => $validated['date_from'],
                'date_to' => $validated['date_to']
            ]
        ]);
    }
}