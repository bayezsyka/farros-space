<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\ThreadPost;
use App\Models\ThreadInteraction;
use Illuminate\Support\Facades\DB;

class ThreadInteractionController extends Controller
{
    public function like(Request $request, ThreadPost $thread)
    {
        return $this->handleInteraction($request, $thread, 'like');
    }

    public function share(Request $request, ThreadPost $thread)
    {
        return $this->handleInteraction($request, $thread, 'share');
    }

    protected function handleInteraction(Request $request, ThreadPost $thread, string $type)
    {
        $ip = $request->ip();
        $sessionId = $request->session()->getId();
        $userId = auth()->id();

        // Check if already interacted
        $existing = ThreadInteraction::where('thread_post_id', $thread->id)
            ->where('interaction_type', $type)
            ->where(function ($query) use ($ip, $sessionId, $userId) {
                $query->where('ip_address', $ip)
                    ->orWhere('session_id', $sessionId);
                if ($userId) {
                    $query->orWhere('user_id', $userId);
                }
            })
            ->first();

        if ($existing && $type === 'like') {
            // Toggle like (unlike if already liked)
            $existing->delete();
            $thread->decrement($type . 's_count');
            return response()->json([
                'status' => 'unliked',
                'count' => (int) $thread->fresh()->likes_count
            ]);
        }

        if (!$existing) {
            DB::transaction(function () use ($thread, $type, $ip, $sessionId, $userId) {
                ThreadInteraction::create([
                    'thread_post_id' => $thread->id,
                    'interaction_type' => $type,
                    'ip_address' => $ip,
                    'session_id' => $sessionId,
                    'user_id' => $userId,
                ]);

                $thread->increment($type . 's_count');
            });
        }

        return response()->json([
            'status' => $type . 'd',
            'count' => (int) $thread->fresh()->getAttribute($type . 's_count')
        ]);
    }
}
