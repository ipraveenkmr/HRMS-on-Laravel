<?php

namespace Database\Seeders;

use App\Models\LeaveCalculator;
use App\Models\Employee;
use App\Models\FinancialYear;
use App\Models\Leave;
use Illuminate\Database\Seeder;

class LeaveCalculatorSeeder extends Seeder
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

        $leave = Leave::where('financial_year_id', $financialYear->id)->first();
        
        if (!$leave) {
            $this->command->error('No leave policy found. Please run LeaveSeeder first.');
            return;
        }

        $this->command->info('Creating leave calculators...');

        $calculatorCounter = 0;

        foreach ($employees as $employee) {
            // Calculate remaining leaves based on random usage
            // Assume employees have used 20-80% of their allocated leaves so far
            $usagePercentage = rand(20, 80) / 100;

            // Calculate used leaves
            $clUsed = $leave->cl_days * $usagePercentage;
            $eiUsed = $leave->ei_days * $usagePercentage;
            $lwpUsed = $leave->lwp_days * $usagePercentage;
            $medicalUsed = $leave->medical_leave_in_days * $usagePercentage;
            $otherUsed = $leave->other_leave_in_days * $usagePercentage;

            // For hours, use a different random percentage
            $hoursUsagePercentage = rand(10, 70) / 100;
            $clHoursUsed = $leave->cl_hours * $hoursUsagePercentage;
            $eiHoursUsed = $leave->ei_hours * $hoursUsagePercentage;
            $lwpHoursUsed = $leave->lwp_hours * $hoursUsagePercentage;
            $medicalHoursUsed = $leave->medical_leave_in_hours * $hoursUsagePercentage;
            $otherHoursUsed = $leave->other_leave_in_hours * $hoursUsagePercentage;

            // Calculate remaining leaves
            $remainingClDays = max(0, $leave->cl_days - $clUsed);
            $remainingClHours = max(0, $leave->cl_hours - $clHoursUsed);
            $remainingEiDays = max(0, $leave->ei_days - $eiUsed);
            $remainingEiHours = max(0, $leave->ei_hours - $eiHoursUsed);
            $remainingLwpDays = max(0, $leave->lwp_days - $lwpUsed);
            $remainingLwpHours = max(0, $leave->lwp_hours - $lwpHoursUsed);
            $remainingMedicalDays = max(0, $leave->medical_leave_in_days - $medicalUsed);
            $remainingMedicalHours = max(0, $leave->medical_leave_in_hours - $medicalHoursUsed);
            $remainingOtherDays = max(0, $leave->other_leave_in_days - $otherUsed);
            $remainingOtherHours = max(0, $leave->other_leave_in_hours - $otherHoursUsed);

            // Add some variation for new joiners (they get pro-rated leaves)
            $joiningDate = \Carbon\Carbon::parse($employee->joining_date);
            $currentDate = \Carbon\Carbon::now();
            $monthsWorked = $joiningDate->diffInMonths($currentDate);
            
            if ($monthsWorked < 12) {
                // Pro-rate leaves for employees who joined this year
                $proRateMultiplier = min(1.0, $monthsWorked / 12);
                $remainingClDays *= $proRateMultiplier;
                $remainingEiDays *= $proRateMultiplier;
                $remainingMedicalDays *= $proRateMultiplier;
                $remainingOtherDays *= $proRateMultiplier;
            }

            LeaveCalculator::create([
                'financial_year_id' => $financialYear->id,
                'username' => $employee->username,
                'employee_id' => $employee->id,
                'remaining_cl_days' => round($remainingClDays, 1),
                'remaining_cl_hours' => round($remainingClHours, 1),
                'remaining_ei_days' => round($remainingEiDays, 1),
                'remaining_ei_hours' => round($remainingEiHours, 1),
                'remaining_lwp_days' => round($remainingLwpDays, 1),
                'remaining_lwp_hours' => round($remainingLwpHours, 1),
                'remaining_medical_leave_in_days' => round($remainingMedicalDays, 1),
                'remaining_medical_leave_in_hours' => round($remainingMedicalHours, 1),
                'remaining_other_leave_in_days' => round($remainingOtherDays, 1),
                'remaining_other_leave_in_hours' => round($remainingOtherHours, 1)
            ]);

            $calculatorCounter++;
        }

        $this->command->info("Created {$calculatorCounter} leave calculators successfully!");
    }
}