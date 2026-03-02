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
        // Set default price for existing items that might have it null
        \App\Models\MarketplaceItem::whereNull('price')->update(['price' => '0']);

        Schema::table('marketplace_items', function (Blueprint $table) {
            $table->text('description')->nullable()->change();
            $table->string('price')->nullable(false)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('marketplace_items', function (Blueprint $table) {
            $table->text('description')->nullable(false)->change();
            $table->string('price')->nullable(true)->change();
        });
    }
};
