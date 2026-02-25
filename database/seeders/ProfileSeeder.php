<?php

namespace Database\Seeders;

use App\Models\SiteProfile;
use App\Models\Education;
use Illuminate\Database\Seeder;

class ProfileSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Add Admin User
        \App\Models\User::create([
            'name' => 'Admin',
            'email' => 'a@a.com',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
        ]);

        SiteProfile::create([
            'full_name' => 'A Faidhullah Farros Basykailakh',
            'birth_place' => 'Brebes',
            'birth_date' => '2005-12-13',
            'email' => 'farrosy6@gmail.com',
            'phone' => '087721031021',
            'headline' => 'Fullstack Developer & Law Student',
            'bio' => 'A modular & reusable personal space built with Laravel + Inertia React.',
        ]);

        Education::create([
            'institution' => 'Universitas Diponegoro',
            'program_major' => 'S1 - Teknik Komputer',
            'start_year' => '2023',
            'end_year' => 'now',
            'sort_order' => 1,
        ]);

        Education::create([
            'institution' => 'Universitas Bima Sakapenta',
            'program_major' => 'S1 - Hukum',
            'start_year' => '2025',
            'end_year' => 'now',
            'sort_order' => 2,
        ]);
    }
}
