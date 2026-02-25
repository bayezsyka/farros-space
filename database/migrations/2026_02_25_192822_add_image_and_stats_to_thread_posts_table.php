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
        Schema::table('thread_posts', function (Blueprint $table) {
            $table->string('image_url')->nullable()->after('content');
            $table->unsignedInteger('likes_count')->default(0)->after('image_url');
            $table->unsignedInteger('shares_count')->default(0)->after('likes_count');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('thread_posts', function (Blueprint $table) {
            $table->dropColumn(['image_url', 'likes_count', 'shares_count']);
        });
    }
};
