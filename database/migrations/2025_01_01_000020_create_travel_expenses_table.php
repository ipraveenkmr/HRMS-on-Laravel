<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('travel_expenses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('employees')->onDelete('cascade');
            $table->foreignId('department_id')->nullable()->constrained('departments')->onDelete('set null');
            $table->string('expense_type');
            $table->decimal('amount', 10, 2);
            $table->string('currency', 10)->default('INR');
            $table->text('description')->nullable();
            $table->date('expense_date');
            $table->string('from_location')->nullable();
            $table->string('to_location')->nullable();
            $table->text('purpose')->nullable();
            $table->string('receipt_document')->nullable();
            $table->enum('status', ['Pending', 'Approved', 'Rejected'])->default('Pending');
            $table->foreignId('approved_by')->nullable()->constrained('employees')->onDelete('set null');
            $table->timestamp('approval_date')->nullable();
            $table->text('remarks')->nullable();
            $table->string('username')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('travel_expenses');
    }
};