<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attendance_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('financial_year_id')->constrained()->onDelete('cascade');
            $table->foreignId('employee_id')->constrained()->onDelete('cascade');
            $table->foreignId('department_id')->constrained()->onDelete('cascade');
            $table->string('attendance_date', 99);
            $table->string('username', 200)->nullable();
            $table->string('attendance', 99)->nullable();
            $table->string('login_at', 99)->nullable();
            $table->string('logout_at', 99)->nullable();
            $table->float('log_time')->default(0);
            $table->string('longitude', 99)->nullable();
            $table->string('latitude', 99)->nullable();
            $table->string('device', 99)->nullable();
            $table->string('ip_address', 99)->nullable();
            $table->string('login_date', 99)->nullable();
            $table->string('login_month', 99)->nullable();
            $table->string('login_year', 99)->nullable();
            $table->timestamps();
            
            $table->index(['created_at']);
            $table->unique(['employee_id', 'attendance_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendance_records');
    }
};