<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiService
{
    protected string $apiKey;
    protected string $baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

    public function __construct()
    {
        $this->apiKey = config('services.gemini.key');
    }

    public function generateCvSummary(string $content, string $role): ?array
    {
        if (empty($content)) {
            return null;
        }

        try {
            $prompt = "Berikut adalah daftar aktivitas atau update dari pengalaman kerja/organisasi sebagai '{$role}'.\n\n"
                . "Buatkan ringkasan profesional dalam 3 atau 4 poin bullet point yang fokus pada peran teknis/profesional tersebut. "
                . "Hapus konten yang bersifat santai, bercanda, atau kurang relevan dengan kualifikasi profesional CV.\n"
                . "Buatkan dalam dua versi bahasa: Indonesia dan Inggris.\n\n"
                . "Format output HARUS selalu JSON valid seperti ini:\n"
                . "{\n"
                . "  \"id\": \"• Poin 1\\n• Poin 2\\n• Poin 3\",\n"
                . "  \"en\": \"• Point 1\\n• Point 2\\n• Point 3\"\n"
                . "}\n\n"
                . "Konten:\n" . $content;

            $response = Http::post($this->baseUrl . '?key=' . $this->apiKey, [
                'contents' => [
                    [
                        'parts' => [
                            ['text' => $prompt]
                        ]
                    ]
                ],
                'generationConfig' => [
                    'temperature' => 0.4, // lower temperature for more consistent professional output
                    'response_mime_type' => 'application/json',
                ]
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $text = $data['candidates'][0]['content']['parts'][0]['text'] ?? null;
                if ($text) {
                    return json_decode($text, true);
                }
            }

            Log::error('Gemini API Error: ' . $response->body());
            return null;

        } catch (\Exception $e) {
            Log::error('Gemini Service Exception: ' . $e->getMessage());
            return null;
        }
    }
}
