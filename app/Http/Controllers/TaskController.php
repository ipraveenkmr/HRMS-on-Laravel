<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AssignedJob;
use App\Models\DailyTask;
use App\Models\Employee;
use Illuminate\Http\JsonResponse;

class TaskController extends Controller
{
    // Standard CRUD Methods (Required by Routes)
    public function index(): JsonResponse
    {
        return $this->indexTasks();
    }

    public function show($task_id): JsonResponse
    {
        return $this->showTask($task_id);
    }

    public function store(Request $request): JsonResponse
    {
        return $this->storeTask($request);
    }

    public function update(Request $request, $task_id): JsonResponse
    {
        return $this->updateTask($request, $task_id);
    }

    public function destroy($task_id): JsonResponse
    {
        return $this->destroyTask($task_id);
    }

    // Assigned Jobs (Tasks)
    public function indexTasks(): JsonResponse
    {
        $tasks = AssignedJob::with(['employee', 'department'])
            ->orderBy('created_at')
            ->get();
        
        return response()->json($tasks);
    }

    public function showTask($id): JsonResponse
    {
        $task = AssignedJob::with(['employee', 'department'])->find($id);
        
        if (!$task) {
            return response()->json(['error' => 'Task not found'], 404);
        }
        
        return response()->json($task);
    }

    public function storeTask(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'task' => 'nullable|string',
            'username' => 'nullable|string|max:200',
            'employee_id' => 'required|exists:employees,id',
            'department_id' => 'required|exists:departments,id',
            'manager' => 'nullable|string|max:200',
            'task_time' => 'nullable|string|max:99',
            'comment' => 'nullable|string|max:99',
            'submission_date' => 'nullable|string|max:99',
            'status' => 'nullable|string|max:99',
            'document' => 'nullable|string|max:200',
            'description' => 'nullable|string',
        ]);

        $task = AssignedJob::create($validated);
        
        return response()->json([
            'message' => 'Task created successfully',
            'task' => $task->load(['employee', 'department'])
        ], 201);
    }

    public function updateTask(Request $request, $id): JsonResponse
    {
        $task = AssignedJob::find($id);
        
        if (!$task) {
            return response()->json(['error' => 'Task not found'], 404);
        }

        $validated = $request->validate([
            'task' => 'nullable|string',
            'username' => 'nullable|string|max:200',
            'employee_id' => 'sometimes|exists:employees,id',
            'department_id' => 'sometimes|exists:departments,id',
            'manager' => 'nullable|string|max:200',
            'task_time' => 'nullable|string|max:99',
            'comment' => 'nullable|string|max:99',
            'submission_date' => 'nullable|string|max:99',
            'status' => 'nullable|string|max:99',
            'document' => 'nullable|string|max:200',
            'description' => 'nullable|string',
        ]);

        $task->update($validated);
        
        return response()->json([
            'message' => 'Task updated successfully',
            'task' => $task->load(['employee', 'department'])
        ]);
    }

    public function destroyTask($id): JsonResponse
    {
        $task = AssignedJob::find($id);
        
        if (!$task) {
            return response()->json(['error' => 'Task not found'], 404);
        }
        
        $task->delete();
        
        return response()->json(['message' => 'Task deleted successfully']);
    }

    public function getEmployeeTasks($employeeId): JsonResponse
    {
        $tasks = AssignedJob::with(['department'])
            ->where('employee_id', $employeeId)
            ->orderBy('created_at')
            ->get();
        
        return response()->json($tasks);
    }

    public function getTasksByDepartment($departmentId): JsonResponse
    {
        $tasks = AssignedJob::with(['employee'])
            ->where('department_id', $departmentId)
            ->orderBy('created_at')
            ->get();
        
        return response()->json($tasks);
    }

    // Daily Tasks
    public function indexDailyTasks(): JsonResponse
    {
        $dailyTasks = DailyTask::with(['employee', 'department'])
            ->orderBy('created_at')
            ->get();
        
        return response()->json($dailyTasks);
    }

    public function showDailyTask($id): JsonResponse
    {
        $dailyTask = DailyTask::with(['employee', 'department'])->find($id);
        
        if (!$dailyTask) {
            return response()->json(['error' => 'Daily task not found'], 404);
        }
        
        return response()->json($dailyTask);
    }

    public function storeDailyTask(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'task' => 'nullable|string',
            'username' => 'nullable|string|max:200',
            'employee_id' => 'required|exists:employees,id',
            'department_id' => 'required|exists:departments,id',
            'manager' => 'nullable|string|max:200',
            'submission_date' => 'nullable|string|max:99',
            'document' => 'nullable|string|max:200',
            'description' => 'nullable|string',
        ]);

        $dailyTask = DailyTask::create($validated);
        
        return response()->json([
            'message' => 'Daily task created successfully',
            'daily_task' => $dailyTask->load(['employee', 'department'])
        ], 201);
    }

    public function updateDailyTask(Request $request, $id): JsonResponse
    {
        $dailyTask = DailyTask::find($id);
        
        if (!$dailyTask) {
            return response()->json(['error' => 'Daily task not found'], 404);
        }

        $validated = $request->validate([
            'task' => 'nullable|string',
            'username' => 'nullable|string|max:200',
            'employee_id' => 'sometimes|exists:employees,id',
            'department_id' => 'sometimes|exists:departments,id',
            'manager' => 'nullable|string|max:200',
            'submission_date' => 'nullable|string|max:99',
            'document' => 'nullable|string|max:200',
            'description' => 'nullable|string',
        ]);

        $dailyTask->update($validated);
        
        return response()->json([
            'message' => 'Daily task updated successfully',
            'daily_task' => $dailyTask->load(['employee', 'department'])
        ]);
    }

    public function destroyDailyTask($id): JsonResponse
    {
        $dailyTask = DailyTask::find($id);
        
        if (!$dailyTask) {
            return response()->json(['error' => 'Daily task not found'], 404);
        }
        
        $dailyTask->delete();
        
        return response()->json(['message' => 'Daily task deleted successfully']);
    }

    public function getEmployeeDailyTasks($employeeId): JsonResponse
    {
        $dailyTasks = DailyTask::with(['department'])
            ->where('employee_id', $employeeId)
            ->orderBy('created_at')
            ->get();
        
        return response()->json($dailyTasks);
    }

    public function getDailyTasksByDepartment($departmentId): JsonResponse
    {
        $dailyTasks = DailyTask::with(['employee'])
            ->where('department_id', $departmentId)
            ->orderBy('created_at')
            ->get();
        
        return response()->json($dailyTasks);
    }

    // Missing Manager Methods
    public function getTasksByManager($manager_id): JsonResponse
    {
        // Get employees under this manager
        $employeeIds = Employee::where('manager_id', $manager_id)->pluck('id');
        
        $tasks = AssignedJob::with(['employee', 'department'])
            ->whereIn('employee_id', $employeeIds)
            ->orderBy('created_at')
            ->get();
        
        return response()->json($tasks);
    }

    public function getDailyTasksByManager($manager_id): JsonResponse
    {
        // Get employees under this manager
        $employeeIds = Employee::where('manager_id', $manager_id)->pluck('id');
        
        $dailyTasks = DailyTask::with(['employee', 'department'])
            ->whereIn('employee_id', $employeeIds)
            ->orderBy('created_at')
            ->get();
        
        return response()->json($dailyTasks);
    }
}