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
use Illuminate\Database\Eloquent\Builder;
use App\Models\Role;

class AllowedEmailController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {   
       
        $defaultPerPage = 10;

        //validate per page parameter
        $perPage = (int) $request->query('per_page', $defaultPerPage);

        //check if it is integer and greater than 0, and set a maximum limit of 100 to prevent abuse
        if ($perPage <= 0 || $perPage > 100) {
            $perPage = $defaultPerPage; // fallback to default 
        }

        $search = $request->query('search');//fetch the search query parameter in the url for server-side searching

        //fetch the allowed emails with their related role and organization data
        $query = AllowedEmail::query()->with(['role', 'organization']);

        //server-side searching by email, role name, or organization name
        if (!empty($search)) {
            $query->where(function (Builder $subQuery) use ($search) {
                $subQuery->where('email', 'LIKE', "%{$search}%")
                    
                    // Query relation records cleanly via isolated subqueries
                    ->orWhereHas('role', function (Builder $roleQuery) use ($search) {
                        $roleQuery->where('name', 'LIKE', "%{$search}%");
                    })
                    ->orWhereHas('organization', function (Builder $orgQuery) use ($search) {
                        $orgQuery->where('name', 'LIKE', "%{$search}%");
                    });
            });
        }  
        
        //apply default ordering by creation date, showing oldest entries first
        $query->orderBy('allowed_emails.created_at', 'asc');

        $allowedEmails = $query->paginate($perPage);

        // return the paginated colllection of emails 
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
                'message' => "Successfully added a new record to the whitelist.",
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

            //Check if the current authenticated user is trying to demote their own role
            if (isset($validated['role_id']) && (int)$validated['role_id'] !== (int)$allowedEmail->role_id) {
            
                // 1. Is this record the logged-in user?
                if (strcasecmp(trim($allowedEmail->email), trim($user->email)) === 0) {
                    
                    // 2. Fetch the slug of the NEW role they are requesting to see if it's a 'viewer'
                    // (Alternatively, you can check against a specific integer ID if preferred)
                    $newRole = Role::find($validated['role_id']);
                    
                    if ($newRole && strtolower(trim($newRole->slug)) === 'viewer') {
                        return response()->json([
                            'message' => 'Security Violation: You are not permitted to demote your own account or strip your administrative privileges.'
                        ], 403);
                    }
                }
            }
            

            //Prevent Orphaned Roles via Database Lock
            $currentIsHigh = in_array(strtolower($allowedEmail->role?->slug ?? ''), ['admin', 'developer']);
            
            $willDeactivate = isset($validated['is_active']) && !$validated['is_active'];
            $willChangeRole = isset($validated['role_id']) && (int)$validated['role_id'] !== (int)$allowedEmail->role_id;

            // Secure the transaction if they are high privilege and abandoning it
            if (($currentIsHigh && ($willDeactivate || $willChangeRole))) {
                
                $canProceed = DB::transaction(function () use ($allowedEmail, $validated, $willChangeRole) {

                    if($allowedEmail->is_active === false){
                        return true; //if the record is already inactive, we can allow role changes without counting active records
                    }
                    
                    // Lock the old role to ensure we aren't leaving it orphaned
                    $activeOldRoleCount = AllowedEmail::activeByRole($allowedEmail->role_id)
                        ->lockForUpdate()
                        ->count();

                    // If moving away from a high-privilege role, ensure it wasn't the last active one
                    return $activeOldRoleCount > 1;
                });

                if (!$canProceed && $currentIsHigh && ($willDeactivate || $willChangeRole)) {
                    return response()->json([
                        'message' => "Security Violation: This record represents the last remaining active system execution environment for this role."
                    ], 422);
                }
            }

            // Execute update
            $allowedEmail->update($validated);

            //Synchronize the change to the active users table if the user exists
            $correspondingUser = User::where('email', $allowedEmail->email)->first();

            if ($correspondingUser) {
                $userUpdatePayload = [];
                
                if (isset($validated['role_id'])) {
                    $userUpdatePayload['role_id'] = $validated['role_id'];
                }
                if (isset($validated['organization_id'])) {
                    $userUpdatePayload['organization_id'] = $validated['organization_id'];
                }
                
                if (!empty($userUpdatePayload)) {
                    $correspondingUser->update($userUpdatePayload);
                }

                //If role or status changed, terminate their active token sessions
                if ($willChangeRole || $willDeactivate) {
                    $correspondingUser->tokens()->delete();
                }
            }

            //Force-reload all relations to drop stale in-memory model cache
            $allowedEmail->load(['role', 'organization']); 


            return response()->json([
                'message' => "Successfully updated the database record for this whitelist entry.",
                'allowedEmail' => new AllowedEmailResource($allowedEmail)
            ], 200);

        } catch (Exception $e) {
            Log::error("Failed to update allowed email: " . $e->getMessage(), [
                'id' => $allowedEmail->id,
                'payload' => $request->except(['password', 'password_confirmation']),
                'exception' => $e
            ]);
            return response()->json(['message' => 'An internal server error occurred while updating the record.'], 500);
        }
    }


    /**
     * Remove the specified resource from storage.
     * Note: the delete operation is following the soft deletion pattern.
     * In the organization table when an organization is deleted, its following children will also be deleted
     */
    public function destroy(AllowedEmail $allowedEmail): JsonResponse
    {        
        $user = Auth::user(); 

        try {
            // Prevent self-deletion
            if (strcasecmp(trim($allowedEmail->email), trim($user->email)) === 0) {
                return response()->json([
                    'message'=> 'Security Violation: Destruction of your own active whitelist record is strictly blocked.'
                ], 403);
            }

            $isHighPrivilege = in_array(strtolower($allowedEmail->role?->slug ?? ''), ['admin', 'developer']);

            // Structural Integrity Check (Only critical if the target record is currently active)
            if ($isHighPrivilege && $allowedEmail->is_active) {

                $canProceed = DB::transaction(function () use ($allowedEmail) {
                    // Scope this count to the specific organization to avoid global mixing
                    return AllowedEmail::where('organization_id', $allowedEmail->organization_id)
                        ->activeByRole($allowedEmail->role_id)
                        ->lockForUpdate()
                        ->count() > 1;
                });

                if (!$canProceed) {
                    return response()->json([
                        'message' => "Security Violation: Deletion aborted. This user is the sole active account possessing system scope for this organization."
                    ], 422);
                }
            }

            // Execution 
            $allowedEmail->delete();
            
            return response()->json(['message' => "Successfully deleted the whitelist entry."], 200);

        } catch (Exception $e) {
            Log::error("Failed to delete allowed email: " . $e->getMessage(), [
                'id' => $allowedEmail->id,
                'email' => $allowedEmail->email,
                'exception' => $e
            ]);

            return response()->json([
                'message' => 'An internal server error occurred while attempting to delete the record.'
            ], 500);
        }
    }
}
