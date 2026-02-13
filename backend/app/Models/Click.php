<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Click extends Model
{
    use HasFactory;

    protected $fillable = ['link_id', 'ip', 'user_agent', 'clicked_at'];

    protected $casts = [
        'clicked_at' => 'datetime'
    ];

    public function link()
    {
        return $this->belongsTo(Link::class);
    }
}