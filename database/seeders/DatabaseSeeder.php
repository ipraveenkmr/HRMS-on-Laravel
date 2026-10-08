<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\EmployeeDetails;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory(4)->create();

        User::factory()->create([
            'username' => 'praveen',
            'hashed_password' => Hash::make('12345678'),
            'is_active' => true,
        ]);
        EmployeeDetails::factory(10)->create();
    }
}
