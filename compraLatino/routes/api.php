<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\HelloController;
use Illuminate\Support\Facades\Route;

Route::get('/hello', HelloController::class);

Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register'])->middleware('throttle:10,1');
    Route::post('login', [AuthController::class, 'login'])->middleware('throttle:5,1');

    Route::middleware('auth.jwt')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('me', [AuthController::class, 'me']);
    });
});
