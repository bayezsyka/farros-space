<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MarketplaceItem extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'image_path',
        'image_cropped_path',
        'status',
        'description',
        'price',
        'whatsapp',
        'name_id',
        'name_en',
        'description_id',
        'description_en',
    ];
    
    protected $casts = [
        'price' => 'integer',
    ];

    /**
     * Use slug as route key for clean URLs.
     */
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    protected static function boot()
    {
        parent::boot();

        static::saving(function ($item) {
            if (empty($item->slug)) {
                $item->slug = \Illuminate\Support\Str::slug($item->name) . '-' . rand(1000, 9999);
            }
        });
    }

    /**
     * Always use the phone number from SiteProfile.
     */
    public function getWhatsappAttribute(): ?string
    {
        static $profile = null;
        if ($profile === null) {
            $profile = \App\Models\SiteProfile::first() ?? false;
        }
        return $profile ? $profile->phone : null;
    }

    public function fotoDetailItems()
    {
        return $this->hasMany(FotoDetailItem::class);
    }
}
