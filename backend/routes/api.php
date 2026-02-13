<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\LinkController;
use App\Http\Controllers\StatsController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/stats/{slug}', [StatsController::class, 'show']);
    Route::get('/stats/unique/14days', [StatsController::class, 'uniqueVisitors']);
    Route::get('/stats/unique/{slug}/14days', [StatsController::class, 'linkUniqueVisitors']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('user', [AuthController::class, 'user']);
    Route::apiResource('links', LinkController::class)->except(['show', 'update']);
});