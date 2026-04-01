<?php

namespace App\Jobs;

use App\Models\Experience;
use App\Services\GeminiService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class GenerateExperienceSummaryJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;
    public $backoff = [10, 30, 60];

    protected $experience;

    /**
     * Create a new job instance.
     */
    public function __construct(Experience $experience)
    {
        $this->experience = $experience;
    }

    /**
     * Execute the job.
     */
    public function handle(GeminiService $gemini): void
    {
        // 1. Ambil konten dengan batasan token (max 15 update terbaru, max 3000 karakter)
        $allContent = $this->experience->updates()
            ->latest()
            ->take(15)
            ->get()
            ->reverse()
            ->pluck('content')
            ->implode("\n");

        $limitedContent = Str::limit($allContent, 3000);

        if (empty($limitedContent)) {
            return;
        }

        // 2. Kirim ke Gemini API
        $summaryData = $gemini->generateCvSummary($limitedContent, $this->experience->role);

        if ($summaryData && isset($summaryData['id'], $summaryData['en'])) {
            $this->experience->update([
                'summary_id' => $summaryData['id'],
                'summary_en' => $summaryData['en'],
            ]);
            Log::info("AI Summary generated for Experience ID: {$this->experience->id}");
        } else {
            Log::warning("Gemini failed to generate summary for Experience ID: {$this->experience->id}");
            // Optional: Jika rate limit terdeteksi di Service, lempar exception buat memicu backoff/retry
            // throw new \Exception("AI Summary Generation Failed (Retry planned)");
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error("GenerateExperienceSummaryJob failed for Experience ID: {$this->experience->id}. Error: " . $exception->getMessage());
    }
}
