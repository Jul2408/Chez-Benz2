<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\ListingController;
use App\Http\Controllers\Api\V1\ConversationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::prefix('auth')->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);
        
        Route::middleware('auth:sanctum')->group(function () {
            Route::get('/me', [AuthController::class, 'me']);
            Route::post('/logout', [AuthController::class, 'logout']);
        });
    });

    Route::prefix('listings')->group(function () {
        Route::get('/', [ListingController::class, 'index']);
        Route::get('/categories', [ListingController::class, 'categories']);
        Route::get('/{slug}', [ListingController::class, 'show']);
        Route::post('/', [ListingController::class, 'store'])->middleware('auth:sanctum');
    });

    Route::middleware('auth:sanctum')->prefix('messaging')->group(function () {
        Route::get('/conversations', [ConversationController::class, 'index']);
        Route::get('/conversations/{id}', [ConversationController::class, 'show']);
        Route::post('/messages', [ConversationController::class, 'store']);
    });
});
