<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateLinkRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'original_url' => 'required|url',
            'custom_slug' => 'nullable|alpha_dash|unique:links,custom_slug|max:50',
            'expires_at' => 'nullable|date|after:now',
            'is_commercial' => 'boolean'
        ];
    }
}