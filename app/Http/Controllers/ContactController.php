<?php

namespace App\Http\Controllers;

use App\Contracts\ContentRepositoryInterface;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    public function index(ContentRepositoryInterface $repository): Response
    {
        return Inertia::render('Contact/Index', [
            'profile' => $repository->getSiteProfile(),
            'education' => $repository->getEducation(),
        ]);
    }
}
