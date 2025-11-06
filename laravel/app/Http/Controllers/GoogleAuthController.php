<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str; 
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class GoogleAuthController extends Controller
{
   /**
     * Redirect the user to Google for authentication.
     */
    public function redirectToGoogle()
    {
        return Socialite::driver('google')
        ->stateless()
        // CRITICAL: Add the 'prompt' parameter to force Google to show the login/consent screen
        ->with(['prompt' => 'select_account']) // or 'consent'
        ->redirect();
    }

    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();

              // Extract the email
            $email = $googleUser->getEmail();

            //check the whitelist table
            try{
                 $isAllowed = DB::table('allowed_emails')
                ->where('email', $email)
                ->where('is_active', true)
                ->exists();

                if (! $isAllowed) {
                    // Redirect the user to a frontend route
                    return redirect()->away(env('FRONTEND_URL') . '/unauthorized');
                }
            } catch (\Throwable $e) {
                Log::error('Database error during whitelist check', ['error' => $e->getMessage()]);
                return response()->json([
                    'message' => 'Something went wrong verifying your access.'
                ], 500);
            }
          

            $user = User::firstOrCreate(
                ['email' => $email],
                [
                    'name' => $googleUser->getName(),
                    'google_id' => $googleUser->getId(),
                    'email_verified_at' => now(),
                ]
            );

            // Update Google ID if not yet stored
            if (empty($user->google_id)) {
                $user->google_id = $googleUser->getId();
                $user->save();
            }

            // Generate Sanctum token for authorized user
            $token = $user->createToken('auth_token')->plainTextToken;

            // Generate a temporary session ID
            $sessionId = Str::uuid()->toString();

            // Store user/token pair in cache for 2 minutes
            Cache::put("google_session:{$sessionId}", [
                'token' => $token,
                'user' => $user,
            ], now()->addMinutes(2));

            // Redirect to frontend with session_id
            return redirect()->to(env('FRONTEND_URL') . "/auth/callback?session_id={$sessionId}");
       } catch (\Throwable $e) {

        // Log actual error not shown to frontend
        Log::error('Google authentication failed', [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString(),
        ]);

        // Return dedicated error response to frontend
        return redirect()->away(env('FRONTEND_URL') . '/auth-error');
        }
    }

    // New endpoint for frontend to fetch token securely
    public function fetchSessionData($sessionId)
    {
        try {
        $data = Cache::pull("google_session:{$sessionId}");

        if (! $data) {
            return response()->json(['error' => 'Invalid or expired session.'], 404);
        }

        return response()->json([
            'message' => 'Login successful.',
            'token' => $data['token'],
            'user' => $data['user'],
        ]);
    } catch (\Throwable $e) {
        Log::error('Session fetch failed', ['error' => $e->getMessage()]);
        return redirect()->away(env('FRONTEND_URL') . '/auth-error');

    }
    }

}
