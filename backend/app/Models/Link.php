<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Link extends Model
{
    protected $fillable = [
        'user_id',
        'original_url',
        'short_code',
        'custom_slug',
        'expires_at',
        'is_commercial'
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'is_commercial' => 'boolean'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getShortUrlAttribute(): string
    {
        $code = $this->custom_slug ?? $this->short_code;
        return url("/{$code}");
    }
}