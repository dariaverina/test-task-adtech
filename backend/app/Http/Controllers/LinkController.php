<?php

namespace App\Http\Controllers;

use App\Models\Link;
use App\Http\Requests\CreateLinkRequest;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

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
            return response()->json(['error' => 'Ссылка не найдена'], 404);
        }

        if ($link->expires_at && $link->expires_at->isPast()) {
            return response()->json(['error' => 'Срок действия ссылки истек'], 410);
        }
        return redirect($link->original_url);
    }

    public function index()
    {
        $links = Link::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();
  
        $links->map(function($link) {
            $link->short_url = url($link->custom_slug ?? $link->short_code);
            return $link;
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