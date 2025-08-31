<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('employee_details', function (Blueprint $table) {
            $table->id();
            $table->string('full_name');
            $table->string('email')->unique();
            $table->string('phone_number');
            $table->enum('gender', ['Male', 'Female', 'Non-binary', 'Prefer not to say']);
            $table->date('dob');
            $table->string('marital_status')->nullable();
            $table->string('nationality');
            $table->text('address');
            $table->string('city');
            $table->string('state');
            $table->string('pin_code');
            $table->string('pan_number')->unique();
            $table->string('aadhaar_number')->nullable()->unique();
            $table->string('employee_number')->unique();
            $table->string('employment_type'); // Permanent, Contract, Intern, etc.
            $table->string('department');
            $table->string('designation');
            $table->string('reporting_manager');
            $table->date('joining_date');
            $table->enum('work_mode', ['On-site', 'Remote', 'Hybrid']);
            $table->string('shift_type')->nullable(); // Day, Night, Rotational
            $table->string('qualification');
            $table->string('specialization')->nullable();
            $table->integer('experience_years')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employee_details');
    }
};
