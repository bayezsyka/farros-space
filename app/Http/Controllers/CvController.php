<?php

namespace App\Http\Controllers;

use App\Models\SiteProfile;
use App\Models\Education;
use Inertia\Inertia;
use Inertia\Response;

class CvController extends Controller
{
    public function index(): Response
    {
        $profile = SiteProfile::first();
        $education = Education::orderBy('sort_order', 'asc')->get();

        return Inertia::render('CV/Index', [
            'profile' => $profile,
            'education' => $education,
        ]);
    }
}
