<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('branch_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_name_id')->constrained('company_details')->onDelete('cascade');
            $table->string('branch_name', 99);
            $table->string('branch_address', 199)->nullable();
            $table->string('longitude', 99);
            $table->string('latitude', 99);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('branch_details');
    }
};