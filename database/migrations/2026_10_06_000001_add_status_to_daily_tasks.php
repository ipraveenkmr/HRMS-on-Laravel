<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('daily_tasks', function (Blueprint $table) {
            $table->string('status', 20)->default('Pending');
            $table->index(['employee_id', 'submission_date']);
        });
        DB::table('daily_tasks')->orderBy('id')->chunkById(200, function ($rows) {
            foreach ($rows as $row) {
                try {
                    $date = Carbon::parse($row->submission_date ?: $row->created_at)->toDateString();
                    DB::table('daily_tasks')->where('id', $row->id)->update(['submission_date' => $date]);
                } catch (\Exception $e) {
                    // Keep invalid legacy values for manual review.
                }
            }
        });
    }

    public function down(): void
    {
        Schema::table('daily_tasks', function (Blueprint $table) {
            $table->dropIndex(['employee_id', 'submission_date']);
            $table->dropColumn('status');
        });
    }
};
