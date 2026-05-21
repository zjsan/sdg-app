<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request; 
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{

    //helper function toi track login attempts
    protected function throttleKey(Request $request)
    {
        return Str::lower($request->input('login')).'|'.$request->ip();
    }

    /**
     * Handle login request
     */
    public function login(Request $request)
    {
        //Step 1: validate input
        $request->validate([
            'login' => 'required|string|max:255', // can be email or username
            'password' => 'required|string|min:8',
        ]);

        //Step2: generates a unique key for the login attempt  
        $key = $this->throttleKey($request);

        // Step 3: Check if blocked
        //default attempt is 5 
        if (RateLimiter::tooManyAttempts($key, 5)) {
            $seconds = RateLimiter::availableIn($key);
            return response()->json([
                'message' => "Too many attempts. Try again in {$seconds} seconds."
            ], 429);
        }

        // Step 4: if input is email or username
        $loginField = filter_var($request->login, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';

        // Step 5: Find the user by the 'username' field
        $user = User::where($loginField, $request->login)->first();

        // Step 6: Check password   
        if (! $user || ! Hash::check($request->password, $user->password)) 
        {
             // after failed attempt:
            RateLimiter::hit($key, 60*10); // block for 10 minutes after limit
            $attemptsLeft = RateLimiter::remaining($key, 5);
            
            return response()->json(['message' => $attemptsLeft <= 1
                ? 'Invalid credentials. Account will be locked after one more failed attempt for 10 minutes.'
                : 'Invalid credentials.',
            'attempts_left' => $attemptsLeft], 401);
           
        }

        // successful login -> clear attempts
        RateLimiter::clear($key);

        // Get the authenticated user
        // Create a Sanctum token   
        $token = $user->createToken('api-token')->plainTextToken;

        // Return both token and user info
        return response()->json([
        'message' => 'Logged in successfully',
        'token'   => $token,
        'user'    => [
            'id'       => $user->id,
            'username' => $user->username,
            'name'     => $user->name,
        ],
    ]);
    }

     /**
     * Handle logout
     */
    public function logout(Request $request)
    {
        try {
        $user = $request->user();

        if ($user) {
            // Revoke the token that was used to authenticate the current request
            $user->currentAccessToken()->delete();

            Log::info('User logged out successfully.', ['user_id' => $user->id]);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Successfully logged out and token revoked.'
        ], 200);

        } catch (\Throwable $e) {
            Log::error('Logout operation failed.', [
                'error' => $e->getMessage(),
                'user_id' => $request->user()?->id
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred during logout.'
            ], 500);
        }
    }
}
