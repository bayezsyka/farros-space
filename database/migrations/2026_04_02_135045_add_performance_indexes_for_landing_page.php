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
            $table->index(['visibility', 'user_id', 'created_at'], 'threads_landing_optimization_index');
        });

        Schema::table('experiences', function (Blueprint $table) {
            $table->index(['is_archived', 'start_date'], 'experiences_landing_optimization_index');
        });

        Schema::table('marketplace_items', function (Blueprint $table) {
            $table->index(['created_at'], 'marketplace_items_landing_optimization_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('thread_posts', function (Blueprint $table) {
            $table->dropIndex('threads_landing_optimization_index');
        });

        Schema::table('experiences', function (Blueprint $table) {
            $table->dropIndex('experiences_landing_optimization_index');
        });

        Schema::table('marketplace_items', function (Blueprint $table) {
            $table->dropIndex('marketplace_items_landing_optimization_index');
        });
    }
};
