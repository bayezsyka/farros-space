<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ThreadPost extends Model
{
    /** @use HasFactory<\Database\Factories\ThreadPostFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'slug',
        'content',
        'image_url',
        'likes_count',
        'shares_count',
        'visibility',
        'allow_comments',
        'tags',
        'published_at',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'likes_count' => 'integer',
        'shares_count' => 'integer',
        'allow_comments' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function interactions()
    {
        return $this->hasMany(ThreadInteraction::class);
    }

    public function comments()
    {
        return $this->hasMany(ThreadComment::class);
    }
}
