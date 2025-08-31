<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\EmployeeDetails;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory(4)->create();

        User::factory()->create([
            'name' => 'Praveen Kumar',
            'email' => 'praveen@trickuweb.com',
            'password' => bcrypt('12345678'),
        ]);
        EmployeeDetails::factory(10)->create();
    }
}
