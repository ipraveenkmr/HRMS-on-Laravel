<?php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== VERIFICATION OF ALL USERS (INCLUDING GENERIC ROLES) ===\n\n";

echo "Total Users: " . \App\Models\User::count() . "\n";
echo "Total Employees: " . \App\Models\Employee::count() . "\n\n";

echo "=== SPECIFIC USERS (Original Request) ===\n";
$specificUsers = \App\Models\User::whereIn('username', ['praveen', 'priyanka', 'nitin'])
    ->with('employee')
    ->get();

foreach($specificUsers as $user) {
    $emp = $user->employee;
    echo "- Username: {$user->username}\n";
    echo "  Employee: {$emp->emp_name} ({$emp->emp_type}) - {$emp->designation}\n";
    echo "  Created: {$user->created_at}\n\n";
}

echo "=== GENERIC ROLE-BASED USERS (New Request) ===\n";
$roleUsers = \App\Models\User::whereIn('username', ['admin', 'manager', 'employee'])
    ->with('employee')
    ->get();

foreach($roleUsers as $user) {
    $emp = $user->employee;
    echo "- Username: {$user->username}\n";
    echo "  Employee: {$emp->emp_name} ({$emp->emp_type}) - {$emp->designation}\n";
    echo "  Employee Number: {$emp->emp_no}\n";
    echo "  Password: " . ($user->username == 'admin' ? 'Admin@123' : 
                         ($user->username == 'manager' ? 'Manager@123' : 'Employee@123')) . "\n\n";
}

echo "=== EMPLOYEE DISTRIBUTION ===\n";
echo "By Type:\n";
$empTypes = \App\Models\Employee::select('emp_type')
    ->selectRaw('count(*) as count')
    ->groupBy('emp_type')
    ->get();
foreach($empTypes as $type) {
    echo "- {$type->emp_type}: {$type->count}\n";
}

echo "\nBy Department:\n";
$departments = \App\Models\Department::withCount('employees')->get();
foreach($departments as $dept) {
    echo "- {$dept->department_name}: {$dept->employees_count}\n";
}

echo "\n=== EMPLOYEE NUMBERS ===\n";
echo "Special Numbers (9xx series): " . \App\Models\Employee::where('emp_no', 'LIKE', 'EMP9%')->count() . "\n";
echo "Regular Numbers (001-025): " . \App\Models\Employee::where('emp_no', 'LIKE', 'EMP0%')->count() . "\n";

echo "\nSample Employee Numbers:\n";
$samples = \App\Models\Employee::select('emp_no', 'emp_name', 'emp_type')
    ->orderBy('emp_no')
    ->limit(10)
    ->get();
foreach($samples as $emp) {
    echo "- {$emp->emp_no}: {$emp->emp_name} ({$emp->emp_type})\n";
}