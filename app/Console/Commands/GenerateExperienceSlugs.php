<?php

namespace App\Console\Commands;

use App\Models\Experience;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

class GenerateExperienceSlugs extends Command
{
    protected $signature = 'experience:slugs';
    protected $description = 'Generate unique slugs for all existing experiences';

    public function handle()
    {
        $experiences = Experience::whereNull('slug')->get();
        $this->info("Found " . $experiences->count() . " experiences without slugs.");

        foreach ($experiences as $experience) {
            $baseSlug = Str::slug($experience->company_or_event_name . '-' . $experience->role);
            $slug = $baseSlug;
            $count = 1;

            while (Experience::where('slug', $slug)->exists()) {
                $slug = "{$baseSlug}-{$count}";
                $count++;
            }

            $experience->update(['slug' => $slug]);
            $this->info(" - Generated slug: {$slug}");
        }

        $this->info("All slugs generated!");
    }
}
