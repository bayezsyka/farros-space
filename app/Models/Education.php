<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Education extends Model
{
    protected $fillable = [
        'level',
        'institution',
        'program_major',
        'start_year',
        'end_year',
        'sort_order',
    ];
}
