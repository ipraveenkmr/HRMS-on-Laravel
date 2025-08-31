<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('leave_calculators', function (Blueprint $table) {
            $table->id();
            $table->foreignId('financial_year_id')->constrained()->onDelete('cascade');
            $table->string('username', 200)->unique()->nullable();
            $table->foreignId('employee_id')->constrained()->onDelete('cascade');
            $table->float('remaining_cl_days')->default(0);
            $table->float('remaining_cl_hours')->default(0);
            $table->float('remaining_ei_days')->default(0);
            $table->float('remaining_ei_hours')->default(0);
            $table->float('remaining_lwp_days')->default(0);
            $table->float('remaining_lwp_hours')->default(0);
            $table->float('remaining_medical_leave_in_days')->default(0);
            $table->float('remaining_medical_leave_in_hours')->default(0);
            $table->float('remaining_other_leave_in_days')->default(0);
            $table->float('remaining_other_leave_in_hours')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('leave_calculators');
    }
};