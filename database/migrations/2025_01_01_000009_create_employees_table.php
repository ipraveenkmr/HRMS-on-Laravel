<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->string('username', 200)->unique();
            $table->string('emp_name', 200)->nullable();
            $table->foreignId('company_name_id')->constrained('company_details')->onDelete('cascade');
            $table->foreignId('branch_name_id')->constrained('branch_details')->onDelete('cascade');
            $table->string('longitude', 99)->nullable();
            $table->string('latitude', 99)->nullable();
            $table->string('emp_email', 99)->nullable();
            $table->string('dob', 99)->nullable();
            $table->enum('gender', ['Male', 'Female', 'Other'])->default('Male');
            $table->string('father_husband_name', 99)->nullable();
            $table->string('mothers_name', 99)->nullable();
            $table->text('permanent_address')->nullable();
            $table->text('present_address')->nullable();
            $table->string('city', 99)->nullable();
            $table->string('state', 99)->nullable();
            $table->string('pincode', 99)->nullable();
            $table->string('emp_phone', 99)->nullable();
            $table->string('emp_emergency_phone', 99)->nullable();
            $table->string('pan', 99)->nullable();
            $table->string('aadhaar', 99)->nullable();
            $table->enum('work_mode', ['Office', 'Field'])->default('Office');
            
            // Education Details
            $table->enum('qualification', ['Under Graduate', 'Graduate', 'Post Graduate'])->default('Under Graduate');
            $table->string('board_university', 99)->nullable();
            $table->string('specialization', 99)->nullable();
            $table->string('name_of_course', 99)->nullable();
            $table->string('passing_year', 99)->nullable();
            
            // Work History
            $table->string('employer', 99)->nullable();
            $table->string('job_title', 99)->nullable();
            $table->string('start_date', 99)->nullable();
            $table->string('end_date', 99)->nullable();
            $table->text('comment')->nullable();
            
            // References
            $table->string('reference_name', 200)->nullable();
            $table->string('reference_designation', 200)->nullable();
            $table->string('reference_department', 200)->nullable();
            $table->string('reference_contact', 200)->nullable();
            $table->string('reference_email', 200)->nullable();
            $table->string('reference_name_if_any', 200)->nullable();
            $table->string('reference_designation_if_any', 200)->nullable();
            $table->string('reference_department_if_any', 200)->nullable();
            $table->string('reference_contact_if_any', 200)->nullable();
            $table->string('reference_email_if_any', 200)->nullable();
            
            // Official Details
            $table->string('emp_no', 99)->nullable();
            $table->string('joining_date', 99)->nullable();
            $table->foreignId('department_id')->constrained()->onDelete('cascade');
            $table->string('designation', 99)->nullable();
            $table->enum('emp_type', ['Employee', 'Manager', 'Asset Admin', 'Admin'])->default('Employee');
            $table->enum('job_type', ['Permanent', 'Contractual'])->default('Permanent');
            $table->string('probation_period_in_month', 99)->nullable();
            $table->string('pf_account_number_uan', 99)->nullable();
            $table->string('esi_account_number', 99)->nullable();
            $table->string('emp_file_no', 99)->nullable();
            $table->enum('emp_status', ['Working', 'Resigned', 'Notice Period'])->default('Working');
            $table->string('emp_joining_date', 99)->nullable();
            $table->string('emp_resignation_date', 99)->nullable();
            $table->string('emp_last_working_date', 99)->nullable();
            $table->string('full_and_final_settlement', 99)->nullable();
            
            // Salary Details
            $table->foreignId('pay_grade_id')->constrained()->onDelete('cascade');
            $table->bigInteger('gross_salary')->nullable();
            $table->bigInteger('ctc')->nullable();
            $table->string('bank_name', 99)->nullable();
            $table->string('bank_account_number', 99)->nullable();
            $table->string('ifsc_code', 99)->nullable();
            $table->string('bank_branch', 99)->nullable();
            $table->string('bank_city', 99)->nullable();
            $table->decimal('pf', 5, 2)->nullable();
            $table->decimal('esi', 5, 2)->nullable();
            
            // Documents
            $table->string('photo', 200)->nullable();
            $table->string('aadhaar_pic', 200)->nullable();
            $table->string('pan_pic', 200)->nullable();
            $table->boolean('isbasicpay')->default(false);
            $table->string('esi_number', 200)->nullable();
            $table->string('uan_number', 200)->nullable();
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};