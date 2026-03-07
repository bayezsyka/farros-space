<?php

namespace App\Http\Controllers;

use App\Data\ThreadPostData;
use App\Models\ThreadPost;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class UserThreadController extends Controller
{
    /**
     * Display threads for a specific user based on username.
     */
    public function index($username): Response
    {
        $profile = \App\Models\SiteProfile::first()?->toArray() ?? [];

        $threadsQuery = ThreadPost::with(['user', 'comments.user'])
            ->withCount('comments')
            ->where('visibility', 'public')
            ->orderBy('created_at', 'desc');

        if ($username === 'owner') {
            $threadsQuery->whereNull('user_id');
            $threadUser = [
                'id' => null,
                'name' => $profile['full_name'] ?? 'Owner',
                'avatar' => $profile['avatar_url'] ?? null,
            ];
        } else {
            // Find by name matching username parameter
            $user = User::where('name', $username)->firstOrFail();
            
            $threadsQuery->where('user_id', $user->id);
            $threadUser = [
                'id' => $user->id,
                'name' => $user->name,
                'avatar' => $user->avatar,
            ];
        }

        $threads = $threadsQuery->get()
            ->map(fn($post) => ThreadPostData::fromModel($post)->toArray())
            ->toArray();

        return Inertia::render('Threads/UserThreads', [
            'threads' => $threads,
            'profile' => $profile,
            'threadUser' => $threadUser,
        ]);
    }
}
