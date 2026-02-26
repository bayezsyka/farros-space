<?php

namespace App\Http\Controllers;

use App\Data\ThreadPostData;
use App\Models\ThreadPost;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class ThreadPageController extends Controller
{
    /**
     * Display all threads (owner + public) mixed together.
     */
    public function index(): Response
    {
        $profile = \App\Models\SiteProfile::first()?->toArray() ?? [];

        // Owner threads (no user_id)
        $ownerThreads = ThreadPost::withCount('comments')
            ->whereNull('user_id')
            ->where('visibility', 'public')
            ->orderBy('created_at', 'desc')
            ->get();

        // Public threads (has user_id)
        $publicThreads = ThreadPost::with(['user', 'comments.user'])
            ->withCount('comments')
            ->whereNotNull('user_id')
            ->where('visibility', 'public')
            ->orderBy('created_at', 'desc')
            ->get();

        // Merge and sort by created_at descending
        $allThreads = $ownerThreads->concat($publicThreads)
            ->sortByDesc('created_at')
            ->values()
            ->map(fn($post) => ThreadPostData::fromModel($post)->toArray())
            ->toArray();

        return Inertia::render('Threads/Index', [
            'threads' => $allThreads,
            'profile' => $profile,
        ]);
    }

    /**
     * Display threads for a specific user.
     */
    public function userThreads(User $user): Response
    {
        $profile = \App\Models\SiteProfile::first()?->toArray() ?? [];

        $threads = ThreadPost::with(['user', 'comments.user'])
            ->withCount('comments')
            ->where('user_id', $user->id)
            ->where('visibility', 'public')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($post) => ThreadPostData::fromModel($post)->toArray())
            ->toArray();

        return Inertia::render('Threads/UserThreads', [
            'threads' => $threads,
            'profile' => $profile,
            'threadUser' => [
                'id' => $user->id,
                'name' => $user->name,
                'avatar' => $user->avatar,
            ],
        ]);
    }

    /**
     * Display owner (site admin) threads only.
     */
    public function ownerThreads(): Response
    {
        $profile = \App\Models\SiteProfile::first()?->toArray() ?? [];

        $threads = ThreadPost::withCount('comments')
            ->whereNull('user_id')
            ->where('visibility', 'public')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($post) => ThreadPostData::fromModel($post)->toArray())
            ->toArray();

        return Inertia::render('Threads/UserThreads', [
            'threads' => $threads,
            'profile' => $profile,
            'threadUser' => [
                'id' => null,
                'name' => $profile['full_name'] ?? 'Farros',
                'avatar' => $profile['avatar_url'] ?? null,
            ],
        ]);
    }
}
