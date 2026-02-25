<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ThreadComment extends Model
{
    protected $fillable = ['thread_post_id', 'user_id', 'content'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function threadPost()
    {
        return $this->belongsTo(ThreadPost::class);
    }
}
