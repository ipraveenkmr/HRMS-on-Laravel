<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Payslip;
use App\Models\Employee;
use App\Models\FinancialYear;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;

class PayslipController extends Controller
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

    private function generateMonthYear($date = null)
    {
        $payDate = $date ? Carbon::parse($date) : Carbon::now();
        return $payDate->format('M-Y'); // e.g., "Sep-2025"
    }
    public function index(): JsonResponse
    {
        $payslips = Payslip::with(['employee', 'department'])
            ->orderBy('created_at')
            ->get();
        
        return response()->json($payslips);
    }

    public function show($id): JsonResponse
    {
        $payslip = Payslip::with(['employee', 'department'])->find($id);
        
        if (!$payslip) {
            return response()->json(['error' => 'Payslip not found'], 404);
        }
        
        return response()->json($payslip);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'month_year' => 'nullable|string|max:99',
            'username' => 'nullable|string|max:200',
            'employee_id' => 'required|exists:employees,id',
            'department_id' => 'required|exists:departments,id',
            'date' => 'nullable|string|max:99',
            'basic' => 'nullable|integer|min:0',
            'hra' => 'nullable|integer|min:0',
            'ta' => 'nullable|integer|min:0',
            'com' => 'nullable|integer|min:0',
            'medical' => 'nullable|integer|min:0',
            'edu' => 'nullable|integer|min:0',
            'sa' => 'nullable|integer|min:0',
            'pf' => 'nullable|integer|min:0',
            'esi' => 'nullable|integer|min:0',
            'income_tax' => 'nullable|integer|min:0',
            'cl_taken' => 'nullable|integer|min:0',
            'ei_taken' => 'nullable|integer|min:0',
            'lwp_taken' => 'nullable|integer|min:0',
            'advance_pay' => 'nullable|integer|min:0',
            'leave_travel_allowance' => 'nullable|integer|min:0',
            'telephone_expense' => 'nullable|integer|min:0',
            'fuel_and_maint_two_wheeler' => 'nullable|integer|min:0',
            'fuel_and_maint_four_wheeler' => 'nullable|integer|min:0',
            'other_expense' => 'nullable|integer|min:0',
            'paid_days' => 'nullable|integer|min:0',
            'total_days' => 'nullable|integer|min:0',
            'total_earning' => 'nullable|integer|min:0',
            'total_deduction' => 'nullable|integer|min:0',
            'total_reimbursement' => 'nullable|integer|min:0',
            'net_current_salary' => 'nullable|integer',
            'salary_status' => 'nullable|string|max:99',
            'esi_number' => 'nullable|string|max:200',
            'uan_number' => 'nullable|string|max:200',
        ]);

        // Auto-generate month_year if not provided
        if (empty($validated['month_year'])) {
            $validated['month_year'] = $this->generateMonthYear($validated['date'] ?? null);
        }

        // Check for duplicate payslip for this employee and month
        $existingPayslip = Payslip::where('employee_id', $validated['employee_id'])
            ->where('month_year', $validated['month_year'])
            ->first();

        if ($existingPayslip) {
            return response()->json([
                'message' => 'Payslip already exists for this employee for ' . $validated['month_year'],
                'errors' => [
                    'month_year' => ['A payslip for this employee already exists for ' . $validated['month_year']]
                ]
            ], 422);
        }

        $payslip = Payslip::create($validated);
        
        return response()->json([
            'message' => 'Payslip created successfully',
            'payslip' => $payslip->load(['employee', 'department'])
        ], 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $payslip = Payslip::find($id);
        
        if (!$payslip) {
            return response()->json(['error' => 'Payslip not found'], 404);
        }

        $validated = $request->validate([
            'month_year' => 'sometimes|string|max:99',
            'username' => 'nullable|string|max:200',
            'employee_id' => 'sometimes|exists:employees,id',
            'department_id' => 'sometimes|exists:departments,id',
            'date' => 'nullable|string|max:99',
            'basic' => 'nullable|integer|min:0',
            'hra' => 'nullable|integer|min:0',
            'ta' => 'nullable|integer|min:0',
            'com' => 'nullable|integer|min:0',
            'medical' => 'nullable|integer|min:0',
            'edu' => 'nullable|integer|min:0',
            'sa' => 'nullable|integer|min:0',
            'pf' => 'nullable|integer|min:0',
            'esi' => 'nullable|integer|min:0',
            'income_tax' => 'nullable|integer|min:0',
            'cl_taken' => 'nullable|integer|min:0',
            'ei_taken' => 'nullable|integer|min:0',
            'lwp_taken' => 'nullable|integer|min:0',
            'advance_pay' => 'nullable|integer|min:0',
            'leave_travel_allowance' => 'nullable|integer|min:0',
            'telephone_expense' => 'nullable|integer|min:0',
            'fuel_and_maint_two_wheeler' => 'nullable|integer|min:0',
            'fuel_and_maint_four_wheeler' => 'nullable|integer|min:0',
            'other_expense' => 'nullable|integer|min:0',
            'paid_days' => 'nullable|integer|min:0',
            'total_days' => 'nullable|integer|min:0',
            'total_earning' => 'nullable|integer|min:0',
            'total_deduction' => 'nullable|integer|min:0',
            'total_reimbursement' => 'nullable|integer|min:0',
            'net_current_salary' => 'nullable|integer',
            'salary_status' => 'nullable|string|max:99',
            'esi_number' => 'nullable|string|max:200',
            'uan_number' => 'nullable|string|max:200',
        ]);

        // Check for duplicate payslip if employee_id or month_year is being updated
        if (isset($validated['employee_id']) || isset($validated['month_year'])) {
            $employeeId = $validated['employee_id'] ?? $payslip->employee_id;
            $monthYear = $validated['month_year'] ?? $payslip->month_year;
            
            $existingPayslip = Payslip::where('employee_id', $employeeId)
                ->where('month_year', $monthYear)
                ->where('id', '!=', $payslip->id) // Exclude current payslip
                ->first();

            if ($existingPayslip) {
                return response()->json([
                    'message' => 'Payslip already exists for this employee for ' . $monthYear,
                    'errors' => [
                        'month_year' => ['A payslip for this employee already exists for ' . $monthYear]
                    ]
                ], 422);
            }
        }

        $payslip->update($validated);
        
        return response()->json([
            'message' => 'Payslip updated successfully',
            'payslip' => $payslip->load(['employee', 'department'])
        ]);
    }

    public function destroy($id): JsonResponse
    {
        $payslip = Payslip::find($id);
        
        if (!$payslip) {
            return response()->json(['error' => 'Payslip not found'], 404);
        }
        
        $payslip->delete();
        
        return response()->json(['message' => 'Payslip deleted successfully']);
    }

    public function getEmployeePayslips($username): JsonResponse
    {
        $payslips = Payslip::with(['employee', 'department'])
            ->whereHas('employee', function($query) use ($username) {
                $query->where('username', $username);
            })
            ->orderBy('created_at', 'desc')
            ->get();
        
        return response()->json($payslips);
    }

    public function getPayslipsByDepartment($departmentId): JsonResponse
    {
        $payslips = Payslip::with(['employee'])
            ->where('department_id', $departmentId)
            ->orderBy('created_at')
            ->get();
        
        return response()->json($payslips);
    }
}