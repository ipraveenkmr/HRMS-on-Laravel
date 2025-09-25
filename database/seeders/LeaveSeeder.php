<?php

namespace Database\Seeders;

use App\Models\Leave;
use App\Models\FinancialYear;
use Illuminate\Database\Seeder;

class LeaveSeeder extends Seeder
{
    public function run(): void
    {
        $financialYears = FinancialYear::all();

        foreach ($financialYears as $financialYear) {
            Leave::create([
                'financial_year_id' => $financialYear->id,
                'cl_days' => 12,
                'cl_hours' => 0,
                'ei_days' => 10,
                'ei_hours' => 0,
                'lwp_days' => 0,
                'lwp_hours' => 0,
                'medical_leave_in_days' => 7,
                'medical_leave_in_hours' => 0,
                'other_leave_in_days' => 3,
                'other_leave_in_hours' => 0
            ]);
        }
    }
}