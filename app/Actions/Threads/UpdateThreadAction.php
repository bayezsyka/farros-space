<?php

namespace App\Actions\Threads;

use App\Models\ThreadPost;
use App\Traits\ImageCompressor;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class UpdateThreadAction
{
    use ImageCompressor;

    public function execute(ThreadPost $thread, array $data): bool
    {
        if (isset($data['image']) && $data['image'] instanceof UploadedFile) {
            $path = $this->compressAndStoreWebp($data['image'], 'threads');
            if ($path) {
                // Delete old image if exists
                if ($thread->image_url) {
                    $oldPath = str_replace(url('/storage'), '', $thread->image_url);
                    Storage::disk('public')->delete(ltrim($oldPath, '/'));
                }
                
                $data['image_url'] = Storage::url($path);
            }
            unset($data['image']);
        }

        return $thread->update($data);
    }
}
