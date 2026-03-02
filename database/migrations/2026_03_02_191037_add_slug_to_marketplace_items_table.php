<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use App\Models\MarketplaceItem;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('marketplace_items', function (Blueprint $table) {
            $table->string('slug')->nullable()->unique()->after('name');
            $table->string('price')->nullable()->after('description');
            $table->string('whatsapp')->nullable()->after('price');
        });

        // Generate unique slugs from name
        MarketplaceItem::all()->each(function ($item) {
            $slug = Str::slug($item->name);
            $originalSlug = $slug;
            $count = 1;

            while (MarketplaceItem::where('slug', $slug)->where('id', '!=', $item->id)->exists()) {
                $slug = $originalSlug . '-' . $count++;
            }

            $item->slug = $slug;
            $item->saveQuietly();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('marketplace_items', function (Blueprint $table) {
            $table->dropColumn(['slug', 'price', 'whatsapp']);
        });
    }
};
