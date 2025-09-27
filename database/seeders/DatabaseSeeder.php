<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Employee;
use App\Models\EmployeeDetails;
use App\Models\CompanyDetail;
use App\Models\BranchDetail;
use App\Models\Department;
use App\Models\PayGrade;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create basic master data first
        $this->createMasterData();

        // Create financial years and leaves
        $this->call([
            FinancialYearSeeder::class,
            LeaveSeeder::class,
        ]);

        // Create asset categories and assets
        $this->call([
            AssetCategorySeeder::class,
            AssetSeeder::class,
        ]);

        // Create the specific users as requested
        $this->createDefaultUsers();

        // Create generic role-based users
        $this->createGenericRoleUsers();

        // Create additional employees (22 more to total 25)
        $this->createAdditionalEmployees();

        // Create additional employee details
        EmployeeDetails::factory(10)->create();

        // Create attendance records for last 10 days
        $this->call([
            AttendanceSeeder::class,
        ]);

        // Create comprehensive HR data
        $this->call([
            ComprehensiveDataSeeder::class,
        ]);
    }

    private function createMasterData()
    {
        // Create Companies
        $companies = [
            [
                'company_name' => 'TrickuWeb Technologies',
                'company_address' => 'Tech Park, Bangalore, Karnataka, India',
                'support_email' => 'support@trickuweb.com',
                'longitude' => 77.5946,
                'latitude' => 12.9716,
                'status' => 'Active'
            ],
            [
                'company_name' => 'InnovateSoft Solutions',
                'company_address' => 'IT Hub, Hyderabad, Telangana, India',
                'support_email' => 'support@innovatesoft.com',
                'longitude' => 78.4867,
                'latitude' => 17.3850,
                'status' => 'Active'
            ],
            [
                'company_name' => 'TechForward India',
                'company_address' => 'Cyber City, Pune, Maharashtra, India',
                'support_email' => 'help@techforward.in',
                'longitude' => 73.8567,
                'latitude' => 18.5204,
                'status' => 'Active'
            ],
            [
                'company_name' => 'Digital Dynamics Corp',
                'company_address' => 'Software Park, Chennai, Tamil Nadu, India',
                'support_email' => 'contact@digitaldynamics.com',
                'longitude' => 80.2707,
                'latitude' => 13.0827,
                'status' => 'Active'
            ],
            [
                'company_name' => 'NextGen Systems',
                'company_address' => 'Tech Valley, Noida, Uttar Pradesh, India',
                'support_email' => 'info@nextgensys.com',
                'longitude' => 77.3910,
                'latitude' => 28.5355,
                'status' => 'Active'
            ]
        ];

        $createdCompanies = [];
        foreach ($companies as $companyData) {
            $createdCompanies[] = CompanyDetail::create($companyData);
        }

        // Get the main company for backwards compatibility
        $company = $createdCompanies[0];

        // Create Branches for all companies
        $branches = [
            // TrickuWeb Technologies branches
            [
                'company_name_id' => $createdCompanies[0]->id,
                'branch_name' => 'Bangalore Main Branch',
                'branch_address' => 'Tech Park, Bangalore, Karnataka, India',
                'longitude' => 77.5946,
                'latitude' => 12.9716
            ],
            [
                'company_name_id' => $createdCompanies[0]->id,
                'branch_name' => 'Bangalore North Branch',
                'branch_address' => 'Manyata Tech Park, Bangalore, Karnataka, India',
                'longitude' => 77.6211,
                'latitude' => 13.0389
            ],
            [
                'company_name_id' => $createdCompanies[0]->id,
                'branch_name' => 'Mumbai Branch',
                'branch_address' => 'BKC, Mumbai, Maharashtra, India',
                'longitude' => 72.8777,
                'latitude' => 19.0760
            ],

            // InnovateSoft Solutions branches
            [
                'company_name_id' => $createdCompanies[1]->id,
                'branch_name' => 'Hyderabad Main Branch',
                'branch_address' => 'HITEC City, Hyderabad, Telangana, India',
                'longitude' => 78.4867,
                'latitude' => 17.3850
            ],
            [
                'company_name_id' => $createdCompanies[1]->id,
                'branch_name' => 'Hyderabad Gachibowli Branch',
                'branch_address' => 'Gachibowli, Hyderabad, Telangana, India',
                'longitude' => 78.3682,
                'latitude' => 17.4399
            ],

            // TechForward India branches
            [
                'company_name_id' => $createdCompanies[2]->id,
                'branch_name' => 'Pune Main Branch',
                'branch_address' => 'Hinjewadi Phase 1, Pune, Maharashtra, India',
                'longitude' => 73.7279,
                'latitude' => 18.5912
            ],
            [
                'company_name_id' => $createdCompanies[2]->id,
                'branch_name' => 'Pune Magarpatta Branch',
                'branch_address' => 'Magarpatta City, Pune, Maharashtra, India',
                'longitude' => 73.9297,
                'latitude' => 18.5157
            ],

            // Digital Dynamics Corp branches
            [
                'company_name_id' => $createdCompanies[3]->id,
                'branch_name' => 'Chennai Main Branch',
                'branch_address' => 'OMR, Chennai, Tamil Nadu, India',
                'longitude' => 80.2482,
                'latitude' => 12.8406
            ],
            [
                'company_name_id' => $createdCompanies[3]->id,
                'branch_name' => 'Chennai Thoraipakkam Branch',
                'branch_address' => 'Thoraipakkam, Chennai, Tamil Nadu, India',
                'longitude' => 80.2410,
                'latitude' => 12.9398
            ],

            // NextGen Systems branches
            [
                'company_name_id' => $createdCompanies[4]->id,
                'branch_name' => 'Noida Main Branch',
                'branch_address' => 'Sector 62, Noida, Uttar Pradesh, India',
                'longitude' => 77.3674,
                'latitude' => 28.6273
            ],
            [
                'company_name_id' => $createdCompanies[4]->id,
                'branch_name' => 'Gurgaon Branch',
                'branch_address' => 'Cyber Hub, Gurgaon, Haryana, India',
                'longitude' => 77.0688,
                'latitude' => 28.4595
            ]
        ];

        $createdBranches = [];
        foreach ($branches as $branchData) {
            $createdBranches[] = BranchDetail::create($branchData);
        }

        // Get the main branch for backwards compatibility
        $branch = $createdBranches[0];

        // Create Departments
        $departments = [
            ['department_name' => 'Administration'],
            ['department_name' => 'Human Resources'],
            ['department_name' => 'Engineering'],
            ['department_name' => 'Sales'],
            ['department_name' => 'Marketing']
        ];

        foreach ($departments as $dept) {
            Department::create($dept);
        }

        // Create Pay Grades
        $payGrades = [
            [
                'grade' => 1,
                'min_gross_range' => 300000,
                'max_gross_range' => 500000,
                'basic' => 50.0,
                'hra' => 20.0,
                'ta' => 10.0,
                'com' => 5.0,
                'medical' => 3.0,
                'edu' => 2.0,
                'sa' => 10.0,
                'income_tax' => 5.0
            ],
            [
                'grade' => 2,
                'min_gross_range' => 500000,
                'max_gross_range' => 800000,
                'basic' => 50.0,
                'hra' => 20.0,
                'ta' => 10.0,
                'com' => 5.0,
                'medical' => 3.0,
                'edu' => 2.0,
                'sa' => 10.0,
                'income_tax' => 10.0
            ],
            [
                'grade' => 3,
                'min_gross_range' => 800000,
                'max_gross_range' => 1200000,
                'basic' => 50.0,
                'hra' => 20.0,
                'ta' => 10.0,
                'com' => 5.0,
                'medical' => 3.0,
                'edu' => 2.0,
                'sa' => 10.0,
                'income_tax' => 15.0
            ],
            [
                'grade' => 4,
                'min_gross_range' => 1200000,
                'max_gross_range' => 1800000,
                'basic' => 50.0,
                'hra' => 20.0,
                'ta' => 10.0,
                'com' => 5.0,
                'medical' => 3.0,
                'edu' => 2.0,
                'sa' => 10.0,
                'income_tax' => 20.0
            ],
            [
                'grade' => 5,
                'min_gross_range' => 1800000,
                'max_gross_range' => 2500000,
                'basic' => 50.0,
                'hra' => 20.0,
                'ta' => 10.0,
                'com' => 5.0,
                'medical' => 3.0,
                'edu' => 2.0,
                'sa' => 10.0,
                'income_tax' => 25.0
            ]
        ];

        foreach ($payGrades as $grade) {
            PayGrade::create($grade);
        }
    }

    private function createDefaultUsers()
    {
        // Get the created master data
        $company = CompanyDetail::first();
        $branch = BranchDetail::first();
        $adminDept = Department::where('department_name', 'Administration')->first();
        $hrDept = Department::where('department_name', 'Human Resources')->first();
        $engDept = Department::where('department_name', 'Engineering')->first();
        $payGradeL5 = PayGrade::where('grade', 5)->first();
        $payGradeL3 = PayGrade::where('grade', 3)->first();
        $payGradeL2 = PayGrade::where('grade', 2)->first();

        // 1. Praveen - Admin
        $praveenUser = User::create([
            'username' => 'praveen',
            'hashed_password' => '$2y$12$yVHYyf9yhOflnzzOTgrwNOvo3agCvxB0C6v2B/Ks/nx8fHCwYApd2',
            'is_active' => true,
            'created_at' => '2025-09-18 08:12:56',
            'updated_at' => '2025-09-18 08:12:56'
        ]);

        Employee::create([
            'username' => 'praveen',
            'emp_name' => 'Praveen Kumar',
            'company_name_id' => $company->id,
            'branch_name_id' => $branch->id,
            'emp_email' => 'praveen@trickuweb.com',
            'emp_phone' => '+91 9876543210',
            'emp_no' => 'EMP001',
            'joining_date' => '2023-01-15',
            'department_id' => $adminDept->id,
            'designation' => 'System Administrator',
            'emp_type' => 'Admin',
            'job_type' => 'Permanent',
            'emp_status' => 'Working',
            'pay_grade_id' => $payGradeL5->id,
            'gross_salary' => 2000000,
            'ctc' => 2400000,
            'gender' => 'Male',
            'work_mode' => 'Office'
        ]);

        // 2. Priyanka - Manager
        $priyankaUser = User::create([
            'username' => 'priyanka',
            'hashed_password' => '$2y$12$lNaVX1me6zOqrfPaimCeaenlQbd5.O/PLwyr6QhQi5SN.GLWNAh6e',
            'is_active' => true,
            'created_at' => '2025-09-19 07:20:38',
            'updated_at' => '2025-09-19 07:20:38'
        ]);

        Employee::create([
            'username' => 'priyanka',
            'emp_name' => 'Priyanka Sharma',
            'company_name_id' => $company->id,
            'branch_name_id' => $branch->id,
            'emp_email' => 'priyanka@trickuweb.com',
            'emp_phone' => '+91 9876543211',
            'emp_no' => 'EMP002',
            'joining_date' => '2023-02-01',
            'department_id' => $hrDept->id,
            'designation' => 'HR Manager',
            'emp_type' => 'Manager',
            'job_type' => 'Permanent',
            'emp_status' => 'Working',
            'pay_grade_id' => $payGradeL3->id,
            'gross_salary' => 1000000,
            'ctc' => 1200000,
            'gender' => 'Female',
            'work_mode' => 'Office'
        ]);

        // 3. Nitin - Employee
        $nitinUser = User::create([
            'username' => 'nitin',
            'hashed_password' => '$2y$12$9Z8zGhCE4mnnd76p.ybkYuZB6LkjVY8gHqxR2qTYaCwzZSCmvRSzK',
            'is_active' => true,
            'created_at' => '2025-09-19 07:22:48',
            'updated_at' => '2025-09-19 07:22:48'
        ]);

        Employee::create([
            'username' => 'nitin',
            'emp_name' => 'Nitin Patel',
            'company_name_id' => $company->id,
            'branch_name_id' => $branch->id,
            'emp_email' => 'nitin@trickuweb.com',
            'emp_phone' => '+91 9876543212',
            'emp_no' => 'EMP003',
            'joining_date' => '2023-03-01',
            'department_id' => $engDept->id,
            'designation' => 'Software Developer',
            'emp_type' => 'Employee',
            'job_type' => 'Permanent',
            'emp_status' => 'Working',
            'pay_grade_id' => $payGradeL2->id,
            'gross_salary' => 600000,
            'ctc' => 720000,
            'gender' => 'Male',
            'work_mode' => 'Office',
            'manager_id' => 2 // Priyanka as manager
        ]);
    }

    private function createGenericRoleUsers()
    {
        // Get the created master data
        $company = CompanyDetail::first();
        $branch = BranchDetail::first();
        $adminDept = Department::where('department_name', 'Administration')->first();
        $hrDept = Department::where('department_name', 'Human Resources')->first();
        $engDept = Department::where('department_name', 'Engineering')->first();
        $payGradeL5 = PayGrade::where('grade', 5)->first();
        $payGradeL3 = PayGrade::where('grade', 3)->first();
        $payGradeL2 = PayGrade::where('grade', 2)->first();

        // 1. Generic Admin User
        User::create([
            'username' => 'admin',
            'hashed_password' => bcrypt('Admin@123'),
            'is_active' => true,
        ]);

        Employee::create([
            'username' => 'admin',
            'emp_name' => 'System Admin',
            'company_name_id' => $company->id,
            'branch_name_id' => $branch->id,
            'emp_email' => 'admin@trickuweb.com',
            'emp_phone' => '+91 9000000001',
            'emp_no' => 'EMP901',
            'joining_date' => '2023-01-01',
            'department_id' => $adminDept->id,
            'designation' => 'System Administrator',
            'emp_type' => 'Admin',
            'job_type' => 'Permanent',
            'emp_status' => 'Working',
            'pay_grade_id' => $payGradeL5->id,
            'gross_salary' => 2200000,
            'ctc' => 2640000,
            'gender' => 'Male',
            'work_mode' => 'Office'
        ]);

        // 2. Generic Manager User
        User::create([
            'username' => 'manager',
            'hashed_password' => bcrypt('Manager@123'),
            'is_active' => true,
        ]);

        Employee::create([
            'username' => 'manager',
            'emp_name' => 'Department Manager',
            'company_name_id' => $company->id,
            'branch_name_id' => $branch->id,
            'emp_email' => 'manager@trickuweb.com',
            'emp_phone' => '+91 9000000002',
            'emp_no' => 'EMP902',
            'joining_date' => '2023-02-01',
            'department_id' => $hrDept->id,
            'designation' => 'Department Manager',
            'emp_type' => 'Manager',
            'job_type' => 'Permanent',
            'emp_status' => 'Working',
            'pay_grade_id' => $payGradeL3->id,
            'gross_salary' => 1100000,
            'ctc' => 1320000,
            'gender' => 'Female',
            'work_mode' => 'Office'
        ]);

        // 3. Generic Employee User
        User::create([
            'username' => 'employee',
            'hashed_password' => bcrypt('Employee@123'),
            'is_active' => true,
        ]);

        Employee::create([
            'username' => 'employee',
            'emp_name' => 'Test Employee',
            'company_name_id' => $company->id,
            'branch_name_id' => $branch->id,
            'emp_email' => 'employee@trickuweb.com',
            'emp_phone' => '+91 9000000003',
            'emp_no' => 'EMP903',
            'joining_date' => '2023-03-01',
            'department_id' => $engDept->id,
            'designation' => 'Software Engineer',
            'emp_type' => 'Employee',
            'job_type' => 'Permanent',
            'emp_status' => 'Working',
            'pay_grade_id' => $payGradeL2->id,
            'gross_salary' => 650000,
            'ctc' => 780000,
            'gender' => 'Male',
            'work_mode' => 'Office',
            'manager_id' => 2 // Reports to Priyanka (HR Manager)
        ]);
    }

    private function createAdditionalEmployees()
    {
        // Get master data
        $company = CompanyDetail::first();
        $branch = BranchDetail::first();
        $departments = Department::all();
        $payGrades = PayGrade::all();

        // Employee data for creating 22 additional employees (total 25)
        $employeesData = [
            // Engineering Team (10 employees)
            ['name' => 'Rahul Sharma', 'username' => 'rahul', 'email' => 'rahul@trickuweb.com', 'dept' => 'Engineering', 'designation' => 'Senior Developer', 'type' => 'Employee', 'grade' => 3, 'manager_id' => 2],
            ['name' => 'Anjali Gupta', 'username' => 'anjali', 'email' => 'anjali@trickuweb.com', 'dept' => 'Engineering', 'designation' => 'Frontend Developer', 'type' => 'Employee', 'grade' => 2, 'manager_id' => 2],
            ['name' => 'Vikash Kumar', 'username' => 'vikash', 'email' => 'vikash@trickuweb.com', 'dept' => 'Engineering', 'designation' => 'Backend Developer', 'type' => 'Employee', 'grade' => 2, 'manager_id' => 2],
            ['name' => 'Pooja Singh', 'username' => 'pooja', 'email' => 'pooja@trickuweb.com', 'dept' => 'Engineering', 'designation' => 'QA Engineer', 'type' => 'Employee', 'grade' => 2, 'manager_id' => 2],
            ['name' => 'Amit Verma', 'username' => 'amit', 'email' => 'amit@trickuweb.com', 'dept' => 'Engineering', 'designation' => 'DevOps Engineer', 'type' => 'Employee', 'grade' => 3, 'manager_id' => 2],
            ['name' => 'Sneha Patel', 'username' => 'sneha', 'email' => 'sneha@trickuweb.com', 'dept' => 'Engineering', 'designation' => 'UI/UX Designer', 'type' => 'Employee', 'grade' => 2, 'manager_id' => 2],
            ['name' => 'Ravi Agarwal', 'username' => 'ravi', 'email' => 'ravi@trickuweb.com', 'dept' => 'Engineering', 'designation' => 'Tech Lead', 'type' => 'Manager', 'grade' => 4, 'manager_id' => 1],
            ['name' => 'Nisha Jain', 'username' => 'nisha', 'email' => 'nisha@trickuweb.com', 'dept' => 'Engineering', 'designation' => 'Mobile Developer', 'type' => 'Employee', 'grade' => 2, 'manager_id' => 2],
            ['name' => 'Suresh Reddy', 'username' => 'suresh', 'email' => 'suresh@trickuweb.com', 'dept' => 'Engineering', 'designation' => 'Database Admin', 'type' => 'Employee', 'grade' => 3, 'manager_id' => 2],
            ['name' => 'Kavita Rao', 'username' => 'kavita', 'email' => 'kavita@trickuweb.com', 'dept' => 'Engineering', 'designation' => 'Junior Developer', 'type' => 'Employee', 'grade' => 1, 'manager_id' => 2],

            // Sales Team (5 employees)
            ['name' => 'Rajesh Khanna', 'username' => 'rajesh', 'email' => 'rajesh@trickuweb.com', 'dept' => 'Sales', 'designation' => 'Sales Manager', 'type' => 'Manager', 'grade' => 4, 'manager_id' => 1],
            ['name' => 'Sunita Devi', 'username' => 'sunita', 'email' => 'sunita@trickuweb.com', 'dept' => 'Sales', 'designation' => 'Sales Executive', 'type' => 'Employee', 'grade' => 2, 'manager_id' => 11],
            ['name' => 'Manoj Tiwari', 'username' => 'manoj', 'email' => 'manoj@trickuweb.com', 'dept' => 'Sales', 'designation' => 'Business Development', 'type' => 'Employee', 'grade' => 3, 'manager_id' => 11],
            ['name' => 'Deepika Sharma', 'username' => 'deepika', 'email' => 'deepika@trickuweb.com', 'dept' => 'Sales', 'designation' => 'Account Manager', 'type' => 'Employee', 'grade' => 3, 'manager_id' => 11],
            ['name' => 'Arjun Singh', 'username' => 'arjun', 'email' => 'arjun@trickuweb.com', 'dept' => 'Sales', 'designation' => 'Sales Associate', 'type' => 'Employee', 'grade' => 1, 'manager_id' => 11],

            // Marketing Team (3 employees)
            ['name' => 'Shreya Iyer', 'username' => 'shreya', 'email' => 'shreya@trickuweb.com', 'dept' => 'Marketing', 'designation' => 'Marketing Manager', 'type' => 'Manager', 'grade' => 4, 'manager_id' => 1],
            ['name' => 'Rohit Mehta', 'username' => 'rohit', 'email' => 'rohit@trickuweb.com', 'dept' => 'Marketing', 'designation' => 'Digital Marketing Specialist', 'type' => 'Employee', 'grade' => 2, 'manager_id' => 16],
            ['name' => 'Priya Nair', 'username' => 'priya', 'email' => 'priya@trickuweb.com', 'dept' => 'Marketing', 'designation' => 'Content Writer', 'type' => 'Employee', 'grade' => 2, 'manager_id' => 16],

            // HR Team (2 employees)
            ['name' => 'Kiran Desai', 'username' => 'kiran', 'email' => 'kiran@trickuweb.com', 'dept' => 'Human Resources', 'designation' => 'HR Executive', 'type' => 'Employee', 'grade' => 2, 'manager_id' => 2],
            ['name' => 'Mohan Prasad', 'username' => 'mohan', 'email' => 'mohan@trickuweb.com', 'dept' => 'Human Resources', 'designation' => 'Recruiter', 'type' => 'Employee', 'grade' => 2, 'manager_id' => 2],

            // Administration Team (2 employees)
            ['name' => 'Sanjay Gupta', 'username' => 'sanjay', 'email' => 'sanjay@trickuweb.com', 'dept' => 'Administration', 'designation' => 'Office Manager', 'type' => 'Employee', 'grade' => 3, 'manager_id' => 1],
            ['name' => 'Meera Joshi', 'username' => 'meera', 'email' => 'meera@trickuweb.com', 'dept' => 'Administration', 'designation' => 'Admin Assistant', 'type' => 'Employee', 'grade' => 1, 'manager_id' => 21],
        ];

        $empNumber = 4; // Starting from EMP004 (after the 3 default + 3 generic users will be EMP901-903)

        foreach ($employeesData as $empData) {
            // Create User
            User::create([
                'username' => $empData['username'],
                'hashed_password' => bcrypt('password123'), // Default password for all additional employees
                'is_active' => true,
            ]);

            // Get department and pay grade
            $department = $departments->where('department_name', $empData['dept'])->first();
            $payGrade = $payGrades->where('grade', $empData['grade'])->first();
            
            // Calculate salary based on pay grade
            $baseSalary = rand($payGrade->min_gross_range, $payGrade->max_gross_range);
            $ctc = $baseSalary * 1.2; // 20% additional for benefits

            // Create Employee
            Employee::create([
                'username' => $empData['username'],
                'emp_name' => $empData['name'],
                'company_name_id' => $company->id,
                'branch_name_id' => $branch->id,
                'emp_email' => $empData['email'],
                'emp_phone' => '+91 ' . rand(7000000000, 9999999999),
                'emp_no' => 'EMP' . str_pad($empNumber, 3, '0', STR_PAD_LEFT),
                'joining_date' => fake()->dateTimeBetween('-2 years', 'now')->format('Y-m-d'),
                'department_id' => $department->id,
                'designation' => $empData['designation'],
                'emp_type' => $empData['type'],
                'job_type' => 'Permanent',
                'emp_status' => 'Working',
                'pay_grade_id' => $payGrade->id,
                'gross_salary' => $baseSalary,
                'ctc' => $ctc,
                'gender' => fake()->randomElement(['Male', 'Female']),
                'work_mode' => fake()->randomElement(['Office', 'Field']),
                'manager_id' => $empData['manager_id'],
            ]);

            $empNumber++;
        }
    }
}
