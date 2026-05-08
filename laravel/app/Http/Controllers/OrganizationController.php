<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Organization;
use Illuminate\Support\Facades\Gate;
use App\Http\Requests\StoreOrganizationRequest;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class OrganizationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //fetch the contents of the organization table 
        return response()->json(Organization::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOrganizationRequest $request)
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
    public function update(StoreOrganizationRequest $request, Organization $organization)
    {
        try{
            // Validate input
            $validated = $request->validated(); 

            // Update the DB
            
           $updateData = [
                'name' => $validated['name'],
                'pbi_embed_id' => $validated['pbi_embed_id']
            ];

            $organization->update($updateData);

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
        $organization->delete();
        return response()->json(['message' => 'Organization deleted successfully.'],200);
    }
}
