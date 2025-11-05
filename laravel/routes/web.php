<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GoogleAuthController;

//Google OAuth Routes
Route::get('/auth/google/redirect', [GoogleAuthController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [GoogleAuthController::class, 'handleGoogleCallback']);
Route::get('/auth/session/{sessionId}', [GoogleAuthController::class, 'fetchSessionData']);

Route::get('/{any}', function () {
    return view('welcome'); 
})->where('any', '[\/\w\.-]*');
