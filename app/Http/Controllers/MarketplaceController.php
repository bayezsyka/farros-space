<?php

namespace App\Http\Controllers;

use App\Models\MarketplaceItem;
use Inertia\Inertia;
use Inertia\Response;

class MarketplaceController extends Controller
{
    public function index(): Response
    {
        $items = MarketplaceItem::latest()->get();

        return Inertia::render('Marketplace/Index', [
            'items' => $items,
        ]);
    }

    public function show(MarketplaceItem $marketplaceItem): Response
    {
        $marketplaceItem->load('fotoDetailItems');
        return Inertia::render('Marketplace/Show', [
            'item' => $marketplaceItem,
        ]);
    }
}
