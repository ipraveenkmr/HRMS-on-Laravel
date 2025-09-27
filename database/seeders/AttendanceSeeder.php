<?php

namespace Database\Seeders;

use App\Models\AttendanceRecord;
use App\Models\Employee;
use App\Models\FinancialYear;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class AttendanceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get current financial year (latest one)
        $financialYear = FinancialYear::orderBy('year', 'desc')->first();
        
        if (!$financialYear) {
            $this->command->error('No financial year found. Please run FinancialYearSeeder first.');
            return;
        }

        // Get all active employees
        $employees = Employee::where('emp_status', 'Working')->get();
        
        if ($employees->isEmpty()) {
            $this->command->error('No active employees found. Please run DatabaseSeeder first.');
            return;
        }

        $this->command->info('Creating attendance records for last 10 days...');

        // Generate attendance for last 10 days
        for ($i = 9; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            
            // Skip weekends (Saturday and Sunday)
            if ($date->isWeekend()) {
                continue;
            }

            $this->createAttendanceForDate($date, $employees, $financialYear);
        }

        $this->command->info('Attendance seeder completed successfully!');
    }

    /**
     * Create attendance records for a specific date
     */
    private function createAttendanceForDate($date, $employees, $financialYear)
    {
        $this->command->info("Creating attendance for {$date->format('Y-m-d')}");

        foreach ($employees as $employee) {
            // Random attendance pattern - 85% present, 10% absent, 5% half day
            $attendanceType = $this->getRandomAttendance();
            
            if ($attendanceType === 'Absent') {
                // Create absent record
                $this->createAttendanceRecord($employee, $date, $financialYear, [
                    'attendance' => 'Absent',
                    'login_at' => null,
                    'logout_at' => null,
                    'log_time' => 0,
                ]);
            } else {
                // Create present/half day record
                $loginTime = $this->getRandomLoginTime($attendanceType);
                $logoutTime = $this->getRandomLogoutTime($attendanceType, $loginTime);
                $logTime = $this->calculateLogTime($loginTime, $logoutTime);

                $this->createAttendanceRecord($employee, $date, $financialYear, [
                    'attendance' => $attendanceType,
                    'login_at' => $loginTime,
                    'logout_at' => $logoutTime,
                    'log_time' => $logTime,
                ]);
            }
        }
    }

    /**
     * Create an attendance record
     */
    private function createAttendanceRecord($employee, $date, $financialYear, $attendanceData)
    {
        AttendanceRecord::create([
            'financial_year_id' => $financialYear->id,
            'employee_id' => $employee->id,
            'department_id' => $employee->department_id,
            'attendance_date' => $date->format('Y-m-d'),
            'username' => $employee->username,
            'attendance' => $attendanceData['attendance'],
            'login_at' => $attendanceData['login_at'],
            'logout_at' => $attendanceData['logout_at'],
            'log_time' => $attendanceData['log_time'],
            'longitude' => $this->getRandomLongitude(),
            'latitude' => $this->getRandomLatitude(),
            'device' => $this->getRandomDevice(),
            'ip_address' => $this->getRandomIpAddress(),
            'login_date' => $date->format('d'),
            'login_month' => $date->format('m'),
            'login_year' => $date->format('Y'),
        ]);
    }

    /**
     * Get random attendance type based on realistic distribution
     */
    private function getRandomAttendance()
    {
        $rand = rand(1, 100);
        
        if ($rand <= 85) {
            return 'Present';
        } elseif ($rand <= 95) {
            return 'Absent';
        } else {
            return 'Half Day';
        }
    }

    /**
     * Get random login time based on attendance type
     */
    private function getRandomLoginTime($attendanceType)
    {
        if ($attendanceType === 'Present') {
            // Normal working hours: 9:00 AM to 10:30 AM
            $hour = rand(9, 10);
            $minute = $hour === 10 ? rand(0, 30) : rand(0, 59);
        } else { // Half Day
            // Late arrival: 11:00 AM to 1:00 PM
            $hour = rand(11, 13);
            $minute = rand(0, 59);
        }

        return sprintf('%02d:%02d', $hour, $minute);
    }

    /**
     * Get random logout time based on attendance type and login time
     */
    private function getRandomLogoutTime($attendanceType, $loginTime)
    {
        $loginHour = (int) substr($loginTime, 0, 2);
        $loginMinute = (int) substr($loginTime, 3, 2);

        if ($attendanceType === 'Present') {
            // Normal working hours: 6:00 PM to 8:00 PM
            $hour = rand(18, 20);
            $minute = $hour === 20 ? rand(0, 30) : rand(0, 59);
        } else { // Half Day
            // Half day: 4-5 hours after login
            $workHours = rand(4, 5);
            $totalMinutes = ($loginHour * 60 + $loginMinute) + ($workHours * 60) + rand(0, 59);
            $hour = intval($totalMinutes / 60);
            $minute = $totalMinutes % 60;
            
            // Cap at reasonable time
            if ($hour > 22) {
                $hour = 22;
                $minute = 0;
            }
        }

        return sprintf('%02d:%02d', $hour, $minute);
    }

    /**
     * Calculate log time in hours
     */
    private function calculateLogTime($loginTime, $logoutTime)
    {
        $loginHour = (int) substr($loginTime, 0, 2);
        $loginMinute = (int) substr($loginTime, 3, 2);
        $logoutHour = (int) substr($logoutTime, 0, 2);
        $logoutMinute = (int) substr($logoutTime, 3, 2);

        $loginTotalMinutes = $loginHour * 60 + $loginMinute;
        $logoutTotalMinutes = $logoutHour * 60 + $logoutMinute;

        $workMinutes = $logoutTotalMinutes - $loginTotalMinutes;
        
        // Subtract 1 hour lunch break for full day
        if ($workMinutes > 6 * 60) {
            $workMinutes -= 60;
        }

        return round($workMinutes / 60, 2);
    }

    /**
     * Get random longitude (Bangalore area)
     */
    private function getRandomLongitude()
    {
        return number_format(77.5946 + (rand(-500, 500) / 10000), 6);
    }

    /**
     * Get random latitude (Bangalore area)
     */
    private function getRandomLatitude()
    {
        return number_format(12.9716 + (rand(-500, 500) / 10000), 6);
    }

    /**
     * Get random device
     */
    private function getRandomDevice()
    {
        $devices = [
            'Android Mobile',
            'iPhone',
            'Desktop',
            'Laptop',
            'Tablet'
        ];

        return $devices[array_rand($devices)];
    }

    /**
     * Get random IP address
     */
    private function getRandomIpAddress()
    {
        return rand(192, 203) . '.' . rand(1, 255) . '.' . rand(1, 255) . '.' . rand(1, 255);
    }
}