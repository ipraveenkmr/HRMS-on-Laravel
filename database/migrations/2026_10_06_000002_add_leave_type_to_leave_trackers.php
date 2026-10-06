<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('leave_trackers', function (Blueprint $table) {
            $table->string('leave_type', 40)->nullable();
            $table->index(['employee_id', 'leave_status']);
        });
    }

    public function down(): void
    {
        Schema::table('leave_trackers', function (Blueprint $table) {
            $table->dropIndex(['employee_id', 'leave_status']);
            $table->dropColumn('leave_type');
        });
    }
};
