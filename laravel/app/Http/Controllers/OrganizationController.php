<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Organization;
use Illuminate\Support\Facades\Gate;

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
    public function store(Request $request, Organization $organization)
    {
        //retrive the clean and validated data
        $validated = $request->validated();

        $organization = Organization::create($validated);

        return response()->json([
            'message' => "Successfully created organization.",
            'organization' => $organization
        ], 201);

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
    public function update(Request $request, Organization $organization)
    {
        //
        // Authorize via Gate
        Gate::authorize('manage-pbi-links');

        // Validate input
        $validated = $request->validate([
            'pbi_embed_id' => 'required|string|min:10',
        ]);

        // Update the DB
        $organization->update($validated);

        return response()->json([
            'message' => "Successfully updated {$organization->name}'s dashboard.",
            'organization' => $organization
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
