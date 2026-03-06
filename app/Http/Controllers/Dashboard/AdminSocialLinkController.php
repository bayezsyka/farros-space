<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\SocialLink;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminSocialLinkController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard/SocialLinks/Index', [
            'socialLinks' => SocialLink::latest()->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'platform' => 'required|string|max:50',
            'url' => 'required|url|max:255',
            'username' => 'nullable|string|max:100',
            'is_active' => 'boolean'
        ]);

        SocialLink::create($validated);

        return redirect()->back()->with('success', 'Tautan media sosial berhasil ditambahkan.');
    }

    public function update(Request $request, SocialLink $socialLink)
    {
        $validated = $request->validate([
            'platform' => 'required|string|max:50',
            'url' => 'required|url|max:255',
            'username' => 'nullable|string|max:100',
            'is_active' => 'boolean'
        ]);

        $socialLink->update($validated);

        return redirect()->back()->with('success', 'Tautan media sosial berhasil diperbarui.');
    }

    public function destroy(SocialLink $socialLink)
    {
        $socialLink->delete();

        return redirect()->back()->with('success', 'Tautan media sosial berhasil dihapus.');
    }
}
