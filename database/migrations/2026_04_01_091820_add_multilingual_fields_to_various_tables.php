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
        Schema::table('experience_updates', function (Blueprint $table) {
            $table->text('content_id')->nullable()->after('content');
            $table->text('content_en')->nullable()->after('content_id');
        });

        Schema::table('marketplace_items', function (Blueprint $table) {
            $table->string('name_id')->nullable()->after('name');
            $table->string('name_en')->nullable()->after('name_id');
            $table->text('description_id')->nullable()->after('description');
            $table->text('description_en')->nullable()->after('description_id');
        });

        Schema::table('site_profiles', function (Blueprint $table) {
            $table->string('headline_id')->nullable()->after('headline');
            $table->string('headline_en')->nullable()->after('headline_id');
            $table->string('bio_id')->nullable()->after('bio');
            $table->string('bio_en')->nullable()->after('bio_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('experience_updates', function (Blueprint $table) {
            $table->dropColumn(['content_id', 'content_en']);
        });

        Schema::table('marketplace_items', function (Blueprint $table) {
            $table->dropColumn(['name_id', 'name_en', 'description_id', 'description_en']);
        });

        Schema::table('site_profiles', function (Blueprint $table) {
            $table->dropColumn(['headline_id', 'headline_en', 'bio_id', 'bio_en']);
        });
    }
};
