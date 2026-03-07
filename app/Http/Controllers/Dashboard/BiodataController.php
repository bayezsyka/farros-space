<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\SiteProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Traits\ImageCompressor;

class BiodataController extends Controller
{
    use ImageCompressor;
    public function index()
    {
        $profile = SiteProfile::first();

        return Inertia::render('Dashboard/Biodata', [
            'profile' => $profile
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'full_name' => 'required|string|max:255',
            'birth_place' => 'nullable|string|max:255',
            'birth_date' => 'nullable|date',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:15',
            'address' => 'nullable|string|max:500',
            'headline' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
            'avatar' => 'nullable|image|max:10240',
        ]);

        $profile = SiteProfile::first();

        if (!$profile) {
            $profile = new SiteProfile();
        }

        $data = $request->except('avatar');

        if ($request->hasFile('avatar')) {
            $path = $this->compressAndStoreWebp($request->file('avatar'), 'avatars');
            $data['avatar_url'] = '/storage/' . $path;

            if ($profile->avatar_url && str_contains($profile->avatar_url, '/storage/avatars/')) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete(str_replace('/storage/', '', $profile->avatar_url));
            }
        }

        $profile->fill($data);
        $profile->save();

        return redirect()->back()->with('success', 'Biodata updated successfully.');
    }
}
