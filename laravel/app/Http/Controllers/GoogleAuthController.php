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

            //retrieve the user from Users table 
            $user = User::where('email', $email)->first();

            if(!$user){
                return response()->json([
                    'message' => 'User not found in the system.'
                ], 404);
            }

            // Generate Sanctum token for authorized user
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
