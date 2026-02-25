<?php

namespace App\Actions\Threads;

use App\Models\ThreadPost;

class UpdateThreadAction
{
    public function execute(ThreadPost $thread, array $data): bool
    {
        return $thread->update($data);
    }
}
