<?php

namespace App\Actions\Threads;

use App\Models\ThreadPost;
use App\Traits\ImageCompressor;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CreateThreadAction
{
    use ImageCompressor;

    public function execute(array $data): ThreadPost
    {
        $data['slug'] = Str::slug($data['title'] ?? Str::limit($data['content'], 20)) . '-' . rand(1000, 9999);
        $data['published_at'] = now();

        if (isset($data['image']) && $data['image'] instanceof UploadedFile) {
            $path = $this->compressAndStoreWebp($data['image'], 'threads');
            if ($path) {
                $data['image_url'] = Storage::url($path);
            }
            unset($data['image']);
        }

        return ThreadPost::create($data);
    }
}
