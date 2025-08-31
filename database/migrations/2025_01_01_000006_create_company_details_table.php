<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('company_details', function (Blueprint $table) {
            $table->id();
            $table->string('company_name', 99)->nullable();
            $table->string('company_address', 199)->nullable();
            $table->string('support_email', 99)->nullable();
            $table->string('longitude', 99)->nullable();
            $table->string('latitude', 99)->nullable();
            $table->string('cloudinary_email', 99)->nullable();
            $table->string('cloudinary_preset', 99)->nullable();
            $table->string('cloudinary_api', 99)->nullable();
            $table->enum('status', ['Active', 'Inactive'])->default('Active');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('company_details');
    }
};