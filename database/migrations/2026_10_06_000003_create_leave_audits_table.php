<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('leave_audits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('leave_tracker_id')->constrained('leave_trackers')->cascadeOnDelete();
            $table->foreignId('actor_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('action', 30);
            $table->json('before')->nullable();
            $table->json('after');
            $table->timestamp('created_at');
            $table->index(['leave_tracker_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('leave_audits');
    }
};
