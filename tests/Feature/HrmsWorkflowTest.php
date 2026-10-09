<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class HrmsWorkflowTest extends TestCase
{
    use RefreshDatabase;

    private function employee(string $username = 'alice', string $empType = 'Employee'): array
    {
        $company = DB::table('company_details')->value('id') ?? DB::table('company_details')->insertGetId(['company_name' => 'Example ' . uniqid()]);
        $branch = DB::table('branch_details')->value('id') ?? DB::table('branch_details')->insertGetId([
            'company_name_id' => $company, 'branch_name' => 'Main ' . uniqid(), 'longitude' => '0', 'latitude' => '0',
        ]);
        $department = DB::table('departments')->value('id') ?? DB::table('departments')->insertGetId(['department_name' => 'Operations ' . uniqid()]);
        $grade = DB::table('pay_grades')->value('id') ?? DB::table('pay_grades')->insertGetId(['grade' => 1]);
        $year = DB::table('financial_years')->value('id') ?? DB::table('financial_years')->insertGetId(['year' => '2026-2027']);
        $id = DB::table('employees')->insertGetId([
            'username' => $username, 'emp_name' => ucfirst($username), 'company_name_id' => $company,
            'branch_name_id' => $branch, 'department_id' => $department, 'pay_grade_id' => $grade,
            'emp_type' => $empType,
        ]);
        $user = User::create(['username' => $username, 'hashed_password' => bcrypt('password'), 'is_active' => true]);
        Sanctum::actingAs($user);
        return compact('id', 'department', 'year');
    }

    public function test_punch_out_updates_the_existing_row_and_duplicate_actions_are_rejected(): void
    {
        $this->travelTo(now()->setDate(2026, 10, 6)->setTime(9, 0));
        $employee = $this->employee();
        $this->postJson('/api/attendance/punch', ['action' => 'in'])->assertOk()->assertJsonPath('employee_id', $employee['id']);
        $this->postJson('/api/attendance/punch', ['action' => 'in'])->assertStatus(409);
        $this->travel(8)->hours();
        $this->postJson('/api/attendance/punch', ['action' => 'out'])->assertOk()->assertJsonPath('logout_at', '17:00');
        $this->postJson('/api/attendance/punch', ['action' => 'out'])->assertStatus(409);
        $this->assertDatabaseCount('attendance_records', 1);
    }

    public function test_pending_leave_can_be_edited_but_overlapping_dates_are_rejected(): void
    {
        $this->travelTo(now()->setDate(2026, 10, 6));
        $employee = $this->employee();
        DB::table('leaves')->insert(['financial_year_id' => $employee['year'], 'cl_days' => 10]);
        $payload = [
            'employee_id' => $employee['id'], 'department_id' => $employee['department'],
            'leave_type' => 'Casual Leave', 'leave_reason' => 'Family event',
            'leave_from_date' => '2026-10-10', 'leave_to_date' => '2026-10-11',
        ];
        $created = $this->postJson('/api/leave', $payload)->assertCreated()->json('leave.id');
        $this->postJson('/api/leave', array_merge($payload, ['leave_from_date' => '2026-10-11']))->assertStatus(422);
        $this->putJson('/api/leave/'.$created, ['leave_from_date' => '2026-10-12', 'leave_to_date' => '2026-10-13'])
            ->assertOk()->assertJsonPath('leave.cl_days', fn ($val) => (float) $val === 2.0);
        $this->postJson('/api/leave', array_merge($payload, ['leave_from_date' => '2026-10-10', 'leave_to_date' => '2026-10-11']))
            ->assertCreated();
    }

    public function test_task_filters_and_report_use_the_same_employee_scope(): void
    {
        $this->travelTo(now()->setDate(2026, 10, 6));
        $employee = $this->employee();
        $payload = ['employee_id' => $employee['id'], 'department_id' => $employee['department'],
            'task' => 'Prepare report', 'submission_date' => '2026-10-06', 'status' => 'Completed'];
        $this->postJson('/api/daily-tasks', $payload)->assertCreated();
        $this->getJson('/api/daily-tasks?status=Completed&from=2026-10-06&to=2026-10-06')
            ->assertOk()->assertJsonCount(1);
        $this->getJson('/api/daily-tasks?status=Pending')->assertOk()->assertJsonCount(0);
        $response = $this->get('/api/daily-tasks/report/download?period=weekly&date=2026-10-06&format=csv');
        $response->assertOk();
        $this->assertStringContainsString('Prepare report', $response->streamedContent());
    }

    public function test_recent_records_returned_in_descending_order(): void
    {
        $this->travelTo(now()->setDate(2026, 10, 6));
        $employee = $this->employee();

        // 1. Tasks
        $task1 = DB::table('assigned_jobs')->insertGetId([
            'employee_id' => $employee['id'],
            'department_id' => $employee['department'],
            'task' => 'First Task',
            'created_at' => '2026-10-06 09:00:00',
            'updated_at' => '2026-10-06 09:00:00',
        ]);
        $task2 = DB::table('assigned_jobs')->insertGetId([
            'employee_id' => $employee['id'],
            'department_id' => $employee['department'],
            'task' => 'Second Task',
            'created_at' => '2026-10-06 10:00:00',
            'updated_at' => '2026-10-06 10:00:00',
        ]);
        $tasksRes = $this->getJson('/api/tasks')->assertOk()->json();
        $this->assertEquals($task2, $tasksRes[0]['id']);
        $this->assertEquals($task1, $tasksRes[1]['id']);

        // 2. Leaves
        DB::table('leaves')->insert(['financial_year_id' => $employee['year'], 'cl_days' => 10]);
        $leave1 = $this->postJson('/api/leave', [
            'employee_id' => $employee['id'], 'department_id' => $employee['department'],
            'leave_type' => 'Casual Leave', 'leave_reason' => 'Leave 1',
            'leave_from_date' => '2026-10-10', 'leave_to_date' => '2026-10-10',
        ])->assertCreated()->json('leave.id');
        $this->travel(1)->hours();
        $leave2 = $this->postJson('/api/leave', [
            'employee_id' => $employee['id'], 'department_id' => $employee['department'],
            'leave_type' => 'Casual Leave', 'leave_reason' => 'Leave 2',
            'leave_from_date' => '2026-10-12', 'leave_to_date' => '2026-10-12',
        ])->assertCreated()->json('leave.id');
        $leavesRes = $this->getJson('/api/leave')->assertOk()->json();
        $this->assertEquals($leave2, $leavesRes[0]['id']);
        $this->assertEquals($leave1, $leavesRes[1]['id']);

        // 3. Attendance
        $att1 = DB::table('attendance_records')->insertGetId([
            'employee_id' => $employee['id'],
            'department_id' => $employee['department'],
            'financial_year_id' => $employee['year'],
            'attendance_date' => '2026-10-01',
            'username' => 'alice',
            'attendance' => 'Present',
            'created_at' => '2026-10-01 09:00:00',
            'updated_at' => '2026-10-01 09:00:00',
        ]);
        $att2 = DB::table('attendance_records')->insertGetId([
            'employee_id' => $employee['id'],
            'department_id' => $employee['department'],
            'financial_year_id' => $employee['year'],
            'attendance_date' => '2026-10-02',
            'username' => 'alice',
            'attendance' => 'Present',
            'created_at' => '2026-10-02 09:00:00',
            'updated_at' => '2026-10-02 09:00:00',
        ]);
        $attRes = $this->getJson('/api/attendance')->assertOk()->json();
        $this->assertEquals($att2, $attRes[0]['id']);
        $this->assertEquals($att1, $attRes[1]['id']);
    }

    public function test_login_error_messages_for_invalid_username_and_password(): void
    {
        $this->employee('valid_user');

        // Incorrect username
        $this->postJson('/api/auth/token', [
            'username' => 'wrong_user',
            'password' => '12345678',
        ])->assertStatus(401)
          ->assertJsonPath('detail', 'You are trying incorrect username contact to admin');

        // Incorrect password
        $this->postJson('/api/auth/token', [
            'username' => 'valid_user',
            'password' => 'wrong_password',
        ])->assertStatus(401)
          ->assertJsonPath('detail', 'Please enter correct password');
    }

    public function test_leave_approval_deducts_leave_balance(): void
    {
        $employee = $this->employee('emma_emp');
        DB::table('leave_calculators')->insert([
            'financial_year_id' => $employee['year'],
            'username' => 'emma_emp',
            'employee_id' => $employee['id'],
            'remaining_cl_days' => 11,
            'remaining_cl_hours' => 88,
        ]);

        $leaveId = $this->postJson('/api/leave', [
            'employee_id' => $employee['id'],
            'department_id' => $employee['department'],
            'leave_type' => 'Casual Leave',
            'leave_reason' => 'Need 1 day casual leave',
            'leave_from_date' => '2026-10-20',
            'leave_to_date' => '2026-10-20',
        ])->assertCreated()->json('leave.id');

        // Admin approves the leave
        $admin = $this->employee('admin_user', 'Admin');
        $this->putJson("/api/leave/{$leaveId}", [
            'leave_status' => 'Approved',
        ])->assertOk();

        // Verify balance decreased from 11 to 10
        $calcRes = $this->getJson('/api/leave/calculator/username/emma_emp')->assertOk()->json();
        $this->assertEquals(10, $calcRes[0]['remaining_cl_days']);
    }
}
