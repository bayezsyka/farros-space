<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExperienceUpdate extends Model
{
    protected $fillable = [
        'experience_id',
        'content',
        'image_path',
    ];

    public function experience()
    {
        return $this->belongsTo(Experience::class);
    }
}
