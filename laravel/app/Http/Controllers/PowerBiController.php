<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PowerBiController extends Controller
{
    //
      /**
     * Return Power BI embed URL for authenticated users.
     */
    public function getEmbedUrl(Request $request)
    {
        //  Only authenticated users reach this point due to Sanctum middleware
        $powerBiUrl = 'https://app.powerbi.com/view?r=eyJrIjoiZmRiODdmMzgtZTk2ZS00MTQ1LTgyY2YtZmEyYmU2N2RkYTA5IiwidCI6IjdjZmY5YzA2LThmNGQtNDAwNi1iOWQwLWU4MWRjYWJjZDU1NyIsImMiOjEwfQ%3D%3D';

        return response()->json([
            'url' => $powerBiUrl,
        ]);
    }
}
