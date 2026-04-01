<?php

namespace App\Console\Commands;

use App\Models\Experience;
use Illuminate\Console\Command;

class RegenerateExperienceSummaries extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'experience:summarize {experience_id?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Regenerate AI summaries for all experiences or a specific one';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $id = $this->argument('experience_id');

        if ($id) {
            $experience = Experience::findOrFail($id);
            $this->info("Summarizing experience: {$experience->role} at {$experience->company_or_event_name}");
            $experience->updateCvSummary();
            $this->info("Done!");
            return;
        }

        $experiences = Experience::all();
        $this->info("Summarizing " . $experiences->count() . " experiences...");

        foreach ($experiences as $experience) {
            $this->info(" - Processing: {$experience->role} at {$experience->company_or_event_name}");
            $experience->updateCvSummary();
        }

        $this->info("All summaries updated!");
    }
}
