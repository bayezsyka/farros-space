<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ThreadInteraction extends Model
{
    use HasFactory;

    protected $fillable = [
        'thread_post_id',
        'interaction_type',
        'ip_address',
        'session_id',
    ];

    public function threadPost()
    {
        return $this->belongsTo(ThreadPost::class);
    }
}
