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
        
        $validated = $request->validated(); //get the validated data from the request

        $allowedEmail = AllowedEmail::create($validated); //create a new record 

        $allowedEmail->load(['role', 'organization']);// eager load the related role and organization data

        return response()->json([
            'message' => "Successfully added allowed email.",
            'allowedEmail' => $allowedEmail
        ], 201);
  
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
    public function update(AllowedEmailsRequest $request, AllowedEmail $allowedEmail)
    {
        //
        $validated = $request->validated(); //get the validated data from the request

        $allowedEmail->update($validated); //update the record with the validated data

        $allowedEmail->load(['role', 'organization']);// eager load the related role and organization data

        return response()->json([
            'message' => "Successfully updated allowed email.",
            'allowedEmail' => $allowedEmail
        ], 200);
        
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AllowedEmail $allowedEmail)
    {
        //
        
        $allowedEmail->delete();
        return response()->json(['message' => "Successfully deleted allowed email."], 200);


    }
}
