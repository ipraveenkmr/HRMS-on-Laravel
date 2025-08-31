<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('loans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('financial_year_id')->constrained()->onDelete('cascade');
            $table->string('username', 200)->nullable();
            $table->foreignId('employee_id')->constrained()->onDelete('cascade');
            $table->foreignId('department_id')->constrained()->onDelete('cascade');
            $table->float('loan_amount')->default(0);
            $table->float('loan_period_in_month')->default(0);
            $table->float('interest_rate')->default(0);
            $table->string('status', 99)->nullable()->default('Active');
            $table->string('apply_date', 99)->nullable();
            $table->text('purpose')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('loans');
    }
};