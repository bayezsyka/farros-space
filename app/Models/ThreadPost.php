<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ThreadPost extends Model
{
    /** @use HasFactory<\Database\Factories\ThreadPostFactory> */
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'content',
        'image_url',
        'likes_count',
        'shares_count',
        'visibility',
        'tags',
        'published_at',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'likes_count' => 'integer',
        'shares_count' => 'integer',
    ];

    public function interactions()
    {
        return $this->hasMany(ThreadInteraction::class);
    }

    public function comments()
    {
        return $this->hasMany(ThreadComment::class);
    }
}
