<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str; 

class GoogleAuthController extends Controller
{
   /**
     * Redirect the user to Google for authentication.
     */
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();

              // Extract the email
            $email = $googleUser->getEmail();

            //check the whitelist table
            $isAllowed = DB::table('allowed_emails')
                ->where('email', $email)
                ->where('is_active', true)
                ->exists();

            if (! $isAllowed) {
                return response()->json([
                    'message' => 'Access denied. Your account is not authorized to use this system.'
                ], 403);
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

            // ✅ Redirect back to frontend with token + user
            $redirectUrl = env('FRONTEND_URL') . '/auth/callback'
            . '?token=' . urlencode($token)
            . '&user=' . urlencode(json_encode($user));

            return redirect($redirectUrl);

       } catch (\Exception $e) {
            return response()->json([
                'message' => 'Google authentication failed.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

}
