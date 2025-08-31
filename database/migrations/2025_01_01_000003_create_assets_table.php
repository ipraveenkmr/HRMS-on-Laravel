<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('assets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('asset_category_id')->constrained()->onDelete('cascade');
            $table->string('asset_name', 99)->nullable();
            $table->string('manufacturer', 99)->nullable();
            $table->string('model_number', 99)->nullable();
            $table->string('serial_number', 99)->nullable();
            $table->string('support_link', 99)->nullable();
            $table->date('purchasing_date')->nullable();
            $table->date('active_service_date')->nullable();
            $table->string('purchasing_value', 99)->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('assets');
    }
};