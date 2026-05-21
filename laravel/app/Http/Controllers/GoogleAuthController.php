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
use Illuminate\Support\Facades\Gate;

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

    public function handleGoogleCallback(Request $request)
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
            // Extract the email
            $email = $googleUser->getEmail();

            //check the whitelist table
            $whitelistEntry = DB::table('allowed_emails')
                ->where('email', $email)
                ->where('is_active', true)
                ->first();

            if (! $whitelistEntry) {
                // Redirect the user to a frontend route
                return redirect()->away(config('app.frontend_url') . '/unauthorized');
            }
            
            //wrapping database operations in transaction for security and consistency
            $authData = DB::transaction(function () use ($email, $googleUser, $whitelistEntry) {

                // Fetch or Create the User (DB Write 1)
                $user = User::firstOrCreate(
                    ['email' => $email],
                    [
                        'name' => $googleUser->getName(),
                        'google_id' => $googleUser->getId(),
                        'email_verified_at' => now(),
                    ]
                );

                // Sync organization id and role
                $user->update([
                    'organization_id' => $whitelistEntry->organization_id,
                    'role_id' => $whitelistEntry->role_id,
                    'google_id' => $googleUser->getId(), 
                ]);

                // load organization relationship to get slug for gate check
                $orgSlug = $user->load('organization')->organization?->slug;

                // check the user instance in the gate to check the user permission
                // if error occurs, changes above will not be committed in the db
                if (Gate::forUser($user)->denies('view-dashboard', $orgSlug)) {
                    // Throwing an exception forces the database to ROLLBACK
                    throw new \Exception('Unauthorized organization access.');
                }

                // Generate Sanctum token with expiry
                $tokenResult = $user->createToken('auth_token');
                $token = $tokenResult->plainTextToken;

                // Set token expiration (3 hours)
                $tokenResult->accessToken->expires_at = now()->addHours(3);
                $tokenResult->accessToken->save();
                
                // Return data out of the transaction block
                return [
                    'token' => $token,
                    'user' => $user
                ];
            });

            // Generate a temporary session ID
            $sessionId = Str::uuid()->toString();

            // Store user/token pair in cache for 2 minutes
            Cache::put("google_session:{$sessionId}", [
                'token' => $token,
                'user' => $user,
            ], now()->addMinutes(2));

            // Redirect to frontend with session_id
            return redirect()->to(config('app.frontend_url') . "/auth/callback?session_id={$sessionId}");
        }
        catch (\Throwable $e) {

        // Log actual error not shown to frontend
        Log::error('Google authentication failed', [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString(),
        ]);

        //if the error is unauthorized organization access, redirect to specific page
        if ($e->getMessage() === 'Unauthorized organization access.') {
            return redirect()->away(config('app.frontend_url') . '/unauthorized');
        }

        // Return dedicated error response to frontend
        return redirect()->away(config('app.frontend_url') . '/auth-error');
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
            'user'  => $data['user']->load(['role', 'organization'])
        ]);
    } catch (\Throwable $e) {
        Log::error('Session fetch failed', ['error' => $e->getMessage()]);
        return response()->json(['error' => 'Unexpected server error.'], 500);

    }
    }

}
