<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AllowedEmail;
use App\Http\Requests\AllowedEmailsRequest;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\AllowedEmailResource;
use Illuminate\Support\Facades\DB;

class AllowedEmailController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {   
       // Use pagination to protect server memory. Default to 15 per page.
        $allowedEmails = AllowedEmail::with(['role', 'organization'])
            ->latest()
            ->paginate(request()->query('per_page', 15));
        
        // Collection helper automatically formats paginated responses  
        return AllowedEmailResource::collection($allowedEmails)->response();
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
                'allowedEmail' => new AllowedEmailResource($allowedEmail)
            ], 201);
        }
        catch (Exception $e) {
           // Log the exact error for debugging, but keep the API response safe
            Log::error("Failed to create allowed email: " . $e->getMessage(), [
                'payload' => $request->except(['password']),
                'exception' => $e
            ]);

            return response()->json([
                'message' => 'An internal server error occurred while creating the record.'
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(AllowedEmail $allowedEmail): JsonResponse  
    {
        // Ensure relations are loaded cleanly
        $allowedEmail->loadMissing(['role', 'organization']);

        return response()->json(new AllowedEmailResource($allowedEmail), 200);
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
                if (strcasecmp(trim($allowedEmail->email), trim($user->email)) === 0){
                    return response()->json([
                        'message' => 'Security Violation: You are not permitted to deactivate your own administrative session.'
                    ], 403);
                }
            }

            //Prevent Orphaned Roles via Database Lock
            $isHighPrivilege = in_array(strtolower($allowedEmail->role?->slug ?? ''), ['admin', 'developer']); //check if the role is admin or developer

            if($isHighPrivilege){
                
                $willDeactivate = isset($validated['is_active']) && !$validated['is_active']; //check if the update is trying to deactivate the record
                $willChangeRole = isset($validated['role_id']) && (int)$validated['role_id'] !== (int)$allowedEmail->role_id; //check if the update is trying to change the role to another role

                if($willDeactivate || $willChangeRole){

                    $canProceed = DB::transaction(function () use ($allowedEmail) {
                        $activeCount = AllowedEmail::activeByRole($allowedEmail->role_id)

                            ->lockForUpdate()//prevent selected rows from being modified by other transactions until this transaction is complete
                            ->count();

                        return $activeCount > 1;
                    });

                    if(!$canProceed){
                        return response()->json([
                            'message' => "Security Violation: This record represents the last remaining active system execution environment for the role '{$allowedEmail->role->name}'."
                        ], 422);
                    }
                }
            }

            $allowedEmail->update($validated); //update the record with the validated data

            $allowedEmail->load(['organization']);// eager load the related organization data, role is already eager loaded in the model

            return response()->json([
                'message' => "Successfully updated allowed email.",
                'allowedEmail' => $allowedEmail
            ], 200);
        }
        catch (Exception $e) {
            Log::error("Failed to update allowed email: " . $e->getMessage());
            return response()->json(['message' => 'An internal server error occurred while updating the record.'], 500);
        }     
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AllowedEmail $allowedEmail): JsonResponse
    {        
        $user = Auth::user(); //retrieve the currently authenticated user

        //prevent users from deleting their own active whitelist record
        if (strcasecmp(trim($allowedEmail->email), trim($user->email)) === 0){
            return response()->json([
                'message'=> 'Security Violation: Destruction of your own active whitelist record is strictly blocked.'
            ], 403);
        }

        
        $isHighPrivillege = in_array(strtolower($allowedEmail->role?->slug ?? ''), ['admin', 'developer']);

        //prevent deleting the last active admin/developer only if target is currently active
        if($isHighPrivillege && $allowedEmail->is_active){

            $canProceed = DB::transaction(function () use ($allowedEmail){
                $activeCount = AllowedEmail::activeByRole($allowedEmail->role_id)
                ->lockForUpdate()
                ->count();

                return $activeCount > 1;
            });

            if (!$canProceed) {
                return response()->json([
                    'message' => "Security Violation: Deletion aborted. This user is the sole active account possessing '{$allowedEmail->role->name}' system scope."
                ], 422);
            }
        }

        $allowedEmail->delete();
        return response()->json(['message' => "Successfully deleted allowed email."], 200);


    }
}
