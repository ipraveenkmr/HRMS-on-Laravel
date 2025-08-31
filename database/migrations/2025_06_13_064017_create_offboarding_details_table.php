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
        Schema::create('offboarding_details', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('employee_details_id')->unique();
            $table->foreign('employee_details_id')
                ->references('id')
                ->on('employee_details')
                ->onDelete('cascade');
            $table->string('email')->nullable();
            $table->date('resignation_date');
            $table->date('last_working_day');
            $table->enum('exit_interview_status', ['Completed', 'Pending', 'Not Applicable']);
            $table->text('reason_for_leaving')->nullable();
            $table->enum('documents_handover_status', ['Complete', 'In Progress', 'Pending']);
            $table->string('clearance_status');
            $table->date('final_settlement_date')->nullable();
            $table->boolean('experience_certificate_issued')->default(false);
            $table->date('experience_certificate_date')->nullable();
            $table->boolean('relieving_letter_issued')->default(false);
            $table->date('relieving_letter_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('offboarding_details');
    }
};
