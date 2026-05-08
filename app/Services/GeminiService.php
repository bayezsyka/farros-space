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

        $maxRetries = 2;
        $retryDelay = 2; // seconds

        for ($i = 0; $i <= $maxRetries; $i++) {
            try {
                $prompt = "Berikut adalah daftar aktivitas atau update dari pengalaman kerja/organisasi sebagai '{$role}'.\n\n"
                    . "Tugas: Buatkan ringkasan profesional yang terdiri dari MAKSIMAL 3 poin bullet point yang paling penting dan BERDAMPAK.\n"
                    . "Prinsip Penulisan:\n"
                    . "1. Gunakan kata kerja aksi yang kuat (misal: Mengoptimalkan, Merancang, Memimpin, Mengeksekusi).\n"
                    . "2. Fokus pada HASIL (Outcomes) daripada sekadar tugas (Duties).\n"
                    . "3. JANGAN gunakan data angka spekulatif (persentase/jumlah yang tidak pasti).\n"
                    . "4. Gunakan deskripsi KUALITATIF yang elegan (misal: 'Meningkatkan kecepatan respon sistem secara signifikan').\n"
                    . "5. Buatkan dalam dua versi bahasa: Indonesia (id) dan Inggris (en).\n\n"
                    . "Format output HARUS selalu JSON valid:\n"
                    . "{\n"
                    . "  \"id\": \"• Poin 1\\n• Poin 2\\n• Poin 3\",\n"
                    . "  \"en\": \"• Point 1\\n• Point 2\\n• Point 3\"\n"
                    . "}\n\n"
                    . "Konten:\n" . $content;

                $response = Http::timeout(30)->post($this->baseUrl . '?key=' . $this->apiKey, [
                    'contents' => [
                        [
                            'parts' => [
                                ['text' => $prompt]
                            ]
                        ]
                    ],
                    'generationConfig' => [
                        'temperature' => 0.4,
                        'response_mime_type' => 'application/json',
                    ]
                ]);

                if ($response->successful()) {
                    $json = $response->json();
                    $text = $json['candidates'][0]['content']['parts'][0]['text'] ?? null;
                    if ($text) {
                        // Clean up markdown code blocks if present
                        $text = preg_replace('/^```json\s*|\s*```$/i', '', trim($text));
                        return json_decode($text, true);
                    }
                }

                // Handle rate limit (429 Resource Exhausted)
                if ($response->status() === 429 && $i < $maxRetries) {
                    Log::warning("Gemini Rate Limit hit. Retrying in {$retryDelay}s... (Attempt " . ($i + 1) . ")");
                    sleep($retryDelay);
                    $retryDelay *= 2; // Exponential backoff
                    continue;
                }

                Log::error('Gemini API Error: ' . $response->body());
                return null;

            } catch (\Exception $e) {
                if ($i < $maxRetries) {
                    Log::warning("Gemini Service Error: {$e->getMessage()}. Retrying in {$retryDelay}s...");
                    sleep($retryDelay);
                    continue;
                }
                Log::error('Gemini Service Exception: ' . $e->getMessage());
                return null;
            }
        }
        return null;
    }

    public function generateEmptyCvSummary(string $role, string $company): ?array
    {
        $maxRetries = 2;
        $retryDelay = 2;

        for ($i = 0; $i <= $maxRetries; $i++) {
            try {
                $prompt = "Anda adalah pakar penulisan CV profesional SANGAT KREATIF.\n"
                    . "Tugas: Buatkan TEPAT 1 poin bullet-point ringkasan pekerjaan untuk peran '{$role}' di '{$company}'.\n"
                    . "KONTENT: Karena tidak ada detail kegiatan, Anda harus menggunakan data pasar/tren industri untuk peran tersebut agar terlihat sangat profesional dan meyakinkan.\n"
                    . "ATURAN PENTING:\n"
                    . "1. JANGAN gunakan data angka sama sekali (angka, persentase, dsb).\n"
                    . "2. Gunakan deskripsi VERBAL, KUALITATIF, dan ELEGAN.\n"
                    . "3. Gunakan kata kerja aksi yang kuat (misal: Mendeploy, Menangani, Menstandardisasi).\n"
                    . "Jangan gunakan pembuka membosankan seperti 'Bertanggung jawab untuk' atau 'Bertugas sebagai'. Langsung ke aksi dan tujuannya.\n"
                    . "Buatkan dalam dua versi bahasa: Indonesia (id) dan Inggris (en).\n\n"
                    . "Format output HARUS selalu JSON valid berbentuk seperti ini:\n"
                    . "{\n"
                    . "  \"id\": \"• [Satu kalimat aksi kreatif & konkrit dalam bahasa Indonesia]\",\n"
                    . "  \"en\": \"• [One creative & concrete action sentence in English]\"\n"
                    . "}\n";

                $response = Http::timeout(30)->post($this->baseUrl . '?key=' . $this->apiKey, [
                    'contents' => [
                        [
                            'parts' => [
                                ['text' => $prompt]
                            ]
                        ]
                    ],
                    'generationConfig' => [
                        'temperature' => 0.5,
                        'response_mime_type' => 'application/json',
                    ]
                ]);

                if ($response->successful()) {
                    $data = $response->json();
                    $text = $data['candidates'][0]['content']['parts'][0]['text'] ?? null;
                    if ($text) {
                        $text = preg_replace('/^```json\s*|\s*```$/i', '', trim($text));
                        return json_decode($text, true);
                    }
                }

                if ($response->status() === 429 && $i < $maxRetries) {
                    sleep($retryDelay);
                    $retryDelay *= 2;
                    continue;
                }

                Log::error('Gemini API Error (Empty Summary): ' . $response->body());
                return null;

            } catch (\Exception $e) {
                if ($i < $maxRetries) {
                    sleep($retryDelay);
                    continue;
                }
                Log::error('Gemini Service Exception: ' . $e->getMessage());
                return null;
            }
        }
        return null;
    }

    /**
     * Extraksi pengalaman dari PDF menggunakan Gemini API
     */
    public function extractExperienceFromPdf(string $filePath): ?array
    {
        if (!file_exists($filePath)) {
            Log::error("Gemini Service: File not found at {$filePath}");
            return null;
        }

        try {
            $base64Data = base64_encode(file_get_contents($filePath));
            
            $prompt = "Anda adalah asisten penulis konten karier profesional. Baca laporan magang/kerja (PDF) ini.\n\n"
                . "TUGAS UTAMA:\n"
                . "1. Ekstrak informasi dasar untuk metadata.\n"
                . "2. Dari laporan tersebut, susunlah 'threads' (minimal 5 item) yang sangat DETAIL dan NARRATIVE (bercerita). Ceritakan PROSES pembuatannya, tantangan yang dihadapi, dan bagaimana Anda mengerjakannya step-by-step. Hindari bahasa kaku seperti laporan formal, gunakan gaya bahasa yang enak dibaca seperti sedang bercerita tentang progres kerja.\n"
                . "3. Buatlah CV summary yang RINGKAS, profesional, dan to-the-point dalam bentuk MAKSIMAL 3 (TIGA) poin bullet point. Buat dalam 2 bahasa (ID & EN).\n"
                . "4. Abaikan informasi internal/rahasia perusahaan.\n\n"
                . "Keluarkan output WAJIB dalam format JSON valid dengan struktur persis seperti ini:\n"
                . "{\n"
                . "  \"metadata\": {\n"
                . "    \"company_or_event_name\": \"Nama Perusahaan\",\n"
                . "    \"role\": \"Posisi/Peran\",\n"
                . "    \"start_date\": \"YYYY-MM-DD\",\n"
                . "    \"end_date\": \"YYYY-MM-DD\",\n"
                . "    \"type\": \"work\"\n"
                . "  },\n"
                . "  \"threads\": [\n"
                . "    \"Cerita detail proses pekerjaan 1...\",\n"
                . "    \"Cerita detail proses pekerjaan 2...\"\n"
                . "  ],\n"
                . "  \"summary\": {\n"
                . "    \"id\": \"• Poin ringkas 1\\n• Poin ringkas 2\",\n"
                . "    \"en\": \"• Concise point 1\\n• Concise point 2\"\n"
                . "  }\n"
                . "}";

            $response = Http::timeout(60)->post($this->baseUrl . '?key=' . $this->apiKey, [
                'contents' => [
                    [
                        'parts' => [
                            ['text' => $prompt],
                            [
                                'inlineData' => [
                                    'mimeType' => 'application/pdf',
                                    'data' => $base64Data
                                ]
                            ]
                        ]
                    ]
                ],
                'generationConfig' => [
                    'temperature' => 0.4,
                    'response_mime_type' => 'application/json',
                ]
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $text = $data['candidates'][0]['content']['parts'][0]['text'] ?? null;
                if ($text) {
                    $extractedData = json_decode($text, true);
                    if (json_last_error() === JSON_ERROR_NONE) {
                        return $extractedData;
                    }
                    Log::error('Gemini Service: Invalid JSON in response: ' . $text);
                }
            }

            Log::error('Gemini API Error: ' . $response->body());
            return null;

        } catch (\Exception $e) {
            Log::error('Gemini Service Exception: ' . $e->getMessage());
            return null;
        }
    }

    public function translateContent(string $content): ?array
    {
        if (empty($content)) {
            return null;
        }

        $maxRetries = 2;
        $retryDelay = 1;

        for ($i = 0; $i <= $maxRetries; $i++) {
            try {
                $prompt = "Tugas: Deteksi apakah teks berikut dalam Bahasa Indonesia atau Bahasa Inggris. "
                    . "Kemudian, buatkan versi terjemahannya ke bahasa sebaliknya.\n\n"
                    . "ATURAN:\n"
                    . "1. Teks asli jangan dirubah sama sekali.\n"
                    . "2. Masukkan teks asli ke field yang sesuai (id atau en).\n"
                    . "3. Buatkan terjemahan yang akurat dan profesional ke field lainnya.\n"
                    . "4. Output HARUS selalu JSON valid.\n\n"
                    . "Contoh 1 (Jika input Indonesia):\n"
                    . "{\n"
                    . "  \"id\": \"[teks asli]\",\n"
                    . "  \"en\": \"[terjemahan inggris]\"\n"
                    . "}\n\n"
                    . "Contoh 2 (Jika input Inggris):\n"
                    . "{\n"
                    . "  \"id\": \"[terjemahan indonesia]\",\n"
                    . "  \"en\": \"[teks asli]\"\n"
                    . "}\n\n"
                    . "TEKS INPUT:\n" . $content;

                $response = Http::timeout(20)->post($this->baseUrl . '?key=' . $this->apiKey, [
                    'contents' => [
                        [
                            'parts' => [
                                ['text' => $prompt]
                            ]
                        ]
                    ],
                    'generationConfig' => [
                        'temperature' => 0.2,
                        'response_mime_type' => 'application/json',
                    ]
                ]);

                if ($response->successful()) {
                    $data = $response->json();
                    $text = $data['candidates'][0]['content']['parts'][0]['text'] ?? null;
                    if ($text) {
                        $text = preg_replace('/^```json\s*|\s*```$/i', '', trim($text));
                        return json_decode($text, true);
                    }
                }

                if ($response->status() === 429 && $i < $maxRetries) {
                    sleep($retryDelay);
                    $retryDelay *= 2;
                    continue;
                }

                Log::error('Gemini API Error (Translate): ' . $response->body());
                return null;

            } catch (\Exception $e) {
                if ($i < $maxRetries) {
                    sleep($retryDelay);
                    continue;
                }
                Log::error('Gemini Service Exception (Translate): ' . $e->getMessage());
                return null;
            }
        }
        return null;
    }
}
