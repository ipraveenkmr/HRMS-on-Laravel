<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('leaves', function (Blueprint $table) {
            $table->id();
            $table->foreignId('financial_year_id')->constrained()->onDelete('cascade');
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
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('leaves');
    }
};