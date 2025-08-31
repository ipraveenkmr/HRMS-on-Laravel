<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('financial_years', function (Blueprint $table) {
            $table->id();
            $table->string('year', 99)->unique();
            $table->float('working_hours')->default(8.5);
            $table->float('loan_interest_rate')->default(7.5);
            $table->string('login_time', 99)->nullable();
            $table->string('logout_time', 99)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('financial_years');
    }
};