<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExperienceUpdate extends Model
{
    protected $fillable = [
        'experience_id',
        'content',
        'image_path',
        'content_id',
        'content_en',
    ];

    public function experience()
    {
        return $this->belongsTo(Experience::class);
    }
}
