<?php

namespace App\Http\Controllers;

use App\Models\SiteProfile;
use App\Models\Education;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CvController extends Controller
{
    public function index(Request $request): Response
    {
        $lang = $request->query('lang', 'id');
        
        // Get the site owner (admin)
        $owner = \App\Models\User::where('is_admin', true)->first();
        if (!$owner) $owner = \App\Models\User::first();

        $profile = SiteProfile::first();
        $education = Education::orderBy('sort_order', 'asc')->get();
        
        // Fetch experiences with their updates
        $experiences = $owner ? $owner->experiences()
            ->with(['updates' => function ($query) {
                $query->orderBy('created_at', 'asc');
            }])
            ->orderBy('start_date', 'desc')
            ->get() : collect();

        return Inertia::render('CV/Index', [
            'profile' => $profile,
            'education' => $education,
            'experiences' => $experiences,
            'lang' => $lang,
        ]);
    }
}
