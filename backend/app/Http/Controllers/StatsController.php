<?php

namespace App\Http\Controllers;

use App\Models\Link;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class StatsController extends Controller
{
    public function show($slug) 
    {
        try {
            $link = Link::where('short_code', $slug) 
                ->where('user_id', Auth::id())
                ->first();

            if (!$link) {
                return response()->json(['error' => 'Ссылка не найдена'], 404);
            }

            $clicks = $link->clicks()
                ->orderBy('clicked_at', 'desc')
                ->get();

            return response()->json([
                'link' => [
                    'original_url' => $link->original_url,
                    'short_url' => $link->short_url,
                    'created_at' => $link->created_at,
                ],
                'total_clicks' => $clicks->count(),
                'clicks' => $clicks->map(function($c) {
                    return [
                        'ip' => $c->ip,
                        'user_agent' => $c->user_agent,
                        'clicked_at' => $c->clicked_at,
                    ];
                })
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function uniqueVisitors()
    {
        try {
            $userId = Auth::id(); 
            
            if (!$userId) {
                return response()->json(['error' => 'Не авторизован'], 401);
            }
            
            $fourteenDaysAgo = now()->subDays(14);

            $stats = DB::table('clicks')
                ->join('links', 'clicks.link_id', '=', 'links.id')
                ->where('links.user_id', $userId) 
                ->where('clicks.clicked_at', '>=', $fourteenDaysAgo)
                ->select(
                    'links.id',
                    'links.original_url',
                    'links.short_code',
                    DB::raw('COUNT(DISTINCT CONCAT(clicks.ip, "-", clicks.user_agent)) as unique_count')
                )
                ->groupBy('links.id', 'links.original_url', 'links.short_code')
                ->get();

            return response()->json($stats->map(fn($s) => [
                'id' => $s->id,
                'url' => $s->original_url,
                'short_url' => url($s->short_code),
                'unique_visitors_14days' => (int)$s->unique_count
            ]));
            
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    public function linkUniqueVisitors($slug)
    {
        $link = Link::where('short_code', $slug)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $fourteenDaysAgo = now()->subDays(14);
        $dailyUnique = DB::table('clicks')
            ->where('link_id', $link->id)
            ->where('clicked_at', '>=', $fourteenDaysAgo)
            ->select(
                DB::raw('DATE(clicked_at) as date'),
                DB::raw('COUNT(DISTINCT CONCAT(ip, "-", user_agent)) as unique_count')
            )
            ->groupBy('date')
            ->orderBy('date', 'desc')
            ->get();

        $totalUnique = DB::table('clicks')
            ->where('link_id', $link->id)
            ->where('clicked_at', '>=', $fourteenDaysAgo)
            ->count(DB::raw('DISTINCT CONCAT(ip, "-", user_agent)'));

        return response()->json([
            'total_unique_14days' => $totalUnique,
            'daily_unique' => $dailyUnique
        ]);
    }
}