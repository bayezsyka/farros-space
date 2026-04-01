<?php

namespace App\Repositories;

use App\Contracts\ContentRepositoryInterface;
use App\Models\SiteProfile;
use App\Models\Education;
use App\Models\ThreadPost;
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

    public function getThreadPosts(): array
    {
        return ThreadPost::withCount('comments')
            ->whereNull('user_id')
            ->where('visibility', 'public')
            ->orderBy('created_at', 'desc')
            ->get()
            ->all();
    }

    public function getPublicThreads(): array
    {
        return ThreadPost::with(['user', 'comments.user'])
            ->withCount('comments')
            ->whereNotNull('user_id')
            ->where('visibility', 'public')
            ->orderBy('created_at', 'desc')
            ->get()
            ->all();
    }

    public function getExperiences(): array
    {
        return Experience::where('is_archived', false)
            ->withCount('updates')
            ->orderBy('start_date', 'desc')
            ->get()
            ->toArray();
    }

    public function getMarketplaceItems(): array
    {
        return MarketplaceItem::orderBy('created_at', 'desc')
            ->get()
            ->toArray();
    }
}
