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
            $table->renameColumn('summary', 'summary_id');
        });
        
        Schema::table('experiences', function (Blueprint $table) {
            $table->longText('summary_en')->nullable()->after('summary_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('experiences', function (Blueprint $table) {
            $table->renameColumn('summary_id', 'summary');
            $table->dropColumn('summary_en');
        });
    }
};
