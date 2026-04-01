<?php

namespace App\Jobs;

use App\Models\ExperienceUpdate;
use App\Services\GeminiService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class TranslateExperienceUpdateJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;
    public $backoff = [10, 30, 60];

    protected $update;

    /**
     * Create a new job instance.
     */
    public function __construct(ExperienceUpdate $update)
    {
        $this->update = $update;
    }

    /**
     * Execute the job.
     */
    public function handle(GeminiService $gemini): void
    {
        $translation = $gemini->translateContent($this->update->content);

        if ($translation && isset($translation['id'], $translation['en'])) {
            $this->update->update([
                'content_id' => $translation['id'],
                'content_en' => $translation['en'],
            ]);
            Log::info("AI Translation generated for Experience Update ID: {$this->update->id}");
        } else {
            Log::warning("Gemini failed to translate Experience Update ID: {$this->update->id}");
        }
    }
}
