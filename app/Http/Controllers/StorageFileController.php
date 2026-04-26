<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class StorageFileController extends Controller
{
    public function __invoke(Request $request, string $path): Response
    {
        $path = ltrim(str_replace('\\', '/', $path), '/');

        if ($path === '' || str_contains($path, '..')) {
            abort(404);
        }

        $allowedRoots = [
            'avatars/',
            'marketplace/',
            'marketplace_cropped/',
            'marketplace_details/',
            'threads/',
        ];

        if (!Str::startsWith($path, $allowedRoots)) {
            abort(404);
        }

        if (!Storage::disk('public')->exists($path)) {
            if (app()->environment('local')) {
                return redirect()->away('https://farros.space/storage/' . $path);
            }
            abort(404);
        }

        $fullPath = Storage::disk('public')->path($path);
        $mime = File::mimeType($fullPath) ?: 'application/octet-stream';

        return response()->file($fullPath, [
            'Content-Type' => $mime,
            'Cache-Control' => 'public, max-age=31536000, immutable',
        ]);
    }
}
