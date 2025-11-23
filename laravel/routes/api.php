<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PowerBiController;
use App\Http\Controllers\GoogleAuthController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

//auth routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');  

Route::get('/auth/session/{sessionId}', [GoogleAuthController::class, 'fetchSessionData']);

// Protected route to get Power BI embed URL
Route::middleware('auth:sanctum')->get('/pbi', [PowerBiController::class, 'generateSignedUrl']);

