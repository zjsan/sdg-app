<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request; 
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;

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
        $request->validate([
            'login' => 'required|string|max:255', // can be email or username
            'password' => 'required|string|min:8',
        ]);

        //generates a unique key for the login attempt  
        $key = $this->throttleKey($request);

        // Step 1: Check if blocked
        //default attempt is 5 
        if (RateLimiter::tooManyAttempts($key, 5)) {
            $seconds = RateLimiter::availableIn($key);
            return response()->json([
                'message' => "Too many attempts. Try again in {$seconds} seconds."
            ], 429);
        }

        // Detect if input is email or username
        $loginField = filter_var($request->login, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';

        // 2. Find the user by the 'username' field
        $user = User::where($loginField, $request->login)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) 
        {
             // after failed attempt:
            RateLimiter::hit($key, 60*15); // block for 15 minutes after limit

            return response()->json(['message' => 'Invalid credentials'], 401);
           
        }

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
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out and token revoked.']);
    }
}
