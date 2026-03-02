<?php

use App\Http\Controllers\LandingController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;

Route::get('/debug-storage', function () {
    $results = [];
    try {
        if (File::exists(public_path('storage'))) {
            if (!is_link(public_path('storage'))) {
                File::deleteDirectory(public_path('storage'));
                $results[] = "Folder storage biasa dihapus.";
            }
        }
        Artisan::call('storage:link');
        $results[] = "storage:link dijalankan.";
    } catch (\Exception $e) { $results[] = "Gagal link: " . $e->getMessage(); }

    try {
        $paths = [
            storage_path('app/public'),
            storage_path('app/public/marketplace'),
            storage_path('app/public/marketplace_cropped'),
        ];
        foreach ($paths as $path) {
            if (File::exists($path)) {
                chmod($path, 0755);
                $results[] = "Permission folder $path diatur ke 755.";
                
                // Perbaiki juga file di dalamnya - Sangat penting untuk Hosting!
                $files = File::files($path);
                foreach ($files as $file) {
                    chmod($file->getRealPath(), 0644);
                }
                $results[] = "Seluruh file di dalam $path diatur ke 644.";
            }
        }
    } catch (\Exception $e) { $results[] = "Gagal atur permission: " . $e->getMessage(); }
    return response()->json($results);
});

Route::get('/', [LandingController::class, 'index'])->name('landing');
Route::get('/contact', [ContactController::class, 'index'])->name('contact');
Route::get('/marketplace', [\App\Http\Controllers\MarketplaceController::class, 'index'])->name('marketplace.index');
Route::get('/marketplace/{marketplaceItem}', [\App\Http\Controllers\MarketplaceController::class, 'show'])->name('marketplace.show');


Route::get('/threads', [App\Http\Controllers\ThreadPageController::class, 'index'])->name('threads.index');
Route::get('/threads/owner', [App\Http\Controllers\ThreadPageController::class, 'ownerThreads'])->name('threads.owner');
Route::get('/threads/user/{user}', [App\Http\Controllers\ThreadPageController::class, 'userThreads'])->name('threads.user');

Route::post('/threads/{thread}/like', [App\Http\Controllers\Api\ThreadInteractionController::class, 'like'])->name('threads.like');
Route::post('/threads/{thread}/share', [App\Http\Controllers\Api\ThreadInteractionController::class, 'share'])->name('threads.share');

Route::get('/threads/{thread}/comments', [App\Http\Controllers\Api\ThreadCommentController::class, 'index'])->name('threads.comments.index');
Route::post('/threads/{thread}/comments', [App\Http\Controllers\Api\ThreadCommentController::class, 'store'])->name('threads.comments.store');

Route::middleware(['auth', 'verified', 'admin'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard', [
            'threadCount' => \App\Models\ThreadPost::count(),
        ]);
    })->name('dashboard');

    // Owner route group for manage threads
    Route::prefix('dashboard')->group(function () {
        Route::get('/threads', [App\Http\Controllers\Dashboard\ThreadController::class, 'index'])->name('dashboard.threads');
        Route::post('/threads', [App\Http\Controllers\Dashboard\ThreadController::class, 'store'])->name('dashboard.threads.store');
        Route::put('/threads/{thread}', [App\Http\Controllers\Dashboard\ThreadController::class, 'update'])->name('dashboard.threads.update');
        Route::delete('/threads/{thread}', [App\Http\Controllers\Dashboard\ThreadController::class, 'destroy'])->name('dashboard.threads.destroy');

        Route::delete('/comments/{comment}', [App\Http\Controllers\Api\ThreadCommentController::class, 'destroy'])->name('dashboard.comments.destroy');

        Route::get('/biodata', [App\Http\Controllers\Dashboard\BiodataController::class, 'index'])->name('dashboard.biodata');
        Route::put('/biodata', [App\Http\Controllers\Dashboard\BiodataController::class, 'update'])->name('dashboard.biodata.update');

        // Marketplace management
        Route::get('/marketplace', [App\Http\Controllers\Dashboard\AdminMarketplaceController::class, 'index'])->name('dashboard.marketplace.index');
        Route::get('/marketplace/create', [App\Http\Controllers\Dashboard\AdminMarketplaceController::class, 'create'])->name('dashboard.marketplace.create');
        Route::post('/marketplace', [App\Http\Controllers\Dashboard\AdminMarketplaceController::class, 'store'])->name('dashboard.marketplace.store');
        Route::get('/marketplace/{marketplaceItem}/edit', [App\Http\Controllers\Dashboard\AdminMarketplaceController::class, 'edit'])->name('dashboard.marketplace.edit');
        Route::put('/marketplace/{marketplaceItem}', [App\Http\Controllers\Dashboard\AdminMarketplaceController::class, 'update'])->name('dashboard.marketplace.update');
        Route::delete('/marketplace/{marketplaceItem}', [App\Http\Controllers\Dashboard\AdminMarketplaceController::class, 'destroy'])->name('dashboard.marketplace.destroy');
    });
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::post('/public-threads', [App\Http\Controllers\PublicThreadController::class, 'store'])->name('public-threads.store');
});

require __DIR__ . '/auth.php';
