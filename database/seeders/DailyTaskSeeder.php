<?php

namespace Database\Seeders;

use App\Models\DailyTask;
use App\Models\Employee;
use App\Models\Department;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class DailyTaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $employees = Employee::where('emp_status', 'Working')->get();
        
        if ($employees->isEmpty()) {
            $this->command->error('No employees found. Please run DatabaseSeeder first.');
            return;
        }

        $this->command->info('Creating daily tasks...');

        $dailyTaskTemplates = [
            'Engineering' => [
                'Daily code development',
                'Bug investigation and fixes',
                'Code review activities',
                'Technical documentation',
                'Team stand-up meeting',
                'Testing and QA activities',
                'Research and learning',
                'Database maintenance',
                'System monitoring',
                'Client support activities'
            ],
            'Human Resources' => [
                'Employee queries resolution',
                'Recruitment activities',
                'Policy updates and reviews',
                'Training coordination',
                'Employee engagement activities',
                'Performance tracking',
                'Compliance monitoring',
                'Benefits administration',
                'Documentation updates',
                'Team coordination meetings'
            ],
            'Sales' => [
                'Client calls and meetings',
                'Lead generation activities',
                'Proposal preparation',
                'CRM updates',
                'Market research',
                'Sales reporting',
                'Customer follow-ups',
                'Territory planning',
                'Product presentations',
                'Sales strategy meetings'
            ],
            'Marketing' => [
                'Content creation',
                'Social media management',
                'Campaign monitoring',
                'Market analysis',
                'Brand management activities',
                'Website content updates',
                'Email marketing',
                'Event coordination',
                'Competitor analysis',
                'Creative development'
            ],
            'Administration' => [
                'Office coordination',
                'Vendor management',
                'Budget tracking',
                'Facilities management',
                'Documentation management',
                'Meeting coordination',
                'Inventory management',
                'Process improvement',
                'Compliance activities',
                'Administrative support'
            ]
        ];

        $taskCounter = 0;

        // Create daily tasks for last 15 days
        for ($day = 14; $day >= 0; $day--) {
            $date = Carbon::now()->subDays($day);
            
            // Skip weekends
            if ($date->isWeekend()) {
                continue;
            }

            foreach ($employees as $employee) {
                // 80% chance of having daily task entry
                if (rand(1, 100) <= 80) {
                    $department = Department::find($employee->department_id);
                    $departmentName = $department ? $department->department_name : 'Engineering';
                    
                    $availableTasks = $dailyTaskTemplates[$departmentName] ?? $dailyTaskTemplates['Engineering'];
                    
                    // Pick 1-3 random tasks for the day
                    $numTasks = rand(1, 3);
                    $selectedTasks = array_rand(array_flip($availableTasks), $numTasks);
                    
                    if (!is_array($selectedTasks)) {
                        $selectedTasks = [$selectedTasks];
                    }
                    
                    $taskDescription = implode(', ', $selectedTasks);
                    
                    DailyTask::create([
                        'task' => $this->getMainTask($selectedTasks[0]),
                        'username' => $employee->username,
                        'employee_id' => $employee->id,
                        'department_id' => $employee->department_id,
                        'manager' => $this->getManagerName($employee),
                        'submission_date' => $date->format('Y-m-d'),
                        'document' => null,
                        'description' => $this->getDetailedDescription($taskDescription, $departmentName),
                        'created_at' => $date,
                        'updated_at' => $date
                    ]);
                    
                    $taskCounter++;
                }
            }
        }

        $this->command->info("Created {$taskCounter} daily tasks successfully!");
    }

    private function getManagerName($employee)
    {
        if ($employee->manager_id) {
            $manager = Employee::find($employee->manager_id);
            return $manager ? $manager->emp_name : 'System Manager';
        }
        return 'System Manager';
    }

    private function getMainTask($taskName)
    {
        // Simplify task name for the main task field
        $simplifications = [
            'Daily code development' => 'Development Work',
            'Employee queries resolution' => 'Employee Support',
            'Client calls and meetings' => 'Client Management',
            'Content creation' => 'Content Work',
            'Office coordination' => 'Administrative Work'
        ];

        return $simplifications[$taskName] ?? $taskName;
    }

    private function getDetailedDescription($tasks, $department)
    {
        $descriptions = [
            'Engineering' => [
                'Worked on development tasks including: ' . $tasks . '. Focused on maintaining code quality and meeting project deadlines.',
                'Completed technical activities: ' . $tasks . '. Collaborated with team members and addressed technical challenges.',
                'Daily engineering tasks: ' . $tasks . '. Ensured adherence to development standards and best practices.'
            ],
            'Human Resources' => [
                'HR activities completed: ' . $tasks . '. Focused on employee satisfaction and organizational development.',
                'Human resources tasks: ' . $tasks . '. Maintained compliance and supported team members.',
                'Daily HR operations: ' . $tasks . '. Ensured smooth HR processes and employee engagement.'
            ],
            'Sales' => [
                'Sales activities: ' . $tasks . '. Focused on revenue generation and client relationship building.',
                'Business development tasks: ' . $tasks . '. Worked on expanding market presence and customer base.',
                'Daily sales operations: ' . $tasks . '. Maintained client relationships and pursued new opportunities.'
            ],
            'Marketing' => [
                'Marketing initiatives: ' . $tasks . '. Focused on brand building and market expansion.',
                'Creative and marketing tasks: ' . $tasks . '. Worked on increasing brand visibility and engagement.',
                'Daily marketing activities: ' . $tasks . '. Developed content and managed marketing campaigns.'
            ],
            'Administration' => [
                'Administrative tasks: ' . $tasks . '. Ensured smooth office operations and organizational efficiency.',
                'Office management activities: ' . $tasks . '. Maintained administrative processes and coordination.',
                'Daily administrative work: ' . $tasks . '. Supported organizational operations and management.'
            ]
        ];

        $deptDescriptions = $descriptions[$department] ?? $descriptions['Engineering'];
        return $deptDescriptions[array_rand($deptDescriptions)];
    }
}