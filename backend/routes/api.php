<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\ListingController;
use App\Http\Controllers\Api\V1\ConversationController;
use App\Http\Controllers\Api\V1\NotificationController;
use App\Http\Controllers\Api\V1\ProfileController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::prefix('auth')->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);
        Route::post('/token/refresh', [AuthController::class, 'login']); // Dummy refresh for now
        Route::post('/password-reset', [AuthController::class, 'passwordReset']);
        Route::post('/password-reset/confirm', [AuthController::class, 'passwordResetConfirm']);
        
        Route::middleware('auth:sanctum')->group(function () {
            Route::get('/me', [AuthController::class, 'me']);
            Route::patch('/me', [ProfileController::class, 'update']);
            Route::post('/logout', [AuthController::class, 'logout']);
            Route::post('/change-password', [AuthController::class, 'changePassword']);
            
            // Admin User Management
            Route::get('/users', [\App\Http\Controllers\Api\V1\AdminController::class, 'users']);
            Route::patch('/users/{id}', [\App\Http\Controllers\Api\V1\AdminController::class, 'updateUser']);
            Route::delete('/users/{id}', [\App\Http\Controllers\Api\V1\AdminController::class, 'deleteUser']);
        });
        Route::get('/{id}', [AuthController::class, 'show']);
    });

    Route::prefix('listings')->group(function () {
        Route::get('/', [ListingController::class, 'index']);
        Route::get('/categories', [ListingController::class, 'categories']);
        Route::post('/categories', [ListingController::class, 'storeCategory'])->middleware('auth:sanctum');
        Route::patch('/categories/{id}', [ListingController::class, 'updateCategory'])->middleware('auth:sanctum');
        Route::delete('/categories/{id}', [ListingController::class, 'deleteCategory'])->middleware('auth:sanctum');
        Route::get('/admin-stats', [ListingController::class, 'adminStats'])->middleware('auth:sanctum');
        Route::get('/admin-all', [ListingController::class, 'adminAll'])->middleware('auth:sanctum');
        Route::post('/{id}/approve', [ListingController::class, 'approve'])->middleware('auth:sanctum');
        Route::post('/{id}/reject', [ListingController::class, 'reject'])->middleware('auth:sanctum');
        Route::get('/detail_by_slug', [ListingController::class, 'detailBySlug']);
        Route::get('/dashboard-stats', [ListingController::class, 'dashboardStats'])->middleware('auth:sanctum');
        Route::get('/favorites', [ProfileController::class, 'favorites'])->middleware('auth:sanctum');
        Route::post('/favorites', [ProfileController::class, 'toggleFavorite'])->middleware('auth:sanctum');
        Route::post('/', [ListingController::class, 'store'])->middleware('auth:sanctum');
        Route::get('/{slug}', [ListingController::class, 'show']);
        Route::patch('/{id}', [ListingController::class, 'update'])->middleware('auth:sanctum');
        Route::put('/{id}', [ListingController::class, 'update'])->middleware('auth:sanctum');
    });

    Route::middleware('auth:sanctum')->prefix('messaging')->group(function () {
        Route::get('/conversations', [ConversationController::class, 'index']);
        Route::get('/conversations/unread_count', [ConversationController::class, 'unreadCount']);
        Route::get('/conversations/{id}', [ConversationController::class, 'show']);
        Route::get('/conversations/{id}/messages', [ConversationController::class, 'messages']);
        Route::post('/conversations/{id}/send_message', [ConversationController::class, 'sendMessage']);
        Route::post('/messages', [ConversationController::class, 'store']); // Create new conversation
        Route::delete('/conversations/{id}', [ConversationController::class, 'destroy']);
    });

    Route::middleware('auth:sanctum')->prefix('notifications')->group(function () {
        Route::get('/', [NotificationController::class, 'index']);
        Route::post('/broadcast', [NotificationController::class, 'broadcast']);
        Route::post('/{id}/mark_as_read', [NotificationController::class, 'markAsRead']);
        Route::post('/read-all', [NotificationController::class, 'markAllAsRead']);
        Route::delete('/{id}', [NotificationController::class, 'destroy']);
    });

    Route::middleware('auth:sanctum')->prefix('profile')->group(function () {
        Route::patch('/', [ProfileController::class, 'update']);
        Route::get('/favorites', [ProfileController::class, 'favorites']);
        Route::post('/favorites/{listingId}', [ProfileController::class, 'toggleFavorite']);
    });
});
