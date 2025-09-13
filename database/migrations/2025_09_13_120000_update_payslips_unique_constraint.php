<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('payslips', function (Blueprint $table) {
            // Drop the existing unique constraint on month_year
            $table->dropUnique(['month_year']);
            
            // Add composite unique constraint on employee_id and month_year
            $table->unique(['employee_id', 'month_year'], 'payslips_employee_month_unique');
        });
    }

    public function down(): void
    {
        Schema::table('payslips', function (Blueprint $table) {
            // Drop the composite unique constraint
            $table->dropUnique('payslips_employee_month_unique');
            
            // Add back the original unique constraint on month_year
            $table->unique('month_year');
        });
    }
};