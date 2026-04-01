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
            \Illuminate\Support\Facades\URL::defaults(['locale' => $locale]);
            
            // Remove 'locale' from route parameters so it's not passed as the first argument to controller actions
            if ($request->route()) {
                $request->route()->forgetParameter('locale');
            }
            
            return $next($request);
        }

        // List of segments that should NOT be prefixed (e.g. storage, files, telescope)
        $exclude = ['storage', 'telescope', 'up', 'horizon', 'sanctum', 'vendor'];
        if (in_array($locale, $exclude)) {
            return $next($request);
        }

        // Redirect to default locale if missing
        $defaultLocale = 'id';
        app()->setLocale($defaultLocale);
        
        $path = $request->path();
        if ($path === '/') $path = '';
        
        return redirect('/' . $defaultLocale . '/' . $path . ($request->getQueryString() ? '?' . $request->getQueryString() : ''));
    }
}
