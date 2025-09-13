<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pay_grades', function (Blueprint $table) {
            $table->id();
            $table->integer('grade')->unique();
            $table->decimal('min_gross_range', 15, 2)->default(0);
            $table->decimal('max_gross_range', 15, 2)->default(0);
            $table->decimal('basic', 15, 2)->default(0);
            $table->decimal('hra', 15, 2)->default(0);
            $table->decimal('ta', 15, 2)->default(0);
            $table->decimal('com', 15, 2)->default(0);
            $table->decimal('medical', 15, 2)->default(0);
            $table->decimal('edu', 15, 2)->default(0);
            $table->decimal('sa', 15, 2)->default(0);
            $table->decimal('income_tax', 15, 2)->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pay_grades');
    }
};