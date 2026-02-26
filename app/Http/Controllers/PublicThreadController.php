<?php

namespace App\Http\Controllers;

use App\Models\ThreadPost;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Data\ThreadPostData;

class PublicThreadController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'content' => 'required|string|max:5000',
        ]);

        $thread = ThreadPost::create([
            'user_id' => Auth::id(),
            'content' => $request->content,
            'visibility' => 'public',
            'allow_comments' => true,
        ]);

        $thread->load('user');

        return response()->json(ThreadPostData::fromModel($thread)->toArray());
    }
}
