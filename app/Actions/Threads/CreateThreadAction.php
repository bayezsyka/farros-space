<?php

namespace App\Actions\Threads;

use App\Models\ThreadPost;
use Illuminate\Support\Str;

class CreateThreadAction
{
    public function execute(array $data): ThreadPost
    {
        $data['slug'] = Str::slug($data['title'] ?? Str::limit($data['content'], 20)) . '-' . rand(1000, 9999);
        $data['published_at'] = now();

        return ThreadPost::create($data);
    }
}
