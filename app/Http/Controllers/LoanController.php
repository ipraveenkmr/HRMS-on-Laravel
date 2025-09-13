<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Loan;
use App\Models\LoanCalculator;
use App\Models\FinancialYear;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;

class LoanController extends Controller
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
        $loans = Loan::with(['employee', 'department', 'financialYear'])
            ->orderBy('created_at')
            ->get();
        
        return response()->json($loans);
    }

    public function show($id): JsonResponse
    {
        $loan = Loan::with(['employee', 'department', 'financialYear'])->find($id);
        
        if (!$loan) {
            return response()->json(['error' => 'Loan not found'], 404);
        }
        
        return response()->json($loan);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'financial_year_id' => 'sometimes|exists:financial_years,id',
            'username' => 'nullable|string|max:200',
            'employee_id' => 'required|exists:employees,id',
            'department_id' => 'required|exists:departments,id',
            'loan_amount' => 'required|numeric|min:0',
            'loan_period_in_month' => 'required|numeric|min:1',
            'interest_rate' => 'sometimes|numeric|min:0',
            'status' => 'nullable|string|max:99',
            'apply_date' => 'nullable|string|max:99',
            'purpose' => 'nullable|string',
        ]);

        // Auto-populate financial year and interest rate if not provided
        if (!isset($validated['financial_year_id']) || !isset($validated['interest_rate'])) {
            $financialYear = $this->getCurrentFinancialYear();
            
            if (!$financialYear) {
                // Get all available financial years for debugging
                $allFinancialYears = FinancialYear::pluck('year')->toArray();
                return response()->json([
                    'message' => 'No active financial year found for the current date',
                    'available_financial_years' => $allFinancialYears,
                    'current_date' => Carbon::now()->format('Y-m-d'),
                    'errors' => [
                        'financial_year_id' => ['Please create a financial year record or ensure one exists for the current period']
                    ]
                ], 422);
            }
            
            // Set financial year ID if not provided
            if (!isset($validated['financial_year_id'])) {
                $validated['financial_year_id'] = $financialYear->id;
            }
            
            // Set interest rate from financial year if not provided
            if (!isset($validated['interest_rate'])) {
                $validated['interest_rate'] = $financialYear->loan_interest_rate;
            }
        }

        $loan = Loan::create($validated);
        
        // Create loan calculator
        $this->createLoanCalculator($loan);
        
        return response()->json([
            'message' => 'Loan created successfully',
            'loan' => $loan->load(['employee', 'department', 'financialYear'])
        ], 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $loan = Loan::find($id);
        
        if (!$loan) {
            return response()->json(['error' => 'Loan not found'], 404);
        }

        $validated = $request->validate([
            'financial_year_id' => 'sometimes|exists:financial_years,id',
            'username' => 'nullable|string|max:200',
            'employee_id' => 'sometimes|exists:employees,id',
            'department_id' => 'sometimes|exists:departments,id',
            'loan_amount' => 'sometimes|numeric|min:0',
            'loan_period_in_month' => 'sometimes|numeric|min:1',
            'interest_rate' => 'sometimes|numeric|min:0',
            'status' => 'nullable|string|max:99',
            'apply_date' => 'nullable|string|max:99',
            'purpose' => 'nullable|string',
        ]);

        $loan->update($validated);
        
        // Update loan calculator if amount or period changed
        if (isset($validated['loan_amount']) || isset($validated['loan_period_in_month']) || isset($validated['interest_rate'])) {
            $this->updateLoanCalculator($loan);
        }
        
        return response()->json([
            'message' => 'Loan updated successfully',
            'loan' => $loan->load(['employee', 'department', 'financialYear'])
        ]);
    }

    public function destroy($id): JsonResponse
    {
        $loan = Loan::find($id);
        
        if (!$loan) {
            return response()->json(['error' => 'Loan not found'], 404);
        }
        
        $loan->delete();
        
        return response()->json(['message' => 'Loan deleted successfully']);
    }

    public function getEmployeeLoans($employeeId): JsonResponse
    {
        $loans = Loan::with(['department', 'financialYear'])
            ->where('employee_id', $employeeId)
            ->orderBy('created_at')
            ->get();
        
        return response()->json($loans);
    }

    public function getLoansByDepartment($departmentId): JsonResponse
    {
        $loans = Loan::with(['employee', 'financialYear'])
            ->where('department_id', $departmentId)
            ->orderBy('created_at')
            ->get();
        
        return response()->json($loans);
    }

    public function checkLoan($employeeId): JsonResponse
    {
        $activeLoan = Loan::where('employee_id', $employeeId)
            ->where('status', 'Active')
            ->first();
        
        return response()->json([
            'has_active_loan' => !is_null($activeLoan),
            'loan' => $activeLoan
        ]);
    }

    public function calculateEmi(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'loan_amount' => 'required|numeric|min:0',
            'loan_period_in_month' => 'required|numeric|min:1',
            'interest_rate' => 'required|numeric|min:0',
        ]);

        $principal = $validated['loan_amount'];
        $monthlyRate = $validated['interest_rate'] / (12 * 100);
        $numberOfPayments = $validated['loan_period_in_month'];

        if ($monthlyRate == 0) {
            $emi = $principal / $numberOfPayments;
        } else {
            $emi = $principal * ($monthlyRate * pow(1 + $monthlyRate, $numberOfPayments)) / 
                   (pow(1 + $monthlyRate, $numberOfPayments) - 1);
        }

        $totalAmount = $emi * $numberOfPayments;
        $totalInterest = $totalAmount - $principal;

        return response()->json([
            'emi' => round($emi, 2),
            'total_amount' => round($totalAmount, 2),
            'total_interest' => round($totalInterest, 2),
            'principal' => $principal,
            'interest_rate' => $validated['interest_rate'],
            'period_months' => $numberOfPayments
        ]);
    }

    protected function createLoanCalculator(Loan $loan): void
    {
        $emiData = $this->calculateEmiData($loan);
        
        LoanCalculator::create([
            'loan_id' => $loan->id,
            'financial_year_id' => $loan->financial_year_id,
            'username' => $loan->username,
            'employee_id' => $loan->employee_id,
            'department_id' => $loan->department_id,
            'total_amount' => $emiData['total_amount'],
            'emi' => $emiData['emi'],
            'remaining_loan_amount' => $emiData['total_amount'],
            'remaining_loan_period_in_month' => $loan->loan_period_in_month,
            'status' => 'Active'
        ]);
    }

    protected function updateLoanCalculator(Loan $loan): void
    {
        $calculator = $loan->loanCalculator;
        if ($calculator) {
            $emiData = $this->calculateEmiData($loan);
            
            $calculator->update([
                'total_amount' => $emiData['total_amount'],
                'emi' => $emiData['emi'],
                'remaining_loan_amount' => $emiData['total_amount'],
                'remaining_loan_period_in_month' => $loan->loan_period_in_month,
            ]);
        }
    }

    protected function calculateEmiData(Loan $loan): array
    {
        $principal = $loan->loan_amount;
        $monthlyRate = $loan->interest_rate / (12 * 100);
        $numberOfPayments = $loan->loan_period_in_month;

        if ($monthlyRate == 0) {
            $emi = $principal / $numberOfPayments;
        } else {
            $emi = $principal * ($monthlyRate * pow(1 + $monthlyRate, $numberOfPayments)) / 
                   (pow(1 + $monthlyRate, $numberOfPayments) - 1);
        }

        $totalAmount = $emi * $numberOfPayments;

        return [
            'emi' => round($emi, 2),
            'total_amount' => round($totalAmount, 2)
        ];
    }
}