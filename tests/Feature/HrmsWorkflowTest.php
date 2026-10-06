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

    private function employee(string $username = 'alice'): array
    {
        $company = DB::table('company_details')->insertGetId(['company_name' => 'Example']);
        $branch = DB::table('branch_details')->insertGetId([
            'company_name_id' => $company, 'branch_name' => 'Main', 'longitude' => '0', 'latitude' => '0',
        ]);
        $department = DB::table('departments')->insertGetId(['department_name' => 'Operations']);
        $grade = DB::table('pay_grades')->insertGetId(['grade' => 1]);
        $year = DB::table('financial_years')->insertGetId(['year' => '2026-2027']);
        $id = DB::table('employees')->insertGetId([
            'username' => $username, 'emp_name' => 'Alice', 'company_name_id' => $company,
            'branch_name_id' => $branch, 'department_id' => $department, 'pay_grade_id' => $grade,
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
            ->assertOk()->assertJsonPath('leave.cl_days', 2.0);
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
}
