<?php

namespace App\Actions\Threads;

use App\Models\ThreadPost;

class DeleteThreadAction
{
    public function execute(ThreadPost $thread): bool
    {
        return $thread->delete();
    }
}
