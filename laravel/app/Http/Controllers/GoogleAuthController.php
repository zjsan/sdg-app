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

            $isAllowed = DB::table('allowed_emails')
                ->where('email', $email)
                ->where('is_active', true)
                ->exists();

            if (! $isAllowed) {
                return response()->json([
                    'message' => 'Access denied. Your account is not authorized to use this system.'
                ], 403);
            }

             $user = User::updateOrCreate(
                ['email' => $email],
                [
                    'name' => $googleUser->getName(),
                    'google_id' => $googleUser->getId(),
                    'email_verified_at' => now(),
                    'remember_token' => Str::random(10),
                ]
            );

            // Generate Sanctum token
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'Login successful.',
                'token' => $token,
                'user' => $user,
            ]);

       } catch (\Exception $e) {
            return response()->json([
                'message' => 'Google authentication failed.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

}
