<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payslips', function (Blueprint $table) {
            $table->id();
            $table->string('month_year', 99)->unique();
            $table->string('username', 200)->nullable();
            $table->foreignId('employee_id')->constrained()->onDelete('cascade');
            $table->foreignId('department_id')->constrained()->onDelete('cascade');
            $table->string('date', 99)->nullable();
            
            // Earnings
            $table->decimal('basic', 15, 2)->default(0);
            $table->decimal('hra', 15, 2)->default(0);
            $table->decimal('ta', 15, 2)->default(0);
            $table->decimal('com', 15, 2)->default(0);
            $table->decimal('medical', 15, 2)->default(0);
            $table->decimal('edu', 15, 2)->default(0);
            $table->decimal('sa', 15, 2)->default(0);
            
            // Deductions
            $table->decimal('pf', 15, 2)->nullable();
            $table->decimal('esi', 15, 2)->nullable();
            $table->decimal('income_tax', 15, 2)->default(0);
            $table->decimal('cl_taken', 15, 2)->default(0);
            $table->decimal('ei_taken', 15, 2)->default(0);
            $table->decimal('lwp_taken', 15, 2)->default(0);
            
            // Reimbursements
            $table->decimal('advance_pay', 15, 2)->nullable()->default(0);
            $table->decimal('leave_travel_allowance', 15, 2)->nullable()->default(0);
            $table->decimal('telephone_expense', 15, 2)->nullable()->default(0);
            $table->decimal('fuel_and_maint_two_wheeler', 15, 2)->nullable()->default(0);
            $table->decimal('fuel_and_maint_four_wheeler', 15, 2)->nullable()->default(0);
            $table->decimal('other_expense', 15, 2)->nullable()->default(0);
            
            // Summary
            $table->integer('paid_days')->nullable()->default(0);
            $table->integer('total_days')->nullable()->default(0);
            $table->decimal('total_earning', 15, 2)->nullable()->default(0);
            $table->decimal('total_deduction', 15, 2)->nullable()->default(0);
            $table->decimal('total_reimbursement', 15, 2)->nullable()->default(0);
            $table->decimal('net_current_salary', 15, 2)->nullable()->default(0);
            $table->string('salary_status', 99)->nullable();
            $table->string('esi_number', 200)->nullable();
            $table->string('uan_number', 200)->nullable();
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payslips');
    }
};