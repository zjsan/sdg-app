<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AllowedEmail;
use App\Http\Requests\AllowedEmailsRequest;

class AllowedEmailController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
       return response()->json(AllowedEmail::with(['role','organization'])->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(AllowedEmailsRequest $request)
    {
        //
        try{
             $validated = $request->validated(); //get the validated data from the request

             $allowedEmail = AllowedEmail::create($validated); //create a new record 

             $allowedEmail->load(['role', 'organization']);// eager load the related role and organization data

             return response()->json([
                 'message' => "Successfully added allowed email.",
                 'allowedEmail' => $allowedEmail
             ], 201);
        }
        catch (Exception $e) {
            Log::error("Failed to add allowed email: " . $e->getMessage());
            return response()->json(['message' => 'Failed to add allowed email: ' . $e->getMessage()], 500);
        }   
    }

    /**
     * Display the specified resource.
     */
    public function show(AllowedEmail $allowedEmail)
    {
        //
        return response()->json($allowedEmail->load(['role', 'organization']), 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
        
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
