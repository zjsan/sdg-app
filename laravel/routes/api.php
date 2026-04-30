<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PowerBiController;
use App\Http\Controllers\GoogleAuthController;
use App\Http\Controllers\OrganizationController;

Route::get('/user', function (Request $request) {
    return $request->user()->load('role');//eager loading the role relationship to include role data in the response
})->middleware('auth:sanctum');

//auth routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');  

Route::get('/auth/session/{sessionId}', [GoogleAuthController::class, 'fetchSessionData']);

// Protected route to get Power BI embed URL
Route::middleware('auth:sanctum')->get('/pbi', [PowerBiController::class, 'generateSignedUrl']);

Route::middleware(['auth:sanctum'])->group(function () {
    
    // Developer-only routes
    Route::middleware(['can:manage-pbi-links'])->group(function () {

        // routes for GET, POST, PUT, DELETE /api/organizations
        Route::apiResource('organizations', OrganizationController::class);
        
    });
    
});