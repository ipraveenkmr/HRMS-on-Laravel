<?php

namespace Database\Seeders;

use App\Models\TravelExpense;
use App\Models\Employee;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class TravelExpenseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $employees = Employee::where('emp_status', 'Working')->get();
        $managers = Employee::whereIn('emp_type', ['Manager', 'Admin'])->get();
        
        if ($employees->isEmpty()) {
            $this->command->error('No employees found. Please run DatabaseSeeder first.');
            return;
        }

        $this->command->info('Creating travel expenses...');

        $expenseTypes = [
            'Transportation' => ['Train', 'Flight', 'Bus', 'Taxi', 'Auto Rickshaw', 'Metro'],
            'Accommodation' => ['Hotel', 'Guest House', 'Service Apartment'],
            'Food' => ['Breakfast', 'Lunch', 'Dinner', 'Snacks'],
            'Fuel' => ['Petrol', 'Diesel'],
            'Others' => ['Parking', 'Toll', 'Internet', 'Phone Bills', 'Miscellaneous']
        ];

        $locations = [
            'Bangalore', 'Mumbai', 'Delhi', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata',
            'Ahmedabad', 'Surat', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore',
            'Visakhapatnam', 'Bhopal', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana'
        ];

        $purposes = [
            'Client Meeting',
            'Business Development',
            'Training Program',
            'Conference Attendance',
            'Project Implementation',
            'Technical Support',
            'Site Visit',
            'Vendor Meeting',
            'Sales Presentation',
            'Team Building',
            'Audit Activity',
            'Installation Work',
            'Maintenance Work'
        ];

        $expenseCounter = 0;

        // Create travel expenses for random employees over last 3 months
        for ($month = 2; $month >= 0; $month--) {
            $startDate = Carbon::now()->subMonths($month)->startOfMonth();
            $endDate = Carbon::now()->subMonths($month)->endOfMonth();

            // 30% of employees have travel expenses each month
            $travelingEmployees = $employees->random(intval($employees->count() * 0.3));

            foreach ($travelingEmployees as $employee) {
                // Each traveling employee has 1-4 expense entries
                $expenseCount = rand(1, 4);

                for ($i = 0; $i < $expenseCount; $i++) {
                    $expenseDate = fake()->dateTimeBetween($startDate, $endDate);
                    $expenseType = array_rand($expenseTypes);
                    $specificType = $expenseTypes[$expenseType][array_rand($expenseTypes[$expenseType])];
                    
                    $fromLocation = $locations[array_rand($locations)];
                    $toLocation = $locations[array_rand($locations)];
                    
                    // Ensure different from and to locations
                    while ($toLocation === $fromLocation) {
                        $toLocation = $locations[array_rand($locations)];
                    }

                    $amount = $this->getAmountByType($expenseType, $specificType);
                    $status = $this->getRandomStatus();
                    $approver = $managers->random();

                    TravelExpense::create([
                        'employee_id' => $employee->id,
                        'department_id' => $employee->department_id,
                        'expense_type' => $specificType,
                        'amount' => $amount,
                        'currency' => 'INR',
                        'description' => $this->getExpenseDescription($specificType, $fromLocation, $toLocation),
                        'expense_date' => $expenseDate->format('Y-m-d'),
                        'from_location' => $fromLocation,
                        'to_location' => $toLocation,
                        'purpose' => $purposes[array_rand($purposes)],
                        'receipt_document' => null, // File uploads handled separately
                        'status' => $status,
                        'approved_by' => $status !== 'Pending' ? $approver->id : null,
                        'approval_date' => $status !== 'Pending' ? $this->getApprovalDate($expenseDate) : null,
                        'remarks' => $this->getStatusRemarks($status),
                        'username' => $employee->username,
                        'created_at' => $expenseDate,
                        'updated_at' => $expenseDate
                    ]);

                    $expenseCounter++;
                }
            }
        }

        $this->command->info("Created {$expenseCounter} travel expenses successfully!");
    }

    private function getAmountByType($type, $specific)
    {
        $amounts = [
            'Transportation' => [
                'Train' => [500, 3000],
                'Flight' => [3000, 15000],
                'Bus' => [300, 1500],
                'Taxi' => [200, 2000],
                'Auto Rickshaw' => [50, 500],
                'Metro' => [20, 200]
            ],
            'Accommodation' => [
                'Hotel' => [1500, 8000],
                'Guest House' => [800, 3000],
                'Service Apartment' => [2000, 10000]
            ],
            'Food' => [
                'Breakfast' => [100, 500],
                'Lunch' => [200, 800],
                'Dinner' => [300, 1200],
                'Snacks' => [50, 300]
            ],
            'Fuel' => [
                'Petrol' => [500, 3000],
                'Diesel' => [400, 2500]
            ],
            'Others' => [
                'Parking' => [50, 300],
                'Toll' => [100, 500],
                'Internet' => [200, 1000],
                'Phone Bills' => [100, 800],
                'Miscellaneous' => [100, 1500]
            ]
        ];

        $range = $amounts[$type][$specific] ?? [100, 1000];
        return rand($range[0], $range[1]);
    }

    private function getRandomStatus()
    {
        $statuses = ['Approved', 'Pending', 'Rejected'];
        $weights = [70, 20, 10]; // 70% approved, 20% pending, 10% rejected
        
        $rand = rand(1, 100);
        if ($rand <= 70) return 'Approved';
        if ($rand <= 90) return 'Pending';
        return 'Rejected';
    }

    private function getExpenseDescription($type, $from, $to)
    {
        $descriptions = [
            'Train' => "Train travel from {$from} to {$to}",
            'Flight' => "Flight booking from {$from} to {$to}",
            'Bus' => "Bus travel from {$from} to {$to}",
            'Taxi' => "Taxi fare from {$from} to {$to}",
            'Auto Rickshaw' => "Auto rickshaw fare in {$to}",
            'Metro' => "Metro travel in {$to}",
            'Hotel' => "Hotel accommodation in {$to}",
            'Guest House' => "Guest house stay in {$to}",
            'Service Apartment' => "Service apartment in {$to}",
            'Breakfast' => "Breakfast expense in {$to}",
            'Lunch' => "Lunch expense in {$to}",
            'Dinner' => "Dinner expense in {$to}",
            'Snacks' => "Snacks and refreshments in {$to}",
            'Petrol' => "Petrol expense for travel to {$to}",
            'Diesel' => "Diesel expense for travel to {$to}",
            'Parking' => "Parking charges in {$to}",
            'Toll' => "Toll charges for travel to {$to}",
            'Internet' => "Internet charges during stay in {$to}",
            'Phone Bills' => "Phone bills during travel to {$to}",
            'Miscellaneous' => "Miscellaneous expenses in {$to}"
        ];

        return $descriptions[$type] ?? "Expense for {$type} during travel to {$to}";
    }

    private function getStatusRemarks($status)
    {
        $remarks = [
            'Approved' => [
                'Expense approved as per company policy',
                'Valid expense with proper documentation',
                'Approved for reimbursement',
                'Expense within budget limits'
            ],
            'Pending' => [
                'Under review by manager',
                'Pending documentation verification',
                'Awaiting approval',
                'Under process'
            ],
            'Rejected' => [
                'Expense exceeds policy limits',
                'Insufficient documentation',
                'Not eligible for reimbursement',
                'Policy violation'
            ]
        ];

        $statusRemarks = $remarks[$status] ?? ['No remarks'];
        return $statusRemarks[array_rand($statusRemarks)];
    }

    private function getApprovalDate($expenseDate)
    {
        $expenseCarbon = Carbon::parse($expenseDate);
        $now = Carbon::now();
        
        // If expense date is in the future, return null
        if ($expenseCarbon->isFuture()) {
            return null;
        }
        
        // Approval should be between expense date and now (or expense date + 30 days, whichever is earlier)
        $maxApprovalDate = $expenseCarbon->copy()->addDays(30);
        if ($maxApprovalDate->isFuture()) {
            $maxApprovalDate = $now;
        }
        
        return fake()->dateTimeBetween($expenseCarbon, $maxApprovalDate);
    }
}