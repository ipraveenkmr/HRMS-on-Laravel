<?php

namespace Database\Seeders;

use App\Models\LeaveTracker;
use App\Models\Employee;
use App\Models\FinancialYear;
use App\Models\Leave;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class LeaveTrackerSeeder extends Seeder
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

        $this->command->info('Creating leave tracker records...');

        $leaveReasons = [
            'Casual Leave' => [
                'Personal work',
                'Family function',
                'Doctor appointment',
                'Personal emergency',
                'Festival celebration',
                'Home maintenance',
                'Banking work',
                'Vehicle servicing'
            ],
            'Medical Leave' => [
                'Fever and cold',
                'Doctor consultation',
                'Medical check-up',
                'Surgery recovery',
                'Dental treatment',
                'Eye treatment',
                'Physiotherapy session',
                'Hospital visit'
            ],
            'Emergency Leave' => [
                'Family emergency',
                'Medical emergency',
                'Accident',
                'Death in family',
                'Natural calamity',
                'Urgent travel',
                'Legal matters',
                'Child emergency'
            ],
            'Other Leave' => [
                'Marriage in family',
                'Relocation',
                'Educational purpose',
                'Pilgrimage',
                'Long distance travel',
                'Special occasion',
                'Community service',
                'Personal project'
            ]
        ];

        $leaveStatuses = ['Approved', 'Pending', 'Rejected'];
        $leaveTrackerCounter = 0;

        // Create leave records for last 6 months
        foreach ($employees as $employee) {
            // Each employee takes 2-8 leave applications over 6 months
            $leaveApplications = rand(2, 8);
            
            for ($i = 0; $i < $leaveApplications; $i++) {
                $leaveType = $this->getRandomLeaveType();
                $leaveStatus = $this->getRandomLeaveStatus();
                
                // Generate leave dates (last 6 months)
                $fromDate = fake()->dateTimeBetween('-6 months', 'now');
                $leaveDuration = $this->getRandomLeaveDuration($leaveType);
                $toDate = Carbon::parse($fromDate)->addDays($leaveDuration - 1);
                
                // Calculate leave breakdown based on type and duration
                $leaveBreakdown = $this->calculateLeaveBreakdown($leaveType, $leaveDuration);
                
                LeaveTracker::create([
                    'financial_year_id' => $financialYear->id,
                    'username' => $employee->username,
                    'employee_id' => $employee->id,
                    'department_id' => $employee->department_id,
                    'cl_days' => $leaveBreakdown['cl_days'],
                    'cl_hours' => $leaveBreakdown['cl_hours'],
                    'ei_days' => $leaveBreakdown['ei_days'],
                    'ei_hours' => $leaveBreakdown['ei_hours'],
                    'lwp_days' => $leaveBreakdown['lwp_days'],
                    'lwp_hours' => $leaveBreakdown['lwp_hours'],
                    'medical_leave_in_days' => $leaveBreakdown['medical_days'],
                    'medical_leave_in_hours' => $leaveBreakdown['medical_hours'],
                    'other_leave_in_days' => $leaveBreakdown['other_days'],
                    'other_leave_in_hours' => $leaveBreakdown['other_hours'],
                    'leave_status' => $leaveStatus,
                    'leave_reason' => $this->getRandomLeaveReason($leaveType, $leaveReasons),
                    'leave_from_date' => $fromDate->format('Y-m-d'),
                    'leave_from_month' => $fromDate->format('m'),
                    'leave_from_year' => $fromDate->format('Y'),
                    'leave_to_date' => $toDate->format('Y-m-d'),
                    'leave_to_month' => $toDate->format('m'),
                    'leave_to_year' => $toDate->format('Y'),
                    'created_at' => $fromDate,
                    'updated_at' => $fromDate
                ]);
                
                $leaveTrackerCounter++;
            }
        }

        $this->command->info("Created {$leaveTrackerCounter} leave tracker records successfully!");
    }

    private function getRandomLeaveType()
    {
        $types = ['Casual Leave', 'Medical Leave', 'Emergency Leave', 'Other Leave'];
        $weights = [60, 25, 10, 5]; // 60% casual, 25% medical, 10% emergency, 5% other
        
        $rand = rand(1, 100);
        if ($rand <= 60) return 'Casual Leave';
        if ($rand <= 85) return 'Medical Leave';
        if ($rand <= 95) return 'Emergency Leave';
        return 'Other Leave';
    }

    private function getRandomLeaveStatus()
    {
        $statuses = ['Approved', 'Pending', 'Rejected'];
        $weights = [80, 15, 5]; // 80% approved, 15% pending, 5% rejected
        
        $rand = rand(1, 100);
        if ($rand <= 80) return 'Approved';
        if ($rand <= 95) return 'Pending';
        return 'Rejected';
    }

    private function getRandomLeaveDuration($leaveType)
    {
        switch ($leaveType) {
            case 'Casual Leave':
                return rand(1, 3); // 1-3 days
            case 'Medical Leave':
                return rand(1, 5); // 1-5 days
            case 'Emergency Leave':
                return rand(1, 2); // 1-2 days
            case 'Other Leave':
                return rand(1, 4); // 1-4 days
            default:
                return 1;
        }
    }

    private function calculateLeaveBreakdown($leaveType, $duration)
    {
        $breakdown = [
            'cl_days' => 0, 'cl_hours' => 0,
            'ei_days' => 0, 'ei_hours' => 0,
            'lwp_days' => 0, 'lwp_hours' => 0,
            'medical_days' => 0, 'medical_hours' => 0,
            'other_days' => 0, 'other_hours' => 0
        ];

        // 20% chance of half-day leave
        $isHalfDay = (rand(1, 100) <= 20) && $duration == 1;
        
        switch ($leaveType) {
            case 'Casual Leave':
                if ($isHalfDay) {
                    $breakdown['cl_hours'] = 4; // Half day = 4 hours
                } else {
                    $breakdown['cl_days'] = $duration;
                }
                break;
                
            case 'Medical Leave':
                if ($isHalfDay) {
                    $breakdown['medical_hours'] = 4;
                } else {
                    $breakdown['medical_days'] = $duration;
                }
                break;
                
            case 'Emergency Leave':
                if ($isHalfDay) {
                    $breakdown['ei_hours'] = 4;
                } else {
                    $breakdown['ei_days'] = $duration;
                }
                break;
                
            case 'Other Leave':
                if ($isHalfDay) {
                    $breakdown['other_hours'] = 4;
                } else {
                    $breakdown['other_days'] = $duration;
                }
                break;
        }

        return $breakdown;
    }

    private function getRandomLeaveReason($leaveType, $leaveReasons)
    {
        $reasons = $leaveReasons[$leaveType] ?? $leaveReasons['Casual Leave'];
        return $reasons[array_rand($reasons)];
    }
}