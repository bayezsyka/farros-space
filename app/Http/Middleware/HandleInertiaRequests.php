<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'locale' => app()->getLocale(),
            'translations' => $this->getTranslations(),
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
            'social_links' => \Illuminate\Support\Facades\Cache::remember('social_links', 86400, function () {
                return \App\Models\SocialLink::where('is_active', true)->select('id', 'platform', 'url', 'username')->get();
            }),
            'site_profile' => \Illuminate\Support\Facades\Cache::remember('site_profile', 86400, function () {
                return \App\Models\SiteProfile::first();
            }),
        ];
    }

    protected function getTranslations()
    {
        $locale = app()->getLocale();
        $path = base_path("lang/$locale.json");

        if (file_exists($path)) {
            return json_decode(file_get_contents($path), true);
        }

        return [];
    }
}
