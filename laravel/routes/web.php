<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GoogleAuthController;
use App\Http\Controllers\PowerBiController;

//Google OAuth Routes
Route::get('/auth/google/redirect', [GoogleAuthController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [GoogleAuthController::class, 'handleGoogleCallback']);

//handle iframe request for Power BI link
Route::get('/pbi-frame', [PowerBiController::class, 'serveIframe'])
    ->name('pbi.frame');

Route::get('/{any}', function () {
    return view('index'); 
})->where('any', '.*'); 
