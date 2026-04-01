<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteProfile extends Model
{
    protected $fillable = [
        'full_name',
        'birth_place',
        'birth_date',
        'email',
        'phone',
        'address',
        'headline',
        'bio',
        'headline_id',
        'headline_en',
        'bio_id',
        'bio_en',
    ];
}
