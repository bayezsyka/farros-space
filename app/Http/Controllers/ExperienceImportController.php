<?php

namespace App\Http\Controllers;

use App\Models\Experience;
use App\Models\ExperienceUpdate;
use App\Services\GeminiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ExperienceImportController extends Controller
{
    protected GeminiService $geminiService;

    public function __construct(GeminiService $geminiService)
    {
        $this->geminiService = $geminiService;
    }

    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:pdf|max:10240',
        ]);

        $file = $request->file('file');
        $tempPath = $file->store('temp');
        $fullPath = Storage::disk('local')->path($tempPath);

        try {
            $extractedData = $this->geminiService->extractExperienceFromPdf($fullPath);

            if (!$extractedData) {
                return back()->with('error', 'Gagal mengekstrak data dari PDF. Silakan coba lagi nanti.');
            }

            DB::transaction(function () use ($extractedData) {
                $metadata = $extractedData['metadata'];
                $summary = $extractedData['summary'] ?? ['id' => null, 'en' => null];
                $threads = $extractedData['threads'] ?? [];

                $experience = Experience::create([
                    'user_id' => Auth::id(),
                    'type' => $metadata['type'] ?? 'work',
                    'company_or_event_name' => $metadata['company_or_event_name'],
                    'role' => $metadata['role'],
                    'start_date' => $metadata['start_date'],
                    'end_date' => $metadata['end_date'],
                    'summary_id' => $summary['id'],
                    'summary_en' => $summary['en'],
                ]);

                foreach ($threads as $content) {
                    ExperienceUpdate::create([
                        'experience_id' => $experience->id,
                        'content' => $content,
                    ]);
                }
            });

            // Cleanup
            Storage::delete($tempPath);

            return back()->with('success', 'Pengalaman berhasil diimpor dari PDF menggunakan AI!');

        } catch (\Exception $e) {
            Log::error('Experience Import Error: ' . $e->getMessage());
            Storage::delete($tempPath);
            return back()->with('error', 'Terjadi kesalahan sistem saat memproses PDF.');
        }
    }
}
