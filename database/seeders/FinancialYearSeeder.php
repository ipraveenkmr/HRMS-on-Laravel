<?php

namespace Database\Seeders;

use App\Models\FinancialYear;
use Illuminate\Database\Seeder;

class FinancialYearSeeder extends Seeder
{
    public function run(): void
    {
        $financialYears = [
            [
                'year' => '2022-2023',
                'working_hours' => 8.5,
                'loan_interest_rate' => 7.5,
                'login_time' => '09:00',
                'logout_time' => '18:00'
            ],
            [
                'year' => '2023-2024',
                'working_hours' => 8.0,
                'loan_interest_rate' => 8.0,
                'login_time' => '09:00',
                'logout_time' => '17:30'
            ],
            [
                'year' => '2024-2025',
                'working_hours' => 8.5,
                'loan_interest_rate' => 7.25,
                'login_time' => '09:00',
                'logout_time' => '18:00'
            ],
            [
                'year' => '2025-2026',
                'working_hours' => 8.5,
                'loan_interest_rate' => 7.0,
                'login_time' => '09:00',
                'logout_time' => '18:00'
            ]
        ];

        foreach ($financialYears as $year) {
            FinancialYear::create($year);
        }
    }
}