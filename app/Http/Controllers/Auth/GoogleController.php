<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;

class GoogleController extends Controller
{
    public function redirectToGoogle(Request $request)
    {
        $redirectTo = $request->query('redirect', url()->previous());
        if (Str::contains($redirectTo, ['auth/google', 'login', 'register'])) {
            $redirectTo = route('landing');
        }
        session(['google_redirect_to' => $redirectTo]);

        return Socialite::driver('google')->redirect();
    }

    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();

            $user = User::updateOrCreate([
                'email' => $googleUser->email,
            ], [
                'name' => $googleUser->name,
                'google_id' => $googleUser->id,
                'avatar' => $googleUser->avatar,
                'password' => bcrypt(Str::random(16)),
            ]);

            Auth::login($user, true);

            $redirectTo = session()->pull('google_redirect_to', route('landing'));

            // Re-save session explicitly to ensure it's persisted before redirect
            session()->save();

            return redirect($redirectTo);
        } catch (\Exception $e) {
            Log::error('Google Login Error: ' . $e->getMessage());
            return redirect(route('login'))->with('error', 'Gagal login: ' . $e->getMessage());
        }
    }
}
