<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;


/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\EmployeeDetails>
 */
class EmployeeDetailsFactory extends Factory
{
    public function definition(): array
    {
        return [
            'full_name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'phone_number' => $this->faker->phoneNumber(),
            'gender' => $this->faker->randomElement(['Male', 'Female', 'Non-binary', 'Prefer not to say']),
            'dob' => $this->faker->date('Y-m-d', '-20 years'), // 20+ years old
            'marital_status' => $this->faker->randomElement(['Single', 'Married', 'Divorced', null]),
            'nationality' => $this->faker->country(),
            'address' => $this->faker->address(),
            'city' => $this->faker->city(),
            'state' => $this->faker->state(),
            'pin_code' => $this->faker->postcode(),
            'pan_number' => 'PN' . strtoupper(Str::random(8)),
            'aadhaar_number' => $this->faker->unique()->optional()->numerify('############'),
            'employee_number' => 'EMP' . $this->faker->unique()->numberBetween(1000, 9999),
            'employment_type' => $this->faker->randomElement(['Permanent', 'Contract', 'Intern']),
            'department' => $this->faker->randomElement(['Engineering', 'HR', 'Sales', 'Marketing', 'Support']),
            'designation' => $this->faker->jobTitle(),
            'reporting_manager' => $this->faker->name(),
            'joining_date' => $this->faker->dateTimeBetween('-2 years', 'now')->format('Y-m-d'),
            'work_mode' => $this->faker->randomElement(['On-site', 'Remote', 'Hybrid']),
            'shift_type' => $this->faker->optional()->randomElement(['Day', 'Night', 'Rotational']),
            'qualification' => $this->faker->randomElement(['B.Tech', 'MBA', 'B.Sc', 'M.Sc', 'Diploma']),
            'specialization' => $this->faker->optional()->word(),
            'experience_years' => $this->faker->numberBetween(0, 15),
        ];
    }
}
