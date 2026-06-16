<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Organization;
use Illuminate\Support\Facades\Gate;
use App\Http\Requests\OrganizationRequest;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Builder;
use App\Http\Resources\OrganizationResource;

class OrganizationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
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
    public function store(OrganizationRequest $request)
    {
        try{
            
            return DB::transaction(function () use ($request) {

                //retrive the clean and validated data
                $validated = $request->validated();

                $organization = Organization::create($validated);

                return response()->json([
                    'message' => "Successfully created organization.",
                    'organization' => $organization
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
    public function update(OrganizationRequest $request, Organization $organization)
    {
        try{
            // Validate input
            $validated = $request->validated(); 

            // Update the DB
            
            $organization->update($validated);
        

            return response()->json([
                'message' => "Successfully updated {$organization->name}'s dashboard.",
                'organization' => $organization
            ]);

        } catch (Exception $e) {
            Log::error("Failed to update organization: " . $e->getMessage());
            return response()->json(['message' => 'Failed to update organization: ' . $e->getMessage()], 500);
        }
        
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Organization $organization)
    {
        try{
            $organization->delete();
            return response()->json(['message' => 'Organization deleted successfully.'],200);
        }
        catch(Exception $e){
            Log::error("Failed to delete organization: " . $e->getMessage());
            return response()->json(['message' => 'Failed to delete organization: ' . $e->getMessage()], 500);
        }
       
    }
}
