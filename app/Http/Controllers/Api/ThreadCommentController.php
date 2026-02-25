<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ThreadPost;
use App\Models\ThreadComment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ThreadCommentController extends Controller
{
    public function index(ThreadPost $thread)
    {
        return $thread->comments()->with('user')->latest()->get();
    }

    public function store(Request $request, ThreadPost $thread)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        $comment = $thread->comments()->create([
            'user_id' => Auth::id(),
            'content' => $request->content,
        ]);

        return $comment->load('user');
    }

    public function destroy(ThreadComment $comment)
    {
        // Route is protected by dashboard middleware, but let's be safe
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $comment->delete();

        return response()->json(['message' => 'Comment deleted']);
    }
}
