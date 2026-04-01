<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\ExperienceUpdate;
use App\Models\Experience;
use App\Jobs\TranslateExperienceUpdateJob;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class ExperienceUpdateController extends Controller
{
    public function store(Request $request, Experience $experience)
    {
        if ($experience->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'content' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('experience-updates', 'public');
            $validated['image_path'] = $path;
        }

        $update = $experience->updates()->create($validated);
        
        // Dispatch translation job
        TranslateExperienceUpdateJob::dispatch($update);

        return redirect()->back()->with('success', 'Update added successfully.');
    }

    public function update(Request $request, ExperienceUpdate $experienceUpdate)
    {
        if ($experienceUpdate->experience->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'content' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($experienceUpdate->image_path) {
                Storage::disk('public')->delete($experienceUpdate->image_path);
            }
            
            $path = $request->file('image')->store('experience-updates', 'public');
            $validated['image_path'] = $path;
        }

        $experienceUpdate->update($validated);
        
        // Dispatch translation job
        TranslateExperienceUpdateJob::dispatch($experienceUpdate);

        return redirect()->back()->with('success', 'Update updated successfully.');
    }

    public function destroy(ExperienceUpdate $experienceUpdate)
    {
        if ($experienceUpdate->experience->user_id !== Auth::id()) {
            abort(403);
        }

        $experience = $experienceUpdate->experience;

        if ($experienceUpdate->image_path) {
            Storage::disk('public')->delete($experienceUpdate->image_path);
        }

        $experienceUpdate->delete();

        return redirect()->back()->with('success', 'Update deleted successfully.');
    }
}
