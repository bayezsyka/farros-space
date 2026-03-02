<?php

use App\Http\Controllers\LandingController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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
