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
        Schema::create('account_details', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('employee_details_id')->unique();
            $table->foreign('employee_details_id')
                ->references('id')
                ->on('employee_details')
                ->onDelete('cascade');
            $table->string('email')->nullable();
            $table->string('pay_grade');
            $table->decimal('gross_salary', 15, 2);
            $table->decimal('net_salary', 15, 2)->nullable();
            $table->decimal('ctc', 15, 2);
            $table->string('pf_account_number')->nullable();
            $table->string('uan_number')->nullable();
            $table->string('esi_number')->nullable();
            $table->string('bank_name');
            $table->string('bank_account_number');
            $table->string('ifsc_code');
            $table->string('branch_name');
            $table->string('bank_city');
            $table->enum('tax_regime', ['Old', 'New']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('account_details');
    }
};
