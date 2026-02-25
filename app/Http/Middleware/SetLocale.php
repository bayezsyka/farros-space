<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $locale = $request->segment(1);

        if (in_array($locale, ['id', 'en'])) {
            app()->setLocale($locale);
        } else {
            // Force Indonesian for any route without a language prefix (Admin/Dashboard/Auth)
            $locale = 'id';
            app()->setLocale($locale);
        }

        \Illuminate\Support\Facades\URL::defaults(['locale' => $locale]);

        return $next($request);
    }
}
