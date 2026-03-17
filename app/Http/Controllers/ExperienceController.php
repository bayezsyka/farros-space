<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Experience;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ExperienceController extends Controller
{
    public function index()
    {
        // Get the site owner (admin)
        $owner = User::where('is_admin', true)->first();
        if (!$owner) $owner = User::first();

        $experiences = $owner ? $owner->experiences()
            ->with(['updates' => function ($query) {
                $query->orderBy('created_at', 'asc');
            }])
            ->orderBy('start_date', 'desc')
            ->get() : collect();

        return Inertia::render('Experience/Index', [
            'experiences' => $experiences,
            'auth' => [
                'user' => Auth::user(),
                'canManage' => Auth::check() && Auth::user()->is_admin
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:work,organization,committee',
            'company_or_event_name' => 'required|string|max:255',
            'umbrella_organization' => 'nullable|string|max:255',
            'role' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        Auth::user()->experiences()->create($validated);

        return redirect()->back()->with('success', 'Experience created successfully.');
    }

    public function show($id)
    {
        // Get the site owner (admin)
        $owner = User::where('is_admin', true)->first();
        if (!$owner) $owner = User::first();

        $experience = Experience::with(['updates' => function ($query) {
            $query->orderBy('created_at', 'asc');
        }])
        ->where('user_id', $owner?->id)
        ->findOrFail($id);

        return Inertia::render('Experience/Show', [
            'experience' => $experience,
            'auth' => [
                'user' => Auth::user(),
                'canManage' => Auth::check() && Auth::user()->is_admin
            ]
        ]);
    }

    public function update(Request $request, Experience $experience)
    {
        if ($experience->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'type' => 'required|in:work,organization,committee',
            'company_or_event_name' => 'required|string|max:255',
            'umbrella_organization' => 'nullable|string|max:255',
            'role' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $experience->update($validated);

        return redirect()->back()->with('success', 'Experience updated successfully.');
    }

    public function destroy(Experience $experience)
    {
        if ($experience->user_id !== Auth::id()) {
            abort(403);
        }

        $experience->delete();

        return redirect()->route('experiences.index')->with('success', 'Experience deleted successfully.');
    }
}
