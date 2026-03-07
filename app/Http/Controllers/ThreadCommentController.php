<?php

namespace App\Http\Controllers;

use App\Models\ThreadPost;
use App\Models\ThreadComment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class ThreadCommentController extends Controller
{
    /**
     * Display comments (API/JSON usually, though optional if front-end uses Inertia).
     */
    public function index(ThreadPost $thread)
    {
        return response()->json($thread->comments()->with('user')->latest()->get());
    }

    /**
     * Store a newly created comment.
     */
    public function store(Request $request, ThreadPost $thread)
    {
        Gate::authorize('create', ThreadComment::class);

        $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        $comment = $thread->comments()->create([
            'user_id' => Auth::id(),
            'content' => $request->content,
        ]);

        if ($request->wantsJson()) {
            return response()->json($comment->load('user'));
        }

        return redirect()->back()->with('success', 'Comment added.');
    }

    /**
     * Remove the specified comment.
     */
    public function destroy(ThreadComment $comment)
    {
        Gate::authorize('delete', $comment);

        $comment->delete();

        if (request()->wantsJson()) {
            return response()->json(['message' => 'Comment deleted']);
        }

        return redirect()->back()->with('success', 'Comment deleted.');
    }
}
