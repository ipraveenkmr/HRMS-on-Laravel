<?php

namespace Database\Seeders;

use App\Models\Payslip;
use App\Models\Employee;
use App\Models\PayGrade;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class PayslipSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $employees = Employee::where('emp_status', 'Working')->get();
        
        if ($employees->isEmpty()) {
            $this->command->error('No employees found. Please run DatabaseSeeder first.');
            return;
        }

        $this->command->info('Creating payslips...');

        $payslipCounter = 0;

        // Generate payslips for last 6 months
        for ($month = 5; $month >= 0; $month--) {
            $date = Carbon::now()->subMonths($month);
            $monthYear = $date->format('Y-m');
            $monthName = $date->format('F Y');
            
            foreach ($employees as $employee) {
                $payGrade = PayGrade::find($employee->pay_grade_id);
                
                if (!$payGrade) {
                    continue;
                }

                $grossSalary = $employee->gross_salary;
                
                // Calculate salary components based on pay grade percentages
                $basic = ($grossSalary * $payGrade->basic) / 100;
                $hra = ($grossSalary * $payGrade->hra) / 100;
                $ta = ($grossSalary * $payGrade->ta) / 100;
                $com = ($grossSalary * $payGrade->com) / 100;
                $medical = ($grossSalary * $payGrade->medical) / 100;
                $edu = ($grossSalary * $payGrade->edu) / 100;
                $sa = ($grossSalary * $payGrade->sa) / 100;
                
                // Calculate deductions
                $pf = ($basic * 12) / 100; // 12% of basic
                $esi = ($grossSalary * 0.75) / 100; // 0.75% of gross
                $incomeTax = ($grossSalary * $payGrade->income_tax) / 100;
                
                // Random leave taken (0-3 days per month)
                $clTaken = rand(0, 3);
                $eiTaken = rand(0, 2);
                $lwpTaken = rand(0, 1);
                
                // Random reimbursements and allowances
                $lta = rand(0, 1) ? rand(500, 5000) : 0;
                $telephoneExpense = rand(0, 1) ? rand(200, 1500) : 0;
                $fuelTwoWheeler = rand(0, 1) ? rand(500, 3000) : 0;
                $fuelFourWheeler = rand(0, 1) ? rand(1000, 8000) : 0;
                $otherExpense = rand(0, 1) ? rand(200, 2000) : 0;
                $advancePay = rand(0, 1) ? rand(1000, 10000) : 0;
                
                // Calculate working days (assuming 22-26 working days per month)
                $totalDays = rand(22, 26);
                $paidDays = $totalDays - $lwpTaken;
                
                // Adjust salary for unpaid leave
                $salaryAdjustment = $paidDays / $totalDays;
                $adjustedBasic = $basic * $salaryAdjustment;
                $adjustedHra = $hra * $salaryAdjustment;
                $adjustedTa = $ta * $salaryAdjustment;
                $adjustedCom = $com * $salaryAdjustment;
                $adjustedMedical = $medical * $salaryAdjustment;
                $adjustedEdu = $edu * $salaryAdjustment;
                $adjustedSa = $sa * $salaryAdjustment;
                
                // Calculate totals
                $totalEarning = $adjustedBasic + $adjustedHra + $adjustedTa + $adjustedCom + 
                               $adjustedMedical + $adjustedEdu + $adjustedSa;
                
                $totalDeduction = $pf + $esi + $incomeTax + $advancePay;
                
                $totalReimbursement = $lta + $telephoneExpense + $fuelTwoWheeler + 
                                    $fuelFourWheeler + $otherExpense;
                
                $netSalary = $totalEarning - $totalDeduction + $totalReimbursement;
                
                Payslip::create([
                    'month_year' => $monthYear,
                    'username' => $employee->username,
                    'employee_id' => $employee->id,
                    'department_id' => $employee->department_id,
                    'date' => $date->format('Y-m-d'),
                    'basic' => round($adjustedBasic, 2),
                    'hra' => round($adjustedHra, 2),
                    'ta' => round($adjustedTa, 2),
                    'com' => round($adjustedCom, 2),
                    'medical' => round($adjustedMedical, 2),
                    'edu' => round($adjustedEdu, 2),
                    'sa' => round($adjustedSa, 2),
                    'pf' => round($pf, 2),
                    'esi' => round($esi, 2),
                    'income_tax' => round($incomeTax, 2),
                    'cl_taken' => $clTaken,
                    'ei_taken' => $eiTaken,
                    'lwp_taken' => $lwpTaken,
                    'advance_pay' => $advancePay,
                    'leave_travel_allowance' => $lta,
                    'telephone_expense' => $telephoneExpense,
                    'fuel_and_maint_two_wheeler' => $fuelTwoWheeler,
                    'fuel_and_maint_four_wheeler' => $fuelFourWheeler,
                    'other_expense' => $otherExpense,
                    'paid_days' => $paidDays,
                    'total_days' => $totalDays,
                    'total_earning' => round($totalEarning, 2),
                    'total_deduction' => round($totalDeduction, 2),
                    'total_reimbursement' => round($totalReimbursement, 2),
                    'net_current_salary' => round($netSalary, 2),
                    'salary_status' => $this->getRandomSalaryStatus(),
                    'esi_number' => $this->generateESINumber(),
                    'uan_number' => $this->generateUANNumber(),
                    'created_at' => $date,
                    'updated_at' => $date
                ]);
                
                $payslipCounter++;
            }
        }

        $this->command->info("Created {$payslipCounter} payslips successfully!");
    }

    private function getRandomSalaryStatus()
    {
        $statuses = ['Paid', 'Pending', 'Processing'];
        $weights = [85, 10, 5]; // 85% paid, 10% pending, 5% processing
        
        $rand = rand(1, 100);
        if ($rand <= 85) return 'Paid';
        if ($rand <= 95) return 'Pending';
        return 'Processing';
    }

    private function generateESINumber()
    {
        // ESI number format: 10 digits
        return sprintf('%010d', rand(1000000000, 9999999999));
    }

    private function generateUANNumber()
    {
        // UAN number format: 12 digits
        return sprintf('%012d', rand(100000000000, 999999999999));
    }
}