<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seeds master users, employees, companies, departments, branches, pay grades, assets, and profiles
        $this->call([
            UserMasterSeeder::class,
        ]);

        // To seed mock transactions (dummy attendance, tasks, leaves, loans, payslips, travel claims), run:
        // php artisan db:seed --class=MockActivitySeeder
    }
}
