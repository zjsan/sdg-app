<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

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
            $email = DB::table('users')->select('email')->get();
            
            //Check if email domain is in the whitelist
            //If yes, return the Power BI embed URL for mmsu users
            //Else return the Power BI embed URL for external users
            if(Str::contains($email, $domain_whitelist)){
                //  Only authenticated users reach this point due to Sanctum middleware
                $powerBiUrl = "https://app.powerbi.com/view?r=eyJrIjoiZmRiODdmMzgtZTk2ZS00MTQ1LTgyY2YtZmEyYmU2N2RkYTA5IiwidCI6IjdjZmY5YzA2LThmNGQtNDAwNi1iOWQwLWU4MWRjYWJjZDU1NyIsImMiOjEwfQ%3D%3D";

                return response()->json([
                    'url' => $powerBiUrl,
                ]);
            }
            else{
                //https://app.powerbi.com/view?r=eyJrIjoiNzZhNzAxMTQtYmQ4YS00ZTFiLTllMTgtNzgwMzQyMWFkOTc2IiwidCI6IjdjZmY5YzA2LThmNGQtNDAwNi1iOWQwLWU4MWRjYWJjZDU1NyIsImMiOjEwfQ%3D%3D
                 $powerBiUrl = "https://app.powerbi.com/view?r=eyJrIjoiNzZhNzAxMTQtYmQ4YS00ZTFiLTllMTgtNzgwMzQyMWFkOTc2IiwidCI6IjdjZmY5YzA2LThmNGQtNDAwNi1iOWQwLWU4MWRjYWJjZDU1NyIsImMiOjEwfQ%3D%3D";
                return response()->json([
                    'url' => $powerBiUrl, 
                ]);
            }

        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Fetching dashboard url error.'
            ], 401);
        }

        
    }
}
