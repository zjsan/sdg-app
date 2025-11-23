<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\URL;

class PowerBiController extends Controller
{
    //
      /**
     * Return Power BI embed URL for authenticated users.
     */
    public function generateSignedUrl(Request $request)
    {
        $domain_whitelist = 'mmsu.edu.ph';

        try{

            //fetch email from users table
            $user = $request->user();

            //
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

            $signedUrl = URL::signedRoute('pbi.frame', [
                'embedId' => $embedId
            ], now()->addSeconds(60)); //60-second validity


            return response()->json([
                'signedUrl' => $signedUrl,
                'expiresIn' => 60
            ]);
            
        } catch (\Throwable $e) {
            Log::error('Error fetching Power BI URL', ['error' => $e->getMessage()]);
            return response()->json([
                'message' => 'Fetching dashboard url error.'
            ], 401);
        }

        
    }
}
