<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AllowedEmail;
use App\Http\Requests\AllowedEmailsRequest;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class AllowedEmailController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {   
        //
       return response()->json(AllowedEmail::with(['role','organization'])->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(AllowedEmailsRequest $request): JsonResponse
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
            Log::error("Failed to create allowed email: " . $e->getMessage());
            return response()->json(['message' => 'Failed to create allowed email: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(AllowedEmail $allowedEmail): JsonResponse  
    {
        //
        return response()->json($allowedEmail->load(['role', 'organization']), 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(AllowedEmailsRequest $request, AllowedEmail $allowedEmail): JsonResponse
    {
        $user = Auth::user(); //retrieve the currently authenticated user

        try{
            $validated = $request->validated(); //get the validated data from the request

            //check if the current authenticated user is trying to deactivate their own status
            if(isset($validated['is_active']) && !$validated['is_active']){
                
                //compare the email in the db and the authenticated user
                if(strtolower(trim($allowedEmail->email)) === strtolower(trim($user->email))){
                    return response()->json([
                        'message' => 'Security Violation: You are not permitted to deactivate your own administrative session.'
                    ], 403);
                }
            }

            $targetRole = Role::find($allowedEmail->role_id); //fetch the role associated with the allowed email record
            $isHighPrivilege = in_array(strtolower($targetRole->slug), ['admin', 'developer']); //check if the role is admin or developer

            if($isHighPrivilege){
                
                $willDeactivate = isset($validated['is_active']) && !$validated['is_active']; //check if the update is trying to deactivate the record
                $willChangeRole = isset($validated['role_id']) && $validated['role_id'] != $allowedEmail->role_id;

                if($willDeactivate || $willChangeRole){
                    $activeCount = AllowedEmail::where('role_id', $allowedEmail->role_id)
                                    ->where('is_active', true)
                                    ->count(); //count how many active records exist for this role

                    if($activeCount <= 1){
                        return response()->json([
                            'message' => "Security Violation: This record represents the last remaining active system execution environment for the role '{$targetRole->name}'. Deactivation or modification is blocked."
                        ], 422);
                    }
                }
            }

            $allowedEmail->update($validated); //update the record with the validated data

            $allowedEmail->load(['role', 'organization']);// eager load the related role and organization data

            return response()->json([
                'message' => "Successfully updated allowed email.",
                'allowedEmail' => $allowedEmail
            ], 200);
        }
        catch (Exception $e) {
            Log::error("Failed to update allowed email: " . $e->getMessage());
            return response()->json(['message' => 'Failed to update allowed email: ' . $e->getMessage()], 500);
        }     
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AllowedEmail $allowedEmail): JsonResponse
    {        
        $user = Auth::user(); //retrieve the currently authenticated user

        if(strtolower(trim($allowedEmail->email)) === strtolower(trim($user->email))){
            return response()->json([
                'message'=> 'Security Violation: Destruction of your own active whitelist record is strictly blocked.'
            ], 403);
        }

        $allowedEmail->delete();
        return response()->json(['message' => "Successfully deleted allowed email."], 200);


    }
}
