<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('loan_calculators', function (Blueprint $table) {
            $table->id();
            $table->foreignId('loan_id')->constrained()->onDelete('cascade');
            $table->foreignId('financial_year_id')->constrained()->onDelete('cascade');
            $table->string('username', 200)->nullable();
            $table->foreignId('employee_id')->constrained()->onDelete('cascade');
            $table->foreignId('department_id')->constrained()->onDelete('cascade');
            $table->float('total_amount')->default(0);
            $table->string('status', 99)->nullable()->default('Active');
            $table->float('emi')->default(0);
            $table->float('remaining_loan_amount')->default(0);
            $table->float('remaining_loan_period_in_month')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('loan_calculators');
    }
};