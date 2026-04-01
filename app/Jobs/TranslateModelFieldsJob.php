<?php

namespace App\Jobs;

use App\Services\GeminiService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class TranslateModelFieldsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;
    public $backoff = [10, 30, 60];

    protected $model;
    protected $fields;

    /**
     * Create a new job instance.
     * 
     * @param Model $model The eloquent model to translate
     * @param array $fields The fields that need translation (e.g. ['name', 'description'])
     */
    public function __construct(Model $model, array $fields)
    {
        $this->model = $model;
        $this->fields = $fields;
    }

    /**
     * Execute the job.
     */
    public function handle(GeminiService $gemini): void
    {
        $updates = [];

        foreach ($this->fields as $field) {
            $originalText = $this->model->{$field};
            
            if (empty($originalText)) continue;

            $translation = $gemini->translateContent($originalText);

            if ($translation && isset($translation['id'], $translation['en'])) {
                $updates["{$field}_id"] = $translation['id'];
                $updates["{$field}_en"] = $translation['en'];
            }
        }

        if (!empty($updates)) {
            $this->model->update($updates);
            Log::info("AI Translate fields successful for " . get_class($this->model) . " ID: " . $this->model->id);
        }
    }
}
