<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\MarketplaceItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use App\Traits\ImageCompressor;
use App\Models\SiteProfile;
use App\Models\FotoDetailItem;

class AdminMarketplaceController extends Controller
{
    use ImageCompressor;

    public function index(): Response
    {
        $items = MarketplaceItem::latest()->get();
        $profile = SiteProfile::first();

        return Inertia::render('Dashboard/Marketplace/Index', [
            'items' => $items,
            'waNumber' => $profile?->phone ?? '',
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Dashboard/Marketplace/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'          => 'required|string|max:255',
            'image'         => 'nullable|image|max:10240',
            'image_cropped' => 'nullable|image|max:5120',
            'status'        => 'required|in:baru,bekas',
            'description'   => 'nullable|string',
            'price'         => 'required|numeric|min:0',
            'foto_details'   => 'nullable|array',
            'foto_details.*' => 'image|max:10240',
        ]);

        // Store original image (full resolution)
        if ($request->hasFile('image')) {
            $path = $this->compressAndStoreWebp($request->file('image'), 'marketplace');
            $validated['image_path'] = Storage::disk('public')->url($path);
        }

        // Store cropped 1:1 image (for collage)
        if ($request->hasFile('image_cropped')) {
            $croppedPath = $this->compressAndStoreWebp($request->file('image_cropped'), 'marketplace_cropped');
            $validated['image_cropped_path'] = Storage::disk('public')->url($croppedPath);
        }

        // Generate unique slug from name
        $slug = Str::slug($validated['name']);
        $originalSlug = $slug;
        $count = 1;
        while (MarketplaceItem::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $count++;
        }
        $validated['slug'] = $slug;

        // Remove helper key not in fillable
        unset($validated['image_cropped']);
        unset($validated['foto_details']);

        $item = MarketplaceItem::create($validated);

        if ($request->hasFile('foto_details')) {
            foreach ($request->file('foto_details') as $foto) {
                $path = $this->compressAndStoreWebp($foto, 'marketplace_details');
                $item->fotoDetailItems()->create([
                    'foto_path' => Storage::disk('public')->url($path),
                ]);
            }
        }

        return redirect()->route('dashboard.marketplace.index')->with('message', 'Item created successfully.');
    }

    public function edit(MarketplaceItem $marketplaceItem): Response
    {
        $marketplaceItem->load('fotoDetailItems');
        return Inertia::render('Dashboard/Marketplace/Edit', [
            'item' => $marketplaceItem,
        ]);
    }

    public function update(Request $request, MarketplaceItem $marketplaceItem)
    {
        $validated = $request->validate([
            'name'          => 'required|string|max:255',
            'image'         => 'nullable|image|max:10240',
            'image_cropped' => 'nullable|image|max:5120',
            'status'        => 'required|in:baru,bekas',
            'description'   => 'nullable|string',
            'price'         => 'required|numeric|min:0',
            'foto_details'   => 'nullable|array',
            'foto_details.*' => 'image|max:10240',
        ]);

        // Store original image (full resolution)
        if ($request->hasFile('image')) {
            // Delete old original image
            if ($marketplaceItem->image_path) {
                Storage::disk('public')->delete(str_replace(Storage::disk('public')->url(''), '', $marketplaceItem->image_path));
            }
            $path = $this->compressAndStoreWebp($request->file('image'), 'marketplace');
            $validated['image_path'] = Storage::disk('public')->url($path);
        }

        // Store cropped 1:1 image (for collage)
        if ($request->hasFile('image_cropped')) {
            // Delete old cropped image
            if ($marketplaceItem->image_cropped_path) {
                Storage::disk('public')->delete(str_replace(Storage::disk('public')->url(''), '', $marketplaceItem->image_cropped_path));
            }
            $croppedPath = $this->compressAndStoreWebp($request->file('image_cropped'), 'marketplace_cropped');
            $validated['image_cropped_path'] = Storage::disk('public')->url($croppedPath);
        }

        // Regenerate slug if name changed
        if ($validated['name'] !== $marketplaceItem->name) {
            $slug = Str::slug($validated['name']);
            $originalSlug = $slug;
            $count = 1;
            while (MarketplaceItem::where('slug', $slug)->where('id', '!=', $marketplaceItem->id)->exists()) {
                $slug = $originalSlug . '-' . $count++;
            }
            $validated['slug'] = $slug;
        }

        // Remove helper key not in fillable
        unset($validated['image_cropped']);
        unset($validated['foto_details']);

        $marketplaceItem->update($validated);

        if ($request->hasFile('foto_details')) {
            foreach ($request->file('foto_details') as $foto) {
                $path = $this->compressAndStoreWebp($foto, 'marketplace_details');
                $marketplaceItem->fotoDetailItems()->create([
                    'foto_path' => Storage::disk('public')->url($path),
                ]);
            }
        }

        return redirect()->route('dashboard.marketplace.index')->with('message', 'Item updated successfully.');
    }

    public function destroy(MarketplaceItem $marketplaceItem)
    {
        $publicDisk = Storage::disk('public');
        if ($marketplaceItem->image_path) {
            $publicDisk->delete(str_replace($publicDisk->url(''), '', $marketplaceItem->image_path));
        }
        if ($marketplaceItem->image_cropped_path) {
            $publicDisk->delete(str_replace($publicDisk->url(''), '', $marketplaceItem->image_cropped_path));
        }

        foreach ($marketplaceItem->fotoDetailItems as $detail) {
            if ($detail->foto_path) {
                $publicDisk->delete(str_replace($publicDisk->url(''), '', $detail->foto_path));
            }
        }

        $marketplaceItem->delete();

        return redirect()->route('dashboard.marketplace.index')->with('message', 'Item deleted successfully.');
    }

    public function destroyFotoDetail(FotoDetailItem $fotoDetailItem)
    {
        if ($fotoDetailItem->foto_path) {
            Storage::disk('public')->delete(str_replace(Storage::disk('public')->url(''), '', $fotoDetailItem->foto_path));
        }
        $fotoDetailItem->delete();

        return back()->with('message', 'Detail photo deleted successfully.');
    }
}
