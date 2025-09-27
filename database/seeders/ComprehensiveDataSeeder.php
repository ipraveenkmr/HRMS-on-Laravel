<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class ComprehensiveDataSeeder extends Seeder
{
    /**
     * Run the comprehensive data seeders in proper order.
     */
    public function run(): void
    {
        $this->command->info('Starting comprehensive data seeding...');
        
        // Seed core HR data first
        $this->call([
            TaskSeeder::class,
            DailyTaskSeeder::class,
            PayslipSeeder::class,
            TravelExpenseSeeder::class,
            LoanSeeder::class,
            LeaveCalculatorSeeder::class,
            LeaveTrackerSeeder::class,
            AssetAllocationSeeder::class,
        ]);

        $this->command->info('Comprehensive data seeding completed successfully!');
        $this->command->info('');
        $this->command->info('Summary of seeded data:');
        $this->command->info('- Tasks (AssignedJobs): Multiple tasks per employee');
        $this->command->info('- Daily Tasks: Last 15 working days');
        $this->command->info('- Payslips: Last 6 months for all employees');
        $this->command->info('- Travel Expenses: Last 3 months for 30% of employees');
        $this->command->info('- Loans & Loan Calculators: 40% of employees have loans');
        $this->command->info('- Leave Calculators: All employees with remaining leave balances');
        $this->command->info('- Leave Trackers: Leave applications over last 6 months');
        $this->command->info('- Asset Allocations: Current and historical asset assignments');
    }
}