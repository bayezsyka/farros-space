<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('education', function (Blueprint $table) {
            // Add level enum before institution column
            $table->enum('level', [
                'SD', 'SMP', 'SMA', 'SMK', 'D1', 'D2', 'D3', 'D4', 'S1', 'S2', 'S3', 'Lainnya'
            ])->default('S1')->after('id');

            // Make program_major nullable (SD/SMP doesn't always have a major)
            $table->string('program_major')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('education', function (Blueprint $table) {
            $table->dropColumn('level');
            $table->string('program_major')->nullable(false)->change();
        });
    }
};

