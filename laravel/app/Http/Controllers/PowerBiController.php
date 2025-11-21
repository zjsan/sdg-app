<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class PowerBiController extends Controller
{
    //
      /**
     * Return Power BI embed URL for authenticated users.
     */
    public function getEmbedUrl(Request $request)
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
                 $powerBiUrl = "https://https://app.powerbi.com/view?r=eyJrIjoiZGZhMjAxMDEtMGM2Mi00NGYwLWIwMzQtZmRhOGFjMGE3MDdhIiwidCI6IjdjZmY5YzA2LThmNGQtNDAwNi1iOWQwLWU4MWRjYWJjZDU1NyIsImMiOjEwfQ%3D%3D";
                return response()->json([   
                    'url' => $powerBiUrl, 
                    'message' => 'External user access granted.'
                ]);
            }

        } catch (\Throwable $e) {
            Log::error('Error fetching Power BI URL', ['error' => $e->getMessage()]);
            return response()->json([
                'message' => 'Fetching dashboard url error.'
            ], 401);
        }

        
    }
}
