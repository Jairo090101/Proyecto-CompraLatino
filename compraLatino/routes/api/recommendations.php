<?php

use App\Http\Controllers\RecommendationController;
use Illuminate\Support\Facades\Route;

Route::get('recommendations', [RecommendationController::class, 'index'])
    ->middleware('auth:sanctum');
