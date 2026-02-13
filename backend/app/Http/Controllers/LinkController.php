<?php

namespace App\Http\Controllers;

use App\Models\Link;
use App\Http\Requests\CreateLinkRequest;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use App\Models\Click;

class LinkController extends Controller
{
    public function store(CreateLinkRequest $request)
    {
        if ($request->custom_slug) {
            $shortCode = $request->custom_slug;
        } else {
            do {
                $shortCode = Str::random(6);
            } while (Link::where('short_code', $shortCode)->exists());
        }
        
        $link = Link::create([
            'user_id' => Auth::id(),
            'original_url' => $request->original_url,
            'short_code' => $shortCode,
            'custom_slug' => $request->custom_slug,
            'expires_at' => $request->expires_at,
            'is_commercial' => $request->is_commercial ?? false
        ]);

        return response()->json([
            'link' => $link,
            'short_url' => $link->short_url
        ], 201);
    }

    public function redirect($code)
    {
        $link = Link::where('short_code', $code)
            ->orWhere('custom_slug', $code)
            ->first();
        
        if (!$link) {
            return response()->view('errors.link-not-found', [], 404);
        }
        
        if ($link->expires_at && Carbon::parse($link->expires_at)->isPast()) {
            return response()->view('errors.link-expired', [
                'expired_at' => $link->expires_at
            ], 410);
        }
        Click::create([
            'link_id' => $link->id,
            'ip' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'clicked_at' => now()
        ]);

        $link->increment('clicks_count');
        return redirect()->away($link->original_url);
    }

    public function index()
    {
        $links = Link::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($link) {
                $expiresAt = $link->expires_at;
                $isExpired = $expiresAt && $expiresAt->isPast();
                
                return [
                    'id' => $link->id,
                    'original_url' => $link->original_url,
                    'short_code' => $link->short_code,
                    'custom_slug' => $link->custom_slug,
                    'short_url' => $link->short_url,
                    'expires_at' => $expiresAt,
                    'is_expired' => $isExpired,
                    'status' => $expiresAt ? ($isExpired ? 'expired' : 'active') : 'active',
                    'created_at' => $link->created_at->format('d.m.Y H:i'),
                    'expires_at_formatted' => $expiresAt 
                        ? $expiresAt->format('d.m.Y H:i')
                        : 'Никогда'
                ];
            });
        
        return response()->json($links);
    }

    public function destroy($id)
    {
        $link = Link::where('user_id', Auth::id())
            ->where('id', $id)
            ->firstOrFail();
            
        $link->delete();
        
        return response()->json(['message' => 'Ссылка удалена']);
    }
}