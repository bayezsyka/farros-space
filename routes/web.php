<?php

use App\Http\Controllers\ContactController;
use App\Http\Controllers\ExperienceController;
use App\Http\Controllers\ExperienceUpdateController;
use App\Http\Controllers\LandingController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect('/id');
});

Route::get('/media/storage/{path}', \App\Http\Controllers\StorageFileController::class)
    ->where('path', '.*')
    ->name('storage.media');

Route::prefix('{locale}')->where(['locale' => 'en|id'])->group(function () {
    Route::get('/', [LandingController::class, 'index'])->name('landing');
    Route::get('/cv', [App\Http\Controllers\CvController::class, 'index'])->name('cv.index');
    Route::get('/age', function () {
        return Inertia::render('Age/Index');
    })->name('age');
    Route::get('/contact', [ContactController::class, 'index'])->name('contact');

    Route::get('/marketplace', [\App\Http\Controllers\MarketplaceController::class, 'index'])->name('marketplace.index');
    Route::get('/marketplace/{marketplaceItem}', [\App\Http\Controllers\MarketplaceController::class, 'show'])->name('marketplace.show');

    Route::get('/threads', [App\Http\Controllers\ThreadController::class, 'index'])->name('threads.index');
    Route::get('/threads/{thread}', [App\Http\Controllers\ThreadController::class, 'show'])->name('threads.show');
    Route::get('/{username}/threads', [App\Http\Controllers\UserThreadController::class, 'index'])->name('threads.user');

    Route::post('/threads/{thread}/like', [App\Http\Controllers\Api\ThreadInteractionController::class, 'like'])->name('threads.like');
    Route::post('/threads/{thread}/share', [App\Http\Controllers\Api\ThreadInteractionController::class, 'share'])->name('threads.share');

    Route::get('/threads/{thread}/comments', [App\Http\Controllers\ThreadCommentController::class, 'index'])->name('threads.comments.index');

    Route::middleware(['auth', 'verified', 'admin'])->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('Dashboard');
        })->name('dashboard');

        // Owner route group for manage threads
        Route::prefix('dashboard')->group(function () {
            Route::get('/biodata', [App\Http\Controllers\Dashboard\BiodataController::class, 'index'])->name('dashboard.biodata');
            Route::put('/biodata', [App\Http\Controllers\Dashboard\BiodataController::class, 'update'])->name('dashboard.biodata.update');

            Route::get('/social-links', [App\Http\Controllers\Dashboard\AdminSocialLinkController::class, 'index'])->name('dashboard.social-links.index');
            Route::post('/social-links', [App\Http\Controllers\Dashboard\AdminSocialLinkController::class, 'store'])->name('dashboard.social-links.store');
            Route::put('/social-links/{socialLink}', [App\Http\Controllers\Dashboard\AdminSocialLinkController::class, 'update'])->name('dashboard.social-links.update');
            Route::delete('/social-links/{socialLink}', [App\Http\Controllers\Dashboard\AdminSocialLinkController::class, 'destroy'])->name('dashboard.social-links.destroy');

            // Education management
            Route::get('/education', [App\Http\Controllers\Dashboard\EducationController::class, 'index'])->name('dashboard.education.index');
            Route::post('/education', [App\Http\Controllers\Dashboard\EducationController::class, 'store'])->name('dashboard.education.store');
            Route::put('/education/{education}', [App\Http\Controllers\Dashboard\EducationController::class, 'update'])->name('dashboard.education.update');
            Route::delete('/education/{education}', [App\Http\Controllers\Dashboard\EducationController::class, 'destroy'])->name('dashboard.education.destroy');
            Route::post('/education/reorder', [App\Http\Controllers\Dashboard\EducationController::class, 'reorder'])->name('dashboard.education.reorder');

            // Marketplace management
            Route::get('/marketplace', [App\Http\Controllers\Dashboard\AdminMarketplaceController::class, 'index'])->name('dashboard.marketplace.index');
            Route::get('/marketplace/create', [App\Http\Controllers\Dashboard\AdminMarketplaceController::class, 'create'])->name('dashboard.marketplace.create');
            Route::post('/marketplace', [App\Http\Controllers\Dashboard\AdminMarketplaceController::class, 'store'])->name('dashboard.marketplace.store');
            Route::get('/marketplace/{marketplaceItem}/edit', [App\Http\Controllers\Dashboard\AdminMarketplaceController::class, 'edit'])->name('dashboard.marketplace.edit');
            Route::put('/marketplace/{marketplaceItem}', [App\Http\Controllers\Dashboard\AdminMarketplaceController::class, 'update'])->name('dashboard.marketplace.update');
            Route::delete('/marketplace/{marketplaceItem}', [App\Http\Controllers\Dashboard\AdminMarketplaceController::class, 'destroy'])->name('dashboard.marketplace.destroy');
            Route::delete('/marketplace/foto-detail/{fotoDetailItem}', [App\Http\Controllers\Dashboard\AdminMarketplaceController::class, 'destroyFotoDetail'])->name('dashboard.marketplace.foto-detail.destroy');
        });
    });

    // Public Experience Routes
    Route::get('experiences', [ExperienceController::class, 'index'])->name('experiences.index');
    Route::get('experiences/{experience}', [ExperienceController::class, 'show'])->name('experiences.show');

    Route::middleware('auth')->group(function () {
        Route::post('experiences/{experience}/generate-summary', [ExperienceController::class, 'generateSummary'])->name('experiences.generate-summary');
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

        Route::post('/threads', [App\Http\Controllers\ThreadController::class, 'store'])->name('threads.store');
        Route::put('/threads/{thread}', [App\Http\Controllers\ThreadController::class, 'update'])->name('threads.update');
        Route::delete('/threads/{thread}', [App\Http\Controllers\ThreadController::class, 'destroy'])->name('threads.destroy');

        Route::post('/threads/{thread}/comments', [App\Http\Controllers\ThreadCommentController::class, 'store'])->name('threads.comments.store');
        Route::delete('/comments/{comment}', [App\Http\Controllers\ThreadCommentController::class, 'destroy'])->name('threads.comments.destroy');

        // Admin-only Experience management
        Route::middleware('admin')->group(function () {
            Route::post('experiences', [ExperienceController::class, 'store'])->name('experiences.store');
            Route::put('experiences/{experience}', [ExperienceController::class, 'update'])->name('experiences.update');
            Route::delete('experiences/{experience}', [ExperienceController::class, 'destroy'])->name('experiences.destroy');
            Route::post('experiences/{experience}/archive', [ExperienceController::class, 'archive'])->name('experiences.archive');
            Route::post('experiences/{experience}/unarchive', [ExperienceController::class, 'unarchive'])->name('experiences.unarchive');

            Route::post('experiences/{experience}/updates', [ExperienceUpdateController::class, 'store'])->name('experience-updates.store');
            Route::post('experience-updates/{experienceUpdate}', [ExperienceUpdateController::class, 'update'])->name('experience-updates.update');
            Route::delete('experience-updates/{experienceUpdate}', [ExperienceUpdateController::class, 'destroy'])->name('experience-updates.destroy');
            
            // PDF Import
            Route::post('experiences/import-pdf', [\App\Http\Controllers\ExperienceImportController::class, 'store'])->name('experiences.import-pdf');
            
            // Bulk AI Update
            Route::post('experiences/bulk-update-ai', [ExperienceController::class, 'bulkAiUpdate'])->name('experiences.bulk-update-ai');
        });
    });

    require __DIR__ . '/auth.php';
});

// Fallback to redirect non-localized URLs (e.g. /cv -> /id/cv)
Route::fallback(function (\Illuminate\Http\Request $request) {
    $path = $request->path();
    $segments = explode('/', $path);
    $firstSegment = $segments[0] ?? '';

    // If it's already localized or an excluded path, just 404
    $exclude = ['id', 'en', 'media', 'storage', 'telescope', 'up', 'horizon', 'sanctum', 'vendor', 'api'];
    if (in_array($firstSegment, $exclude)) {
        abort(404);
    }

    return redirect('/id/' . $path . ($request->getQueryString() ? '?' . $request->getQueryString() : ''));
});
