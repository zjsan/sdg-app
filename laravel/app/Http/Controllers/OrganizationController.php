<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Organization;
use App\Models\AllowedEmail;
use Illuminate\Support\Facades\Gate;
use App\Http\Requests\OrganizationRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Builder;
use App\Http\Resources\OrganizationResource;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Auth;
use Exception;

class OrganizationController extends Controller
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

        $query = Organization::query()->withCount('allowedEmails'); // eager load the count of allowed emails for each organization

        if(!empty($search)){
            $query->where(function (Builder $subQuery) use ($search){
                $subQuery->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('slug', 'LIKE', "%{$search}%");
            });
        }

        $query->orderBy('organizations.created_at', 'asc');

        $organizations = $query->paginate($perPage);

        return OrganizationResource::collection($organizations)->response();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(OrganizationRequest $request): JsonResponse
    {
        try{
            
            return DB::transaction(function () use ($request) {

                //retrive the clean and validated data
                $validated = $request->validated();

                $organization = Organization::create($validated);

                return response()->json([
                    'message' => "Successfully created organization.",
                    'organization' => new OrganizationResource($organization)
                ], 201);
            });
        }
        catch (Exception $e) {
            Log::error("Failed to create organization: " . $e->getMessage());
            return response()->json(['message' => 'Failed to create organization: ' . $e->getMessage()], 500);
        }
      
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(OrganizationRequest $request, Organization $organization): JsonResponse
    {
        try{
            // Validate input
            $validated = $request->validated(); 

            // Update the DB
            $organization->update($validated);
        

            return response()->json([
                'message' => "Successfully updated {$organization->name}'s dashboard.",
                'organization' => new OrganizationResource($organization)
            ]);

        } catch (Exception $e) {
            Log::error("Failed to update organization: " . $e->getMessage());
            return response()->json(['message' => 'Failed to update organization: ' . $e->getMessage()], 500);
        }
        
    }

    /**
     * Remove the specified resource from storage. The function is using a Cascade Soft Deletion to remove its children in the 
     * whitelist table. While, the operation is following the architecture of soft deletion instead of hard deletion
     */
    
    public function destroy(Organization $organization): JsonResponse
    {

        $user = Auth::user(); //get the currently login user

        try{

            //check the database and fetch the organization that has active whitelist entries
            DB::transaction(function () use ($organization, $user){
                
                  
                //  prevention to restrict self deletion of organization
                //  lock the organization's high-privilege whitelist records during this assessment
                // fetch ALL whitelist entries for this organization (Active and Inactive)
                $allWhitelists = AllowedEmail::where('organization_id', $organization->id)
                    ->with('role') //eager loaded the role column
                    ->lockForUpdate() //prevent race conditions
                    ->get();

                //check if the current user belongs to the organization being deleted
                $currentUserRecord = $allWhitelists->first(function ($allowedEmail) use ($user) {
                    return strcasecmp(trim($allowedEmail->email), trim($user->email)) === 0;
                });

                //throw an error if self-deletion
                if ($currentUserRecord) {
                    throw new Exception('SelfDeletionViolation', 403);
                }

                // Count how many high privilege records exist inside this specific target organization
                //adjust the role for new roles in the future
                $targetHighPrivilegeRecords = $allWhitelists->filter(function ($allowedEmail) {
                    $isHighPrivilege = in_array(strtolower($allowedEmail->role?->slug ?? ''), ['admin', 'developer']);
                    return $isHighPrivilege && $allowedEmail->is_active;
                });

                if($targetHighPrivilegeRecords->count() > 0){

                    //loop through each high-privellege record inside the target organization to verify global system counts
                    foreach($targetHighPrivilegeRecords as $targetRecord){
                        $globalCount = AllowedEmail::activeByRole($targetRecord->role_id)->count();

                        //if the user is the last remaining manager of that role in the entire syste, abort the operation
                        if($globalCount <= 1){
                            throw new Exception('ActiveManagementViolation', 422);
                        }
                    }
                }

                

                // cascade soft-delete ALL remaining records (inactive admins & low-privilege entries)
                AllowedEmail::where('organization_id', $organization->id)->delete();
                $organization->delete(); //triggers a soft deletion in db

            });

            return response()->json([
                'status' => 'success',
                'message' => 'Organization deactivated and removed from active views successfully.'
            ], 200);
        }
        catch (Exception $e) {

            // Handle custom domain exceptions thrown inside the transaction mapping http responses
            if ($e->getMessage() === 'SelfDeletionViolation') {
                return response()->json([
                    'message' => 'Security Violation: Deactivating an organization associated with your own active session is strictly blocked.'
                ], 403);
            }

            if ($e->getMessage() === 'ActiveManagementViolation') {
                return response()->json([
                    'message' => 'Deletion Aborted: This organization still contains active administrators or developers. Please deactivate or reassign these users before deleting the organization.'
                ], 422);
            }

            Log::error("Failed to safely delete organization: " . $e->getMessage(), [
                'organization_id' => $organization->id,
                'user_id' => $user?->id,
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'An internal server error occurred while attempting to safely delete the organization.'
            ], 500);
        }   
    }

    // backend logic for the archive tab of the soft delete function 
    // need to create the UI workflow for this
    //for quick emergency restore run : php artisan tinker -> App\Models\Organization::withTrashed()->where('name', 'CHED')->restore();
    public function archived()
    {
        // Fetch ONLY organizations that have been soft deleted
        $archivedOrgs = Organization::onlyTrashed()->get();
        
        return response()->json([
            'data' => $archivedOrgs
        ], 200);
    }

    public function restore($id)
    {
        // Find the record even if it's trashed, and revive it
        $organization = Organization::withTrashed()->findOrFail($id);
        $organization->restore();

        return response()->json([
            'status' => 'success',
            'message' => "{$organization->name} has been successfully restored."
        ], 200);
    }
}


