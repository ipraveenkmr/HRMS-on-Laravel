<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AssignedJob;
use App\Models\DailyTask;
use App\Models\Employee;
use Illuminate\Http\JsonResponse;
use App\Support\TaskReportPdf;
use Carbon\Carbon;

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

    public function getEmployeeTasks($username): JsonResponse
    {
        $tasks = AssignedJob::with(['department'])
            ->where('username', $username)
            ->orderByDesc('id')
            ->get();
        
        return response()->json($tasks);
    }

    public function getTasksByDepartment($departmentId): JsonResponse
    {
        $tasks = AssignedJob::with(['employee'])
            ->where('department_id', $departmentId)
            ->orderByDesc('id')
            ->get();
        
        return response()->json($tasks);
    }

    // Daily Tasks
    private function dailyTaskQuery(Request $request)
    {
        $actor = $request->user('sanctum')?->employee ?? $request->user()?->employee;
        if (!$actor && $request->has('username')) {
            $actor = Employee::where('username', $request->input('username'))->first();
        }
        if (!$actor) abort(403, 'Employee profile not found');
        $query = DailyTask::query();
        if ($actor->emp_type === 'Manager') {
            $ids = Employee::where('manager_id', $actor->id)->pluck('id')->push($actor->id);
            $query->whereIn('employee_id', $ids);
        } elseif ($actor->emp_type !== 'Admin') {
            $query->where('employee_id', $actor->id);
        }
        return $query;
    }

    public function indexDailyTasks(Request $request): JsonResponse
    {
        $filters = $request->validate([
            'from' => 'nullable|date_format:Y-m-d',
            'to' => 'nullable|date_format:Y-m-d|after_or_equal:from',
            'status' => 'nullable|in:Pending,In Progress,Completed',
            'employee_id' => 'nullable|integer|exists:employees,id',
            'username' => 'nullable|string|max:200',
        ]);
        $query = $this->dailyTaskQuery($request)->with(['employee', 'department']);
        if (isset($filters['from'])) $query->where('submission_date', '>=', $filters['from']);
        if (isset($filters['to'])) $query->where('submission_date', '<=', $filters['to']);
        if (isset($filters['status'])) $query->where('status', $filters['status']);
        if (isset($filters['employee_id'])) $query->where('employee_id', $filters['employee_id']);
        $dailyTasks = $query->orderByDesc('id')->get();
        
        return response()->json($dailyTasks);
    }

    public function showDailyTask(Request $request, $id): JsonResponse
    {
        $dailyTask = $this->dailyTaskQuery($request)->with(['employee', 'department'])->find($id);
        
        if (!$dailyTask) {
            return response()->json(['error' => 'Daily task not found'], 404);
        }
        
        return response()->json($dailyTask);
    }

    public function storeDailyTask(Request $request): JsonResponse
    {
        $actor = $request->user('sanctum')?->employee ?? $request->user()?->employee;
        if (!$actor && $request->has('username')) {
            $actor = Employee::where('username', $request->input('username'))->first();
        }
        if (!$actor) return response()->json(['detail' => 'Employee profile not found'], 403);

        $validated = $request->validate([
            'task' => 'required|string|max:2000',
            'username' => 'nullable|string|max:200',
            'employee_id' => 'nullable|exists:employees,id',
            'department_id' => 'nullable|exists:departments,id',
            'manager' => 'nullable|string|max:200',
            'submission_date' => 'nullable|date',
            'document' => 'nullable|string|max:200',
            'description' => 'nullable|string|max:10000',
            'status' => 'nullable|in:Pending,In Progress,Completed',
        ]);

        if (isset($validated['employee_id']) && (int) $validated['employee_id'] !== $actor->id) {
            return response()->json(['detail' => 'You can only create your own tasks.'], 403);
        }

        $validated['employee_id'] = $actor->id;
        $validated['username'] = $actor->username;
        $validated['department_id'] = $actor->department_id;
        $validated['submission_date'] = isset($validated['submission_date']) ? Carbon::parse($validated['submission_date'])->toDateString() : now()->toDateString();
        $validated['status'] = $validated['status'] ?? 'Pending';

        $dailyTask = DailyTask::create($validated);
        
        return response()->json([
            'message' => 'Daily task created successfully',
            'daily_task' => $dailyTask->load(['employee', 'department'])
        ], 201);
    }

    public function updateDailyTask(Request $request, $id): JsonResponse
    {
        $dailyTask = $this->dailyTaskQuery($request)->find($id);
        
        if (!$dailyTask) {
            return response()->json(['error' => 'Daily task not found'], 404);
        }

        $validated = $request->validate([
            'task' => 'sometimes|required|string|max:2000',
            'username' => 'nullable|string|max:200',
            'employee_id' => 'sometimes|exists:employees,id',
            'department_id' => 'sometimes|exists:departments,id',
            'manager' => 'nullable|string|max:200',
            'submission_date' => 'nullable|date',
            'document' => 'nullable|string|max:200',
            'description' => 'nullable|string|max:10000',
            'status' => 'nullable|in:Pending,In Progress,Completed',
        ]);

        $actor = $request->user('sanctum')?->employee ?? $request->user()?->employee;
        if (!$actor && $request->has('username')) {
            $actor = Employee::where('username', $request->input('username'))->first();
        }

        if ($dailyTask->employee_id !== $actor?->id && $actor?->emp_type !== 'Admin') {
            return response()->json(['detail' => 'Only the task owner may edit it.'], 403);
        }

        unset($validated['employee_id'], $validated['username'], $validated['department_id']);
        if (isset($validated['submission_date'])) $validated['submission_date'] = Carbon::parse($validated['submission_date'])->toDateString();

        $dailyTask->update($validated);
        
        return response()->json([
            'message' => 'Daily task updated successfully',
            'daily_task' => $dailyTask->load(['employee', 'department'])
        ]);
    }

    public function destroyDailyTask(Request $request, $id): JsonResponse
    {
        $dailyTask = $this->dailyTaskQuery($request)->find($id);
        
        if (!$dailyTask) {
            return response()->json(['error' => 'Daily task not found'], 404);
        }

        $actor = $request->user('sanctum')?->employee ?? $request->user()?->employee;
        if (!$actor && $request->has('username')) {
            $actor = Employee::where('username', $request->input('username'))->first();
        }

        if ($dailyTask->employee_id !== $actor?->id && $actor?->emp_type !== 'Admin') {
            return response()->json(['detail' => 'Only the task owner may delete it.'], 403);
        }
        
        $dailyTask->delete();
        
        return response()->json(['message' => 'Daily task deleted successfully']);
    }

    public function downloadDailyTaskReport(Request $request)
    {
        $data = $request->validate([
            'period' => 'required|in:weekly,monthly',
            'date' => 'required|date_format:Y-m-d',
            'format' => 'required|in:csv,pdf',
            'status' => 'nullable|in:Pending,In Progress,Completed',
            'employee_id' => 'nullable|integer|exists:employees,id',
            'username' => 'nullable|string|max:200',
        ]);
        $date = Carbon::parse($data['date']);
        $from = $data['period'] === 'weekly' ? $date->copy()->startOfWeek() : $date->copy()->startOfMonth();
        $to = $data['period'] === 'weekly' ? $date->copy()->endOfWeek() : $date->copy()->endOfMonth();
        $query = $this->dailyTaskQuery($request)->with('employee')
            ->whereBetween('submission_date', [$from->toDateString(), $to->toDateString()]);
        if (isset($data['status'])) $query->where('status', $data['status']);
        if (isset($data['employee_id'])) $query->where('employee_id', $data['employee_id']);
        $tasks = $query->orderBy('submission_date')->orderBy('id')->get();
        $filename = 'daily-tasks-'.$data['period'].'-'.$from->toDateString().'-'.$to->toDateString().'.'.$data['format'];
        if ($data['format'] === 'csv') {
            return response()->streamDownload(function () use ($tasks) {
                $handle = fopen('php://output', 'w');
                fwrite($handle, "\xEF\xBB\xBF");
                fputcsv($handle, ['Date', 'Employee', 'Task', 'Description', 'Status']);
                foreach ($tasks as $task) {
                    $cells = [$task->submission_date, $task->employee?->emp_name ?? $task->username, $task->task, $task->description, $task->status];
                    fputcsv($handle, array_map(fn ($value) => preg_match('/^\s*[=+@\-]/u', (string) $value) ? "'".$value : $value, $cells));
                }
                fclose($handle);
            }, $filename, ['Content-Type' => 'text/csv; charset=UTF-8']);
        }
        $lines = ['Daily task report', $from->toDateString().' to '.$to->toDateString(), 'Tasks: '.$tasks->count(), 'Generated: '.now()->format('Y-m-d H:i'), ''];
        foreach ($tasks as $task) {
            $lines[] = $task->submission_date.' | '.($task->employee?->emp_name ?? $task->username).' | '.$task->status;
            $lines[] = 'Task: '.$task->task;
            if ($task->description) $lines[] = 'Description: '.$task->description;
            $lines[] = '';
        }
        return response(TaskReportPdf::render($lines), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="'.$filename.'"',
        ]);
    }

    public function getEmployeeDailyTasks(Request $request, $employeeId): JsonResponse
    {
        $dailyTasks = $this->dailyTaskQuery($request)->with(['department'])
            ->where('username', $employeeId)
            ->orderByDesc('id')
            ->get();
        
        return response()->json($dailyTasks);
    }

    public function getDailyTasksByDepartment(Request $request, $departmentId): JsonResponse
    {
        $dailyTasks = $this->dailyTaskQuery($request)->with(['employee'])
            ->where('department_id', $departmentId)
            ->orderByDesc('id')
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

    public function getDailyTasksByManager(Request $request, $manager_id): JsonResponse
    {
        // Get employees under this manager
        $employeeIds = Employee::where('manager_id', $manager_id)->pluck('id');
        
        $dailyTasks = $this->dailyTaskQuery($request)->with(['employee', 'department'])
            ->whereIn('employee_id', $employeeIds)
            ->orderBy('created_at')
            ->get();
        
        return response()->json($dailyTasks);
    }
}
