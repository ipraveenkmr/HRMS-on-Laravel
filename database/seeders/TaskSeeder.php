<?php

namespace Database\Seeders;

use App\Models\AssignedJob;
use App\Models\Employee;
use App\Models\Department;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class TaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $employees = Employee::where('emp_status', 'Working')->get();
        $departments = Department::all();
        
        if ($employees->isEmpty()) {
            $this->command->error('No employees found. Please run DatabaseSeeder first.');
            return;
        }

        $this->command->info('Creating assigned tasks...');

        $taskTemplates = [
            // Engineering Tasks
            'Engineering' => [
                'Code Review for New Feature',
                'Bug Fixing - User Authentication',
                'Database Optimization',
                'API Integration with Third Party',
                'Unit Testing Implementation',
                'Frontend Component Development',
                'Performance Analysis and Improvement',
                'Security Vulnerability Assessment',
                'Documentation Update',
                'DevOps Pipeline Setup'
            ],
            // HR Tasks
            'Human Resources' => [
                'Employee Onboarding Process',
                'Performance Review Preparation',
                'Policy Document Update',
                'Recruitment Interview Coordination',
                'Training Program Organization',
                'Employee Engagement Survey',
                'Compliance Audit Preparation',
                'Benefits Administration',
                'Exit Interview Conduct',
                'HR Analytics Report'
            ],
            // Sales Tasks
            'Sales' => [
                'Client Presentation Preparation',
                'Lead Generation and Qualification',
                'Sales Proposal Creation',
                'Customer Follow-up Calls',
                'Market Research Analysis',
                'CRM Data Update',
                'Sales Target Planning',
                'Product Demo Scheduling',
                'Contract Negotiation',
                'Territory Analysis'
            ],
            // Marketing Tasks
            'Marketing' => [
                'Social Media Campaign Creation',
                'Content Marketing Strategy',
                'Email Marketing Campaign',
                'Brand Guidelines Development',
                'Market Analysis Report',
                'Website Content Update',
                'SEO Optimization',
                'Press Release Writing',
                'Event Planning and Coordination',
                'Competitive Analysis'
            ],
            // Administration Tasks
            'Administration' => [
                'Office Management and Coordination',
                'Vendor Management',
                'Budget Planning and Tracking',
                'Facilities Management',
                'Inventory Management',
                'Administrative Policy Review',
                'Meeting Coordination',
                'Document Management',
                'Compliance Monitoring',
                'Process Improvement Initiative'
            ]
        ];

        $statuses = ['Pending', 'In Progress', 'Completed', 'On Hold'];
        $taskCounter = 0;

        // Create tasks for each employee
        foreach ($employees as $employee) {
            $department = $departments->find($employee->department_id);
            $departmentName = $department ? $department->department_name : 'Engineering';
            
            $availableTasks = $taskTemplates[$departmentName] ?? $taskTemplates['Engineering'];
            
            // Create 2-5 tasks per employee
            $taskCount = rand(2, 5);
            
            for ($i = 0; $i < $taskCount; $i++) {
                $task = $availableTasks[array_rand($availableTasks)];
                $submissionDate = $this->getRandomSubmissionDate();
                $status = $this->getRandomStatus();
                
                AssignedJob::create([
                    'task' => $task,
                    'username' => $employee->username,
                    'employee_id' => $employee->id,
                    'department_id' => $employee->department_id,
                    'manager' => $this->getManagerName($employee),
                    'task_time' => $this->getRandomTaskTime(),
                    'comment' => $this->getRandomComment($status),
                    'submission_date' => $submissionDate,
                    'status' => $status,
                    'document' => null, // File uploads would be handled separately
                    'description' => $this->getTaskDescription($task, $departmentName)
                ]);
                
                $taskCounter++;
            }
        }

        $this->command->info("Created {$taskCounter} assigned tasks successfully!");
    }

    private function getRandomSubmissionDate()
    {
        // Tasks can be from 30 days ago to 30 days in future
        $startDate = Carbon::now()->subDays(30);
        $endDate = Carbon::now()->addDays(30);
        
        return fake()->dateTimeBetween($startDate, $endDate)->format('Y-m-d');
    }

    private function getRandomStatus()
    {
        $statuses = ['Pending', 'In Progress', 'Completed', 'On Hold'];
        $weights = [30, 40, 25, 5]; // Weighted distribution
        
        $rand = rand(1, 100);
        if ($rand <= 30) return 'Pending';
        if ($rand <= 70) return 'In Progress';
        if ($rand <= 95) return 'Completed';
        return 'On Hold';
    }

    private function getRandomTaskTime()
    {
        // Task time in hours (0.5 to 40 hours)
        return rand(5, 400) / 10; // Returns 0.5 to 40.0
    }

    private function getManagerName($employee)
    {
        if ($employee->manager_id) {
            $manager = Employee::find($employee->manager_id);
            return $manager ? $manager->emp_name : 'System Manager';
        }
        return 'System Manager';
    }

    private function getRandomComment($status)
    {
        $comments = [
            'Pending' => [
                'Waiting for requirements clarification',
                'Pending manager approval',
                'Scheduled for next sprint',
                'Awaiting resource allocation'
            ],
            'In Progress' => [
                'Currently working on implementation',
                ' 50% completed, on track',
                'Making good progress',
                'Some challenges but progressing well'
            ],
            'Completed' => [
                'Task completed successfully',
                'Delivered ahead of schedule',
                'All requirements met',
                'Completed with excellent quality'
            ],
            'On Hold' => [
                'Waiting for external dependency',
                'Blocked by higher priority tasks',
                'Pending client feedback',
                'Resource constraints'
            ]
        ];

        $statusComments = $comments[$status] ?? $comments['Pending'];
        return $statusComments[array_rand($statusComments)];
    }

    private function getTaskDescription($task, $department)
    {
        $descriptions = [
            'Code Review for New Feature' => 'Review code implementation for the new user dashboard feature, ensure coding standards compliance and security best practices.',
            'Bug Fixing - User Authentication' => 'Investigate and fix authentication issues reported by users, including session management and password reset functionality.',
            'Database Optimization' => 'Analyze and optimize database queries for improved performance, implement indexing strategies.',
            'Employee Onboarding Process' => 'Coordinate new employee onboarding activities including documentation, system access, and orientation sessions.',
            'Client Presentation Preparation' => 'Prepare comprehensive presentation materials for upcoming client meeting including demos and proposals.',
            'Social Media Campaign Creation' => 'Develop and execute social media marketing campaign for product launch across multiple platforms.',
            'Office Management and Coordination' => 'Oversee daily office operations, coordinate with vendors, and ensure smooth administrative processes.'
        ];

        return $descriptions[$task] ?? "Complete the assigned {$task} task according to {$department} department standards and guidelines.";
    }
}