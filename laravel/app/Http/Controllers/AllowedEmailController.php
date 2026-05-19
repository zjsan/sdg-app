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
        $validated = $request->validated();




        

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
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
