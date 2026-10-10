<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Employee;
use App\Models\FinancialYear;
use App\Models\LeaveTracker;
use App\Models\AttendanceRecord;
use App\Models\AssignedJob;
use App\Models\DailyTask;
use App\Models\Loan;
use App\Models\LoanCalculator;
use App\Models\Payslip;
use App\Models\TravelExpense;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MockActivitySeeder extends Seeder
{
    public function run(): void
    {
        $employeeModels = Employee::all();
        $userModels = User::all();
        $currentFy = FinancialYear::where('year', '2025-2026')->first() ?? FinancialYear::first();

        if ($employeeModels->isEmpty() || !$currentFy) {
            $this->command->warn('Please run UserMasterSeeder first before MockActivitySeeder.');
            return;
        }

        // ==========================================
        // 1. LEAVE TRACKERS & AUDITS (20 records)
        // ==========================================
        $leaveReasons = [
            'Attending family function',
            'Severe viral fever and medical rest',
            'Annual family vacation',
            'Personal urgent administrative work',
            'Dental surgery and recovery',
            'Home shifting and relocation',
            'Sibling wedding ceremony',
            'Medical checkup and consultation',
            'Child school admission and exams',
            'Attending tech conference',
        ];

        $leaveStatuses = ['Approved', 'Pending', 'Rejected', 'Approved', 'Pending'];

        for ($i = 0; $i < 20; $i++) {
            $emp = $employeeModels[$i % count($employeeModels)];
            $status = $leaveStatuses[$i % count($leaveStatuses)];
            $reason = $leaveReasons[$i % count($leaveReasons)];
            $day = sprintf('%02d', ($i % 25) + 1);

            $lt = LeaveTracker::create([
                'financial_year_id' => $currentFy->id,
                'username' => $emp->username,
                'employee_id' => $emp->id,
                'department_id' => $emp->department_id,
                'cl_days' => ($i % 2 == 0) ? 2.0 : 0.0,
                'cl_hours' => ($i % 2 == 0) ? 16.0 : 0.0,
                'ei_days' => ($i % 3 == 0) ? 3.0 : 0.0,
                'ei_hours' => ($i % 3 == 0) ? 24.0 : 0.0,
                'lwp_days' => 0,
                'lwp_hours' => 0,
                'medical_leave_in_days' => ($i % 4 == 0) ? 2.0 : 0.0,
                'medical_leave_in_hours' => ($i % 4 == 0) ? 16.0 : 0.0,
                'other_leave_in_days' => 0,
                'other_leave_in_hours' => 0,
                'leave_status' => $status,
                'leave_reason' => $reason,
                'leave_from_date' => $day,
                'leave_from_month' => '10',
                'leave_from_year' => '2026',
                'leave_to_date' => sprintf('%02d', ($i % 25) + 3),
                'leave_to_month' => '10',
                'leave_to_year' => '2026',
            ]);

            DB::table('leave_audits')->insert([
                'leave_tracker_id' => $lt->id,
                'actor_user_id' => $userModels[0]->id,
                'action' => ($status === 'Approved') ? 'approve' : (($status === 'Rejected') ? 'reject' : 'apply'),
                'before' => json_encode(['leave_status' => 'Pending']),
                'after' => json_encode(['leave_status' => $status]),
                'created_at' => now()->subDays(20 - $i),
            ]);
        }

        // ==========================================
        // 2. ATTENDANCE RECORDS (25 records)
        // ==========================================
        $attendanceTypes = ['Present', 'Present', 'Work From Home', 'Present', 'Half Day'];
        for ($i = 0; $i < 25; $i++) {
            $emp = $employeeModels[$i % count($employeeModels)];
            $dayNum = ($i % 28) + 1;
            $attDate = '2026-10-' . sprintf('%02d', $dayNum);
            $attType = $attendanceTypes[$i % count($attendanceTypes)];

            AttendanceRecord::firstOrCreate(
                [
                    'employee_id' => $emp->id,
                    'attendance_date' => $attDate,
                ],
                [
                    'financial_year_id' => $currentFy->id,
                    'department_id' => $emp->department_id,
                    'username' => $emp->username,
                    'attendance' => $attType,
                    'login_at' => '09:1' . ($i % 9) . ':00',
                    'logout_at' => '18:0' . ($i % 9) . ':00',
                    'log_time' => 8.5,
                    'longitude' => '77.5946',
                    'latitude' => '12.9716',
                    'device' => 'Web Browser (Chrome/Windows)',
                    'ip_address' => '192.168.1.' . (10 + $i),
                    'login_date' => sprintf('%02d', $dayNum),
                    'login_month' => '10',
                    'login_year' => '2026',
                ]
            );
        }

        // ==========================================
        // 3. ASSIGNED JOBS (20 records)
        // ==========================================
        $jobTitles = [
            'Refactor Sanctum API authentication controller',
            'Design Figma mockups for Mobile Dashboard',
            'Setup GitHub Actions CI/CD Pipeline for staging',
            'Conduct quarterly penetration testing and audit',
            'Migrate database tables to support audit trails',
            'Prepare monthly financial compliance reports',
            'Implement dark mode toggle on React front-end',
            'Setup automated Redis cache for leave calculation',
            'Optimize MySQL queries for large payroll generation',
            'Configure AWS S3 bucket policies for document storage',
            'Review candidates for Senior DevOps Engineer role',
            'Draft internal cybersecurity guideline documentation',
            'Resolve customer support escalations for enterprise tier',
            'Deploy Kubernetes Helm charts for microservices',
            'Create interactive charts for HR analytics dashboard',
            'Implement export to Excel/CSV for travel claims',
            'Conduct quarterly employee performance review cycle',
            'Audit all physical IT hardware assets in branch 1',
            'Integrate Razorpay payment gateway for vendor payouts',
            'Create automated backup script with cron triggers',
        ];

        for ($i = 0; $i < 20; $i++) {
            $emp = $employeeModels[$i % count($employeeModels)];
            AssignedJob::create([
                'task' => $jobTitles[$i],
                'username' => $emp->username,
                'employee_id' => $emp->id,
                'department_id' => $emp->department_id,
                'manager' => 'Vikram Malhotra',
                'task_time' => '4 hours',
                'comment' => 'High priority deliverable for sprint ' . (($i % 4) + 1),
                'submission_date' => '2026-10-' . sprintf('%02d', ($i % 25) + 5),
                'status' => ($i % 3 == 0) ? 'Completed' : (($i % 3 == 1) ? 'In Progress' : 'Pending'),
                'document' => null,
                'description' => 'Detailed task specifications: please review standard coding guidelines before PR.',
            ]);
        }

        // ==========================================
        // 4. DAILY TASKS (20 records)
        // ==========================================
        $dailyTaskSummaries = [
            'Fixed critical bug in attendance login calculation logic',
            'Reviewed 6 pull requests on GitHub for Sprint 12',
            'Attended weekly engineering sprint planning and standup',
            'Created unit tests for payslip deduction calculator',
            'Deployed release v2.4.1 to staging environment',
            'Onboarded 3 new junior software engineering recruits',
            'Conducted financial reconciliation for September bank statement',
            'Organized team building workshop for Marketing department',
            'Configured Cloudflare WAF rules for DDoS prevention',
            'Updated Swagger OpenAPI documentation for auth endpoints',
            'Resolved 14 tickets on Jira support desk',
            'Tested responsive breakpoints across iPad and mobile screens',
            'Optimized Docker image builds reducing size by 40%',
            'Audited employee KYC documents and verified PAN cards',
            'Prepared monthly TDS and GST tax filings draft',
            'Organized all hardware inventory in server room racks',
            'Conducted client onboarding demo call with UK client',
            'Implemented real-time toast notifications for leave approvals',
            'Upgraded npm packages to latest security patches',
            'Benchmarked database query execution times under 500 RPS',
        ];

        for ($i = 0; $i < 20; $i++) {
            $emp = $employeeModels[$i % count($employeeModels)];
            DailyTask::create([
                'task' => $dailyTaskSummaries[$i],
                'username' => $emp->username,
                'employee_id' => $emp->id,
                'department_id' => $emp->department_id,
                'manager' => 'Vikram Malhotra',
                'submission_date' => '2026-10-' . sprintf('%02d', ($i % 28) + 1),
                'document' => null,
                'description' => 'Completed regular daily duties and reported blockers to team lead.',
            ]);
        }

        // ==========================================
        // 5. LOANS & LOAN CALCULATORS (16 records)
        // ==========================================
        $loanPurposes = [
            'Home renovation and electrical repair',
            'Higher education course fee payment',
            'Emergency medical treatment and surgery',
            'Purchase of two-wheeler vehicle',
            'Relocation and house deposit advance',
            'Personal family emergency',
            'Professional certification course',
            'Purchase of specialized ergonomic furniture',
        ];

        $loanAmounts = [50000, 100000, 150000, 200000, 75000, 120000, 250000, 80000];

        for ($i = 0; $i < 16; $i++) {
            $emp = $employeeModels[$i % count($employeeModels)];
            $amount = $loanAmounts[$i % count($loanAmounts)];
            $tenure = ($i % 2 == 0) ? 12 : 24;
            $rate = 7.5;
            $interest = ($amount * $rate * ($tenure / 12)) / 100;
            $totalAmount = $amount + $interest;
            $emi = round($totalAmount / $tenure, 2);

            $loan = Loan::create([
                'financial_year_id' => $currentFy->id,
                'username' => $emp->username,
                'employee_id' => $emp->id,
                'department_id' => $emp->department_id,
                'loan_amount' => $amount,
                'loan_period_in_month' => $tenure,
                'interest_rate' => $rate,
                'status' => ($i % 4 == 0) ? 'Closed' : 'Active',
                'apply_date' => '2026-0' . (($i % 9) + 1) . '-10',
                'purpose' => $loanPurposes[$i % count($loanPurposes)],
            ]);

            LoanCalculator::create([
                'loan_id' => $loan->id,
                'financial_year_id' => $currentFy->id,
                'username' => $emp->username,
                'employee_id' => $emp->id,
                'department_id' => $emp->department_id,
                'total_amount' => $totalAmount,
                'status' => $loan->status,
                'emi' => $emi,
                'remaining_loan_amount' => ($loan->status === 'Closed') ? 0 : round($totalAmount - ($emi * ($i % 6)), 2),
                'remaining_loan_period_in_month' => ($loan->status === 'Closed') ? 0 : max(0, $tenure - ($i % 6)),
            ]);
        }

        // ==========================================
        // 6. PAYSLIPS (20 records)
        // ==========================================
        $months = ['2026-08', '2026-09'];
        $pCount = 0;
        foreach ($months as $m) {
            foreach ($employeeModels as $emp) {
                if ($pCount >= 20) break 2;
                $gross = $emp->gross_salary;
                $basic = round($gross * 0.40, 2);
                $hra = round($gross * 0.20, 2);
                $ta = round($gross * 0.10, 2);
                $sa = round($gross * 0.20, 2);
                $medical = round($gross * 0.05, 2);
                $edu = round($gross * 0.05, 2);
                $pf = round($basic * 0.12, 2);
                $esi = ($gross <= 21000) ? round($gross * 0.0075, 2) : 0;
                $tax = ($gross > 100000) ? round($gross * 0.10, 2) : 0;
                $totalDeductions = $pf + $esi + $tax;
                $netSalary = $gross - $totalDeductions;

                Payslip::firstOrCreate(
                    [
                        'employee_id' => $emp->id,
                        'month_year' => $m,
                    ],
                    [
                        'username' => $emp->username,
                        'department_id' => $emp->department_id,
                        'date' => $m . '-30',
                        'basic' => $basic,
                        'hra' => $hra,
                        'ta' => $ta,
                        'com' => 0,
                        'medical' => $medical,
                        'edu' => $edu,
                        'sa' => $sa,
                        'pf' => $pf,
                        'esi' => $esi,
                        'income_tax' => $tax,
                        'cl_taken' => 0,
                        'ei_taken' => 0,
                        'lwp_taken' => 0,
                        'advance_pay' => 0,
                        'leave_travel_allowance' => 0,
                        'telephone_expense' => 1500,
                        'fuel_and_maint_two_wheeler' => 0,
                        'fuel_and_maint_four_wheeler' => 0,
                        'other_expense' => 0,
                        'paid_days' => 30,
                        'total_days' => 30,
                        'total_earning' => $gross,
                        'total_deduction' => $totalDeductions,
                        'total_reimbursement' => 1500,
                        'net_current_salary' => $netSalary + 1500,
                        'salary_status' => 'Paid',
                        'esi_number' => $emp->esi_number,
                        'uan_number' => $emp->uan_number,
                    ]
                );
                $pCount++;
            }
        }

        // ==========================================
        // 7. TRAVEL EXPENSES (15 records)
        // ==========================================
        $travelTrips = [
            ['from' => 'Bengaluru', 'to' => 'Mumbai', 'amount' => 14500, 'purpose' => 'Annual Client Leadership Summit', 'type' => 'Flight'],
            ['from' => 'Bengaluru', 'to' => 'Hyderabad', 'amount' => 8200, 'purpose' => 'Sprint Delivery Architecture Review', 'type' => 'Train'],
            ['from' => 'Pune', 'to' => 'Goa', 'amount' => 6500, 'purpose' => 'Design Sprint Team Offsite', 'type' => 'Cab'],
            ['from' => 'Mumbai', 'to' => 'Delhi NCR', 'amount' => 16800, 'purpose' => 'Enterprise Sales Closing Meeting', 'type' => 'Flight'],
            ['from' => 'Hyderabad', 'to' => 'Bengaluru', 'amount' => 9500, 'purpose' => 'Campus Recruitment Drive at IIT', 'type' => 'Flight'],
        ];

        for ($i = 0; $i < 15; $i++) {
            $emp = $employeeModels[$i % count($employeeModels)];
            $t = $travelTrips[$i % count($travelTrips)];
            $status = ($i % 3 == 0) ? 'Approved' : (($i % 3 == 1) ? 'Pending' : 'Rejected');

            TravelExpense::create([
                'employee_id' => $emp->id,
                'department_id' => $emp->department_id,
                'expense_type' => $t['type'],
                'amount' => $t['amount'],
                'currency' => 'INR',
                'description' => 'Travel expense claim for ' . $t['purpose'],
                'expense_date' => '2026-09-' . sprintf('%02d', ($i % 25) + 1),
                'from_location' => $t['from'],
                'to_location' => $t['to'],
                'purpose' => $t['purpose'],
                'receipt_document' => null,
                'status' => $status,
                'approved_by' => ($status === 'Approved') ? $employeeModels[0]->id : null,
                'approval_date' => ($status === 'Approved') ? now()->subDays(10 - ($i % 5)) : null,
                'remarks' => ($status === 'Approved') ? 'Approved as per corporate travel policy limits.' : 'Under review.',
                'username' => $emp->username,
            ]);
        }
    }
}
