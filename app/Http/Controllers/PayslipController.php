<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Payslip;
use Illuminate\Http\JsonResponse;

class PayslipController extends Controller
{
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
            'month_year' => 'required|string|max:99|unique:payslips',
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

    public function getEmployeePayslips($employeeId): JsonResponse
    {
        $payslips = Payslip::with(['department'])
            ->where('employee_id', $employeeId)
            ->orderBy('created_at')
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