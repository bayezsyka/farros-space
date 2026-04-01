<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Experience extends Model
{
    protected $fillable = [
        'user_id',
        'type',
        'company_or_event_name',
        'umbrella_organization',
        'role',
        'start_date',
        'end_date',
        'summary_id',
        'summary_en',
        'slug',
        'is_archived',
        'role_id',
        'role_en',
        'company_or_event_name_id',
        'company_or_event_name_en',
    ];

    public function getRouteKeyName()
    {
        return 'slug';
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($experience) {
            if (empty($experience->slug)) {
                $experience->slug = static::generateUniqueSlug($experience->company_or_event_name . '-' . $experience->role);
            }
        });

        static::updating(function ($experience) {
            if ($experience->isDirty(['company_or_event_name', 'role']) && empty($experience->slug)) {
                $experience->slug = static::generateUniqueSlug($experience->company_or_event_name . '-' . $experience->role);
            }
        });
    }

    protected static function generateUniqueSlug($title)
    {
        $slug = Str::slug($title);
        $count = static::where('slug', 'like', "{$slug}%")->count();
        return $count ? "{$slug}-{$count}" : $slug;
    }

    public function getSummaryContent(): string
    {
        $allContent = $this->updates()
            ->latest()
            ->take(15)
            ->get()
            ->reverse()
            ->pluck('content')
            ->implode("\n");

        return Str::limit($allContent, 3000);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function updates()
    {
        return $this->hasMany(ExperienceUpdate::class);
    }
}
