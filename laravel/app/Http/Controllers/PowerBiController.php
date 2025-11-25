<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Cache;

class PowerBiController extends Controller
{
    //
      /**
     * Return Power BI embed URL for authenticated users.
     */
    public function generateSignedUrl(Request $request)
    {
        $domain_whitelist = 'mmsu.edu.ph';
        $urlLifespan = 3600;// 1 hour in seconds
        $user = $request->user(); //fetch email from users table
        $userID = $user->id;//fetch user id from users table

        try{    

            if (! $user || ! $user->email) {
                return response()->json(['message' => 'User not authenticated.'], 401);
            }
            
            //Check if email domain is in the whitelist
            //If yes, return the Power BI embed URL for mmsu users
            //Else return the Power BI embed URL for external users
            if(Str::endsWith($user->email, $domain_whitelist)){
                //  Only authenticated users reach this point due to Sanctum middleware
                $embedId = env('POWER_BI_MMSU_EMBED_ID');
                $message = 'MMSU user access granted.';
            
            }
            else{
                $embedId = env('POWER_BI_EXTERNAL_EMBED_ID');
                $message = 'External user access granted.';
            }

             // Generate one-time token
            $token = Str::uuid()->toString();

            // Store embedId and user id in cache for 1 hr
            Cache::put("pbi_embed_$token", [
                'embedId' => $embedId,
                'userId' => $userID
            ], $urlLifespan);
   

            $signedUrl = URL::signedRoute('pbi.frame', [
                'token' => $token
            ], now()->addSeconds($urlLifespan)); 


            return response()->json([
                'signedUrl' => $signedUrl,
                'expiresIn' => $urlLifespan,
                'message' => $message
            ]);

        } catch (\Throwable $e) {
            Log::error('Error fetching Power BI URL', ['error' => $e->getMessage()]);
            return response()->json([
                'message' => 'Fetching dashboard url error.'
            ], 401);
        }

        
    }

    public function serveIframe(Request $request)
    {
        // Validate the signed URL
        if (! $request->hasValidSignature()) {
            abort(403, 'Signed URL expired or tampered.');
        }

        $user = $request->user();
        $userID = $user->id;

        $token = $request->query('token'); //retrive token from query parameter of url
        $data = Cache::get("pbi_embed_$token"); // Retrieve token payload from cache       

        if (! $data) {
            abort(403, 'Invalid or expired token.');
        }

        $tokenUserId = $data['userId'];

        //critical check that the token belongs to the current user
        if (!$user || $userID !== $tokenUserId) {
            abort(403, 'Token does not belong to this user.');
        }

        // All checks passed, proceed to redirect to Power BI embed URL
        $embedId = $data['embedId']; 
        $baseUrl = env('POWER_BI_BASE_URL');
        
        // delete token to prevent reuse
        Cache::forget("pbi_embed_$token");
        return redirect($baseUrl . $embedId);
    }
}
