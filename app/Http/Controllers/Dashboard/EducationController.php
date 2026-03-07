<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Education;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EducationController extends Controller
{
    public function index()
    {
        $education = Education::orderBy('sort_order', 'asc')->orderBy('id', 'asc')->get();

        return Inertia::render('Dashboard/Education/Index', [
            'education' => $education,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'level'         => 'required|in:SD,SMP,SMA,SMK,D1,D2,D3,D4,S1,S2,S3,Lainnya',
            'institution'   => 'required|string|max:255',
            'program_major' => 'nullable|string|max:255',
            'start_year'    => 'required|string|max:10',
            'end_year'      => 'nullable|string|max:10',
            'sort_order'    => 'nullable|integer|min:0',
        ]);

        Education::create([
            'level'         => $request->level,
            'institution'   => $request->institution,
            'program_major' => $request->program_major ?: null,
            'start_year'    => $request->start_year,
            'end_year'      => $request->end_year ?: null,
            'sort_order'    => $request->sort_order ?? Education::max('sort_order') + 1,
        ]);

        return redirect()->back()->with('success', 'Data pendidikan berhasil ditambahkan.');
    }

    public function update(Request $request, Education $education)
    {
        $request->validate([
            'level'         => 'required|in:SD,SMP,SMA,SMK,D1,D2,D3,D4,S1,S2,S3,Lainnya',
            'institution'   => 'required|string|max:255',
            'program_major' => 'nullable|string|max:255',
            'start_year'    => 'required|string|max:10',
            'end_year'      => 'nullable|string|max:10',
            'sort_order'    => 'nullable|integer|min:0',
        ]);

        $education->update([
            'level'         => $request->level,
            'institution'   => $request->institution,
            'program_major' => $request->program_major ?: null,
            'start_year'    => $request->start_year,
            'end_year'      => $request->end_year ?: null,
            'sort_order'    => $request->sort_order ?? $education->sort_order,
        ]);

        return redirect()->back()->with('success', 'Data pendidikan berhasil diperbarui.');
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'required|integer|exists:education,id',
        ]);

        foreach ($request->ids as $index => $id) {
            Education::where('id', $id)->update(['sort_order' => $index]);
        }

        return redirect()->back()->with('success', 'Urutan pendidikan berhasil diperbarui.');
    }

    public function destroy(Education $education)
    {
        $education->delete();

        return redirect()->back()->with('success', 'Data pendidikan berhasil dihapus.');
    }
}
