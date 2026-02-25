<?php

namespace App\Http\Controllers;

use App\Actions\GetLandingPageData;
use Inertia\Inertia;
use Inertia\Response;

class LandingController extends Controller
{
    public function index(GetLandingPageData $action): Response
    {
        return Inertia::render('Welcome/Index', $action->execute());
    }
}
