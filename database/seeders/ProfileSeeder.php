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
        \App\Models\User::updateOrCreate([
            'email' => 'farrosy6@gmail.com',
        ], [
            'name' => 'Farros',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'is_admin' => true,
        ]);

        SiteProfile::updateOrCreate([
            'email' => 'farrosy6@gmail.com',
        ], [
            'full_name' => 'A Faidhullah Farros Basykailakh',
            'birth_place' => 'Brebes',
            'birth_date' => '2005-12-13',
            'phone' => '087721031021',
            'headline' => 'Fullstack Developer & Law Student',
            'bio' => 'A modular & reusable personal space built with Laravel + Inertia React.',
        ]);

        Education::updateOrCreate([
            'institution' => 'Universitas Diponegoro',
            'program_major' => 'S1 - Teknik Komputer',
        ], [
            'start_year' => '2023',
            'end_year' => 'now',
            'sort_order' => 1,
        ]);

        Education::updateOrCreate([
            'institution' => 'Universitas Bima Sakapenta',
            'program_major' => 'S1 - Hukum',
        ], [
            'start_year' => '2025',
            'end_year' => 'now',
            'sort_order' => 2,
        ]);
    }
}
