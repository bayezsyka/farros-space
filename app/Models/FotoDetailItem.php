<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FotoDetailItem extends Model
{
    protected $fillable = [
        'marketplace_item_id',
        'foto_path',
    ];

    public function marketplaceItem(): BelongsTo
    {
        return $this->belongsTo(MarketplaceItem::class);
    }
}
