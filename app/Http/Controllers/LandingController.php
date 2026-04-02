<?php

namespace App\Http\Controllers;

use App\Actions\GetLandingPageData;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class LandingController extends Controller
{
    public function index(GetLandingPageData $action): Response
    {
        $locale = App::getLocale();
        $cacheKey = "landing:{$locale}";

        $data = Cache::remember($cacheKey, 300, function () use ($action) {
            return $action->execute();
        });

        return Inertia::render('Welcome/Index', $data);
    }
}
