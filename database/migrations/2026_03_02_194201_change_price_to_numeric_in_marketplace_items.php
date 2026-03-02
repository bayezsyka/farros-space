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
        // Clean existing non-numeric data to prevent migration failure
        \App\Models\MarketplaceItem::all()->each(function ($item) {
            if (!is_numeric($item->price)) {
                $item->price = '0';
                $item->saveQuietly();
            }
        });

        Schema::table('marketplace_items', function (Blueprint $table) {
            $table->bigInteger('price')->unsigned()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('marketplace_items', function (Blueprint $table) {
            $table->string('price')->change();
        });
    }
};
