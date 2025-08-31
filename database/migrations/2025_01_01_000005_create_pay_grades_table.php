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
            $table->bigInteger('min_gross_range')->default(0);
            $table->bigInteger('max_gross_range')->default(0);
            $table->bigInteger('basic')->default(0);
            $table->bigInteger('hra')->default(0);
            $table->bigInteger('ta')->default(0);
            $table->bigInteger('com')->default(0);
            $table->bigInteger('medical')->default(0);
            $table->bigInteger('edu')->default(0);
            $table->bigInteger('sa')->default(0);
            $table->bigInteger('income_tax')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pay_grades');
    }
};