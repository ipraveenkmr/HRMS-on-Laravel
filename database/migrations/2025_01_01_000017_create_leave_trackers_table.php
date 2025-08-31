<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('leave_trackers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('financial_year_id')->constrained()->onDelete('cascade');
            $table->string('username', 200)->nullable();
            $table->foreignId('employee_id')->constrained()->onDelete('cascade');
            $table->foreignId('department_id')->constrained()->onDelete('cascade');
            $table->float('cl_days')->default(0);
            $table->float('cl_hours')->default(0);
            $table->float('ei_days')->default(0);
            $table->float('ei_hours')->default(0);
            $table->float('lwp_days')->default(0);
            $table->float('lwp_hours')->default(0);
            $table->float('medical_leave_in_days')->default(0);
            $table->float('medical_leave_in_hours')->default(0);
            $table->float('other_leave_in_days')->default(0);
            $table->float('other_leave_in_hours')->default(0);
            $table->string('leave_status', 99)->nullable()->default('Pending');
            $table->string('leave_reason', 99)->nullable();
            $table->string('leave_from_date', 99)->nullable();
            $table->string('leave_from_month', 99)->nullable();
            $table->string('leave_from_year', 99)->nullable();
            $table->string('leave_to_date', 99)->nullable();
            $table->string('leave_to_month', 99)->nullable();
            $table->string('leave_to_year', 99)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('leave_trackers');
    }
};