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
        //
        // Any authenticated user can likely see the list, 
        // but only if they are an Admin or Developer
        return response()->json(Organization::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
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
    public function update(Request $request, string $id)
    {
        //
        // 1. Authorize via Gate
        Gate::authorize('manage-pbi-links');

        // 2. Validate input
        $validated = $request->validate([
            'pbi_embed_id' => 'required|string|min:10',
        ]);

        // 3. Update the DB
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
