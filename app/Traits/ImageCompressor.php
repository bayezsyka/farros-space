<?php

namespace App\Traits;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

trait ImageCompressor
{
    /**
     * Upload an image, compress it, and convert it to WebP automatically.
     * Sangat mudah digunakan kembali (reusable) di semua fitur tanpa konfigurasi.
     *
     * @param  UploadedFile  $file      File gambar dari request
     * @param  string        $directory Direktori tujuan (contoh: 'marketplace/items')
     * @param  int           $quality   Kualitas kompresi (0-100), default 80
     * @param  string        $disk      Storage disk (default 'public')
     * @return string|false             Path file yang disimpan atau false
     */
    public function compressAndStoreWebp(UploadedFile $file, string $directory, int $quality = 80, string $disk = 'public')
    {
        $extension = strtolower($file->getClientOriginalExtension());
        $filename = Str::uuid() . '.webp';
        $path = trim($directory, '/') . '/' . $filename;
        $imagePath = $file->getRealPath();

        // Pastikan GD library aktif, jika tidak fallback ke upload normal
        if (!function_exists('imagecreatefromjpeg') || !function_exists('imagewebp')) {
            return $file->store($directory, $disk);
        }

        $image = false;

        // Buka gambar berdasarkan format
        switch ($extension) {
            case 'jpg':
            case 'jpeg':
                $image = @imagecreatefromjpeg($imagePath);
                break;
            case 'png':
                $image = @imagecreatefrompng($imagePath);
                break;
            case 'gif':
                $image = @imagecreatefromgif($imagePath);
                break;
            case 'webp':
                $image = @imagecreatefromwebp($imagePath);
                break;
        }

        // Jika resolusi tinggi atau tidak support format awal, gunakan standar file save
        if (!$image) {
            return $file->store($directory, $disk);
        }

        // --- FIX ORIENTASI HP (EXIF) ---
        // Jika file asli adalah JPEG, cek apakah ada data orientasi EXIF
        if (in_array($extension, ['jpg', 'jpeg']) && function_exists('exif_read_data')) {
            $exif = @exif_read_data($imagePath);
            if ($exif && !empty($exif['Orientation'])) {
                $orientation = $exif['Orientation'];
                $rotatedImage = false;

                switch ($orientation) {
                    case 3: // Rotate 180 degrees
                        $rotatedImage = imagerotate($image, 180, 0);
                        break;
                    case 6: // Rotate 90 degrees clockwise
                        $rotatedImage = imagerotate($image, -90, 0);
                        break;
                    case 8: // Rotate 90 degrees counter-clockwise
                        $rotatedImage = imagerotate($image, 90, 0);
                        break;
                }

                if ($rotatedImage) {
                    imagedestroy($image); // Hapus source yang miring dari memory
                    $image = $rotatedImage; // Gunakan source yang sudah tegak
                }
            }
        }
        // ------------------------------

        // Tangani Transparansi (Untuk PNG dan GIF yang dikonversi ke WebP)
        if (in_array($extension, ['png', 'gif', 'webp'])) {
            $width = imagesx($image);
            $height = imagesy($image);
            $trueColorImage = imagecreatetruecolor($width, $height);
            
            // Jaga area transparan agar tidak menjadi hitam
            imagealphablending($trueColorImage, false);
            imagesavealpha($trueColorImage, true);
            $transparent = imagecolorallocatealpha($trueColorImage, 255, 255, 255, 127);
            imagefilledrectangle($trueColorImage, 0, 0, $width, $height, $transparent);
            
            // Salin gambar asli ke canvas truecolor
            imagecopyresampled($trueColorImage, $image, 0, 0, 0, 0, $width, $height, $width, $height);
            imagedestroy($image);
            $image = $trueColorImage;
        }

        // Mulai buffering dan kompres ke format WebP
        ob_start();
        if (!imagewebp($image, null, $quality)) {
            ob_end_clean();
            imagedestroy($image);
            return $file->store($directory, $disk);
        }
        $imageContent = ob_get_clean();
        
        // Hapus image resource dari memory
        imagedestroy($image);

        if (empty($imageContent)) {
            return $file->store($directory, $disk);
        }

        // Simpan file hasil kompresi via Laravel Storage (disk) dengan visibilitas public
        if (Storage::disk($disk)->put($path, $imageContent, 'public')) {
            return $path;
        }

        return false;
    }
}
