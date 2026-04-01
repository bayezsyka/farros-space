<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Experience;
use App\Models\User;
use App\Jobs\GenerateExperienceSummaryJob;
use App\Jobs\TranslateModelFieldsJob;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ExperienceController extends Controller
{
    public function index()
    {
        // Get the site owner (admin)
        $owner = User::where('is_admin', true)->first();
        if (!$owner) $owner = User::first();

        $experiencesQuery = $owner ? $owner->experiences()
            ->with(['updates' => function ($query) {
                $query->orderBy('created_at', 'asc');
            }])
            ->orderBy('start_date', 'desc') : null;

        // If not admin, hide archived experiences
        if ($experiencesQuery && (!Auth::check() || !Auth::user()->is_admin)) {
            $experiencesQuery->where('is_archived', false);
        }

        $experiences = $experiencesQuery ? $experiencesQuery->get() : collect();

        return Inertia::render('Experience/Index', [
            'experiences' => $experiences,
            'auth' => [
                'user' => Auth::user(),
                'canManage' => Auth::check() && Auth::user()->is_admin
            ]
        ]);
    }

    public function archive(Experience $experience)
    {
        if ($experience->user_id !== Auth::id()) {
            abort(403);
        }

        $experience->update(['is_archived' => true]);

        return redirect()->back()->with('success', 'Experience archived successfully.');
    }

    public function unarchive(Experience $experience)
    {
        if ($experience->user_id !== Auth::id()) {
            abort(403);
        }

        $experience->update(['is_archived' => false]);

        return redirect()->back()->with('success', 'Experience unarchived successfully.');
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

        $exp = Auth::user()->experiences()->create($validated);
        
        TranslateModelFieldsJob::dispatch($exp, ['role', 'company_or_event_name']);

        return redirect()->back()->with('success', 'Experience created successfully.');
    }

    public function show(Experience $experience)
    {
        // Get the site owner (admin)
        $owner = User::where('is_admin', true)->first();
        if (!$owner) $owner = User::first();

        // Ensure the experience belongs to the owner
        if ($owner && $experience->user_id !== $owner->id) {
            abort(404);
        }

        $experience->load(['updates' => function ($query) {
            $query->orderBy('created_at', 'asc');
        }]);

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

        TranslateModelFieldsJob::dispatch($experience, ['role', 'company_or_event_name']);

        // Hanya dispatch job jika role berubah
        if ($experience->wasChanged('role')) {
            GenerateExperienceSummaryJob::dispatch($experience);
        }

        return redirect()->back()->with('success', 'Experience updated successfully.');
    }

    public function generateSummary(Experience $experience)
    {
        if ($experience->user_id !== Auth::id()) {
            abort(403);
        }

        GenerateExperienceSummaryJob::dispatch($experience);

        return redirect()->back()->with('success', 'AI Summary generation has been added to the queue. Please wait a moment and refresh.');
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
