<?php

namespace App\Http\Controllers\Dashboard;

use App\Actions\Threads\CreateThreadAction;
use App\Actions\Threads\DeleteThreadAction;
use App\Actions\Threads\UpdateThreadAction;
use App\Data\ThreadPostData;
use App\Http\Controllers\Controller;
use App\Models\ThreadPost;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ThreadController extends Controller
{
    public function index(): Response
    {
        $threads = ThreadPost::withCount('comments')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($thread) => ThreadPostData::fromModel($thread)->toArray());

        return Inertia::render('Dashboard/Threads/Index', [
            'threads' => $threads,
            'profile' => \App\Models\SiteProfile::first(),
        ]);
    }

    public function store(Request $request, CreateThreadAction $action)
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'content' => 'required|string',
            'visibility' => 'required|in:public,private',
            'allow_comments' => 'nullable|boolean',
            'tags' => 'nullable|string',
            'image' => 'nullable|image|max:2048', // 2MB max
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('threads', 'public');
            $validated['image_url'] = '/storage/' . $path;
        }

        $action->execute($validated);

        return redirect()->back()->with('message', 'Thread created successfully.');
    }

    public function update(Request $request, ThreadPost $thread, UpdateThreadAction $action)
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'content' => 'required|string',
            'visibility' => 'required|in:public,private',
            'allow_comments' => 'nullable|boolean',
            'tags' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('threads', 'public');
            $validated['image_url'] = '/storage/' . $path;

            // Optional: delete old image if exists
            if ($thread->image_url && str_contains($thread->image_url, '/storage/threads/')) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete(str_replace('/storage/', '', $thread->image_url));
            }
        }

        $action->execute($thread, $validated);

        return redirect()->back()->with('message', 'Thread updated successfully.');
    }

    public function destroy(ThreadPost $thread, DeleteThreadAction $action)
    {
        $action->execute($thread);

        return redirect()->back()->with('message', 'Thread deleted successfully.');
    }
}
