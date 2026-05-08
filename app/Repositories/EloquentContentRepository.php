<?php

namespace App\Repositories;

use App\Contracts\ContentRepositoryInterface;
use App\Models\SiteProfile;
use App\Models\Education;

use App\Models\Experience;
use App\Models\MarketplaceItem;

class EloquentContentRepository implements ContentRepositoryInterface
{
    public function getSiteProfile(): array
    {
        return SiteProfile::first()?->toArray() ?? [];
    }

    public function getEducation(): array
    {
        return Education::orderBy('sort_order', 'asc')->get()->toArray();
    }



    public function getExperiences(): array
    {
        return Experience::select(['id', 'role', 'company_or_event_name', 'type', 'start_date', 'slug', 'is_archived'])
            ->where('is_archived', false)
            ->withCount('updates')
            ->orderBy('start_date', 'desc')
            ->limit(6)
            ->get()
            ->toArray();
    }

    public function getMarketplaceItems(): array
    {
        return MarketplaceItem::select(['id', 'slug', 'name', 'price', 'status', 'image_path', 'created_at'])
            ->orderBy('created_at', 'desc')
            ->limit(6)
            ->get()
            ->toArray();
    }
}
