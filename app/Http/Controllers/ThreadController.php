<?php

namespace App\Http\Controllers;

use App\Actions\Threads\CreateThreadAction;
use App\Actions\Threads\UpdateThreadAction;
use App\Actions\Threads\DeleteThreadAction;
use App\Data\ThreadPostData;
use App\Models\ThreadPost;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Gate;

class ThreadController extends Controller
{
    /**
     * Display all public threads (Global Feed).
     */
    public function index(): Response
    {
        $profile = \App\Models\SiteProfile::first()?->toArray() ?? [];

        // Owner threads + Public threads logic unified for global feed
        $threads = ThreadPost::with(['user', 'comments.user'])
            ->withCount('comments')
            ->where('visibility', 'public')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($post) => ThreadPostData::fromModel($post)->toArray())
            ->toArray();

        return Inertia::render('Threads/Index', [
            'threads' => $threads,
            'profile' => $profile,
        ]);
    }

    /**
     * Display the specified thread.
     */
    public function show(ThreadPost $thread): Response
    {
        $profile = \App\Models\SiteProfile::first()?->toArray() ?? [];

        $thread->load(['user', 'comments.user']);
        $thread->loadCount('comments');

        return Inertia::render('Threads/Show', [
            'thread' => ThreadPostData::fromModel($thread)->toArray(),
            'profile' => $profile,
        ]);
    }

    /**
     * Store a newly created thread.
     */
    public function store(Request $request, CreateThreadAction $createThreadAction)
    {
        Gate::authorize('create', ThreadPost::class);

        $request->validate([
            'title' => 'nullable|string|max:255',
            'content' => 'required|string|max:5000',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        $data = [
            'user_id' => Auth::id(),
            'title' => $request->title,
            'content' => $request->content,
            'visibility' => 'public',
            'allow_comments' => true,
        ];

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image');
        }

        $createThreadAction->execute($data);

        return redirect()->back()->with('success', 'Thread created successfully.');
    }

    /**
     * Update the specified thread.
     */
    public function update(Request $request, ThreadPost $thread, UpdateThreadAction $updateThreadAction)
    {
        Gate::authorize('update', $thread);

        $request->validate([
            'title' => 'nullable|string|max:255',
            'content' => 'required|string|max:5000',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        $data = [
            'title' => $request->title,
            'content' => $request->content,
        ];

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image');
        }

        $updateThreadAction->execute($thread, $data);

        return redirect()->back()->with('success', 'Thread updated successfully.');
    }

    /**
     * Remove the specified thread.
     */
    public function destroy(ThreadPost $thread, DeleteThreadAction $deleteThreadAction)
    {
        Gate::authorize('delete', $thread);

        $deleteThreadAction->execute($thread);

        return redirect()->back()->with('success', 'Thread deleted successfully.');
    }
}
