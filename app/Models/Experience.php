<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function updates()
    {
        return $this->hasMany(ExperienceUpdate::class);
    }

    public function updateCvSummary()
    {
        $allContent = $this->updates()->orderBy('created_at', 'asc')->pluck('content')->implode("\n");
        $summaryData = app(\App\Services\GeminiService::class)->generateCvSummary($allContent, $this->role);
        
        if ($summaryData && isset($summaryData['id'], $summaryData['en'])) {
            $this->update([
                'summary_id' => $summaryData['id'],
                'summary_en' => $summaryData['en'],
            ]);
        }
    }
}
