<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('company_details', function (Blueprint $table) {
            if (!Schema::hasColumn('company_details', 'logo')) {
                $table->string('logo', 255)->nullable()->after('status');
            }
        });
    }

    public function down(): void
    {
        Schema::table('company_details', function (Blueprint $table) {
            if (Schema::hasColumn('company_details', 'logo')) {
                $table->dropColumn('logo');
            }
        });
    }
};