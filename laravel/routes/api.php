<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PowerBiController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\GoogleAuthController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

//auth routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');  

Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLink']);
Route::post('/reset-password', [PasswordResetController::class, 'resetPassword']);

Route::get('/auth/session/{sessionId}', [GoogleAuthController::class, 'fetchSessionData']);

// Protected route to get Power BI embed URL
Route::middleware('auth:sanctum')->get('/pbi-url', [PowerBiController::class, 'getEmbedUrl']);

