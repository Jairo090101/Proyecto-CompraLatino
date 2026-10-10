<?php

use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\MetricsController;
use App\Http\Controllers\Admin\ProductController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')->middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::post('users', [UserController::class, 'store']);
    Route::get('metrics', MetricsController::class);
    Route::apiResource('products', ProductController::class);
});
