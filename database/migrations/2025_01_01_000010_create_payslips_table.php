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
            $table->bigInteger('basic')->default(0);
            $table->bigInteger('hra')->default(0);
            $table->bigInteger('ta')->default(0);
            $table->bigInteger('com')->default(0);
            $table->bigInteger('medical')->default(0);
            $table->bigInteger('edu')->default(0);
            $table->bigInteger('sa')->default(0);
            
            // Deductions
            $table->bigInteger('pf')->nullable();
            $table->bigInteger('esi')->nullable();
            $table->bigInteger('income_tax')->default(0);
            $table->bigInteger('cl_taken')->default(0);
            $table->bigInteger('ei_taken')->default(0);
            $table->bigInteger('lwp_taken')->default(0);
            
            // Reimbursements
            $table->bigInteger('advance_pay')->nullable()->default(0);
            $table->bigInteger('leave_travel_allowance')->nullable()->default(0);
            $table->bigInteger('telephone_expense')->nullable()->default(0);
            $table->bigInteger('fuel_and_maint_two_wheeler')->nullable()->default(0);
            $table->bigInteger('fuel_and_maint_four_wheeler')->nullable()->default(0);
            $table->bigInteger('other_expense')->nullable()->default(0);
            
            // Summary
            $table->integer('paid_days')->nullable()->default(0);
            $table->integer('total_days')->nullable()->default(0);
            $table->bigInteger('total_earning')->nullable()->default(0);
            $table->bigInteger('total_deduction')->nullable()->default(0);
            $table->bigInteger('total_reimbursement')->nullable()->default(0);
            $table->bigInteger('net_current_salary')->nullable()->default(0);
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