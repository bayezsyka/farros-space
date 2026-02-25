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
        Schema::create('thread_interactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('thread_post_id')->constrained()->cascadeOnDelete();
            $table->string('interaction_type'); // 'like', 'share'
            $table->string('ip_address')->nullable();
            $table->string('session_id')->nullable();
            $table->timestamps();

            $table->index(['thread_post_id', 'interaction_type', 'ip_address', 'session_id'], 'interaction_unique_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('thread_interactions');
    }
};
