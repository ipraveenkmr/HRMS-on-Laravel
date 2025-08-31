<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('assigned_jobs', function (Blueprint $table) {
            $table->id();
            $table->text('task')->nullable();
            $table->string('username', 200)->nullable();
            $table->foreignId('employee_id')->constrained()->onDelete('cascade');
            $table->foreignId('department_id')->constrained()->onDelete('cascade');
            $table->string('manager', 200)->nullable();
            $table->string('task_time', 99)->nullable();
            $table->string('comment', 99)->nullable();
            $table->string('submission_date', 99)->nullable();
            $table->string('status', 99)->nullable();
            $table->string('document', 200)->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('assigned_jobs');
    }
};