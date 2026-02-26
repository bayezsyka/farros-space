<?php

namespace App\Repositories;

use App\Contracts\ContentRepositoryInterface;
use App\Models\SiteProfile;
use App\Models\Education;
use App\Models\ThreadPost;

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
}
