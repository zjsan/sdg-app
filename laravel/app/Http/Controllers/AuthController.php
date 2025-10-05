<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request; 
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{

    /**
     * Handle login request
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'username' => ['required' ],
            'password' => ['required'],
        ]);

          // 2. Find the user by the 'username' field
        $user = User::where('username', $credentials['username'])->first();

        if (! $user || ! Hash::check($request->password, $user->password)) 
        {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        //$request->session()->regenerate(); // prevent session fixation    
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
        return response()->json(['message' => 'Logged out.']);
    }
}
