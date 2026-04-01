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
        Schema::table('experiences', function (Blueprint $table) {
            $table->string('role_id', 255)->nullable()->after('role');
            $table->string('role_en', 255)->nullable()->after('role_id');
            $table->string('company_or_event_name_id', 255)->nullable()->after('company_or_event_name');
            $table->string('company_or_event_name_en', 255)->nullable()->after('company_or_event_name_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('experiences', function (Blueprint $table) {
            $table->dropColumn(['role_id', 'role_en', 'company_or_event_name_id', 'company_or_event_name_en']);
        });
    }
};
