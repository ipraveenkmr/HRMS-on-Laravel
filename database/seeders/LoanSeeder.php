<?php

namespace Database\Seeders;

use App\Models\Loan;
use App\Models\LoanCalculator;
use App\Models\Employee;
use App\Models\FinancialYear;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class LoanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $employees = Employee::where('emp_status', 'Working')->get();
        $financialYear = FinancialYear::orderBy('year', 'desc')->first();
        
        if ($employees->isEmpty()) {
            $this->command->error('No employees found. Please run DatabaseSeeder first.');
            return;
        }

        if (!$financialYear) {
            $this->command->error('No financial year found. Please run FinancialYearSeeder first.');
            return;
        }

        $this->command->info('Creating loans and loan calculations...');

        $loanPurposes = [
            'Home Purchase',
            'Vehicle Purchase',
            'Education',
            'Medical Emergency',
            'Wedding',
            'Home Renovation',
            'Personal Emergency',
            'Debt Consolidation',
            'Business Investment',
            'Travel',
            'Electronic Purchase',
            'Furniture Purchase'
        ];

        $loanCounter = 0;
        $calculatorCounter = 0;

        // 40% of employees have loans
        $employeesWithLoans = $employees->random(intval($employees->count() * 0.4));

        foreach ($employeesWithLoans as $employee) {
            // Each employee can have 1-2 loans
            $loanCount = rand(1, 2);

            for ($i = 0; $i < $loanCount; $i++) {
                // Loan amount based on salary (1-12 months of gross salary)
                $maxLoanAmount = $employee->gross_salary * rand(1, 12) / 12;
                $loanAmount = rand(50000, intval($maxLoanAmount));
                
                // Loan period: 6 to 60 months
                $loanPeriod = rand(6, 60);
                
                // Interest rate: Use financial year rate with some variation
                $baseRate = $financialYear->loan_interest_rate ?? 7.5;
                $interestRate = $baseRate + (rand(-100, 200) / 100); // ±1% to +2% variation
                $interestRate = max(5.0, min(15.0, $interestRate)); // Keep between 5% and 15%

                $applyDate = fake()->dateTimeBetween('-12 months', 'now');
                $status = $this->getRandomLoanStatus();

                $loan = Loan::create([
                    'financial_year_id' => $financialYear->id,
                    'username' => $employee->username,
                    'employee_id' => $employee->id,
                    'department_id' => $employee->department_id,
                    'loan_amount' => $loanAmount,
                    'loan_period_in_month' => $loanPeriod,
                    'interest_rate' => round($interestRate, 2),
                    'status' => $status,
                    'apply_date' => $applyDate->format('Y-m-d'),
                    'purpose' => $loanPurposes[array_rand($loanPurposes)],
                    'created_at' => $applyDate,
                    'updated_at' => $applyDate
                ]);

                $loanCounter++;

                // Create loan calculator only for approved/active loans
                if (in_array($status, ['Active', 'Approved'])) {
                    $this->createLoanCalculator($loan, $employee, $financialYear, $applyDate);
                    $calculatorCounter++;
                }
            }
        }

        $this->command->info("Created {$loanCounter} loans and {$calculatorCounter} loan calculators successfully!");
    }

    private function createLoanCalculator($loan, $employee, $financialYear, $applyDate)
    {
        // Calculate EMI using standard formula
        $principal = $loan->loan_amount;
        $rate = $loan->interest_rate / 100 / 12; // Monthly rate
        $tenure = $loan->loan_period_in_month;

        if ($rate > 0) {
            $emi = $principal * $rate * pow(1 + $rate, $tenure) / (pow(1 + $rate, $tenure) - 1);
        } else {
            $emi = $principal / $tenure; // If no interest
        }

        $totalAmount = $emi * $tenure;

        // Calculate how much has been paid (based on months since loan approval)
        $monthsPassed = Carbon::parse($applyDate)->diffInMonths(Carbon::now());
        $monthsPassed = min($monthsPassed, $tenure); // Don't exceed loan tenure

        $remainingTenure = max(0, $tenure - $monthsPassed);
        $paidAmount = $monthsPassed * $emi;
        $remainingAmount = max(0, $totalAmount - $paidAmount);

        LoanCalculator::create([
            'loan_id' => $loan->id,
            'financial_year_id' => $financialYear->id,
            'username' => $employee->username,
            'employee_id' => $employee->id,
            'department_id' => $employee->department_id,
            'total_amount' => round($totalAmount, 2),
            'status' => $loan->status,
            'emi' => round($emi, 2),
            'remaining_loan_amount' => round($remainingAmount, 2),
            'remaining_loan_period_in_month' => $remainingTenure,
            'created_at' => $applyDate,
            'updated_at' => Carbon::now()
        ]);
    }

    private function getRandomLoanStatus()
    {
        $statuses = ['Active', 'Approved', 'Pending', 'Rejected', 'Completed'];
        $weights = [40, 20, 15, 15, 10]; // 40% active, 20% approved, 15% pending, 15% rejected, 10% completed
        
        $rand = rand(1, 100);
        if ($rand <= 40) return 'Active';
        if ($rand <= 60) return 'Approved';
        if ($rand <= 75) return 'Pending';
        if ($rand <= 90) return 'Rejected';
        return 'Completed';
    }
}