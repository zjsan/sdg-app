<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Organization;
use App\Models\Role;
use Illuminate\Http\JsonResponse;

class LookupController extends Controller
{
    /**
     * Fetch all active tenant organizations and static system roles.
     */
    public function getFormDependencies(): JsonResponse
    {
        return response()->json([
            'organizations' => Organization::select('id', 'name')->orderBy('name')->get(),
            'roles' => Role::select('id', 'name', 'slug')->get()
        ], 200);
    }
}
