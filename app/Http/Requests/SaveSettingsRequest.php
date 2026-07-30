<?php

/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class SaveSettingsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() && $this->user()->role === 'admin';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'appName' => 'required|string|max:255',
            'tagline' => 'required|string|max:255',
            'villageName' => 'required|string|max:255',
            'description' => 'required|string',
            'adminPhone' => 'required|string|max:30',
            'heroBanner' => 'required|url',
            'hotSearches' => 'nullable|array',
            'hotSearches.*.label' => 'required_with:hotSearches|string|max:50',
            'hotSearches.*.query' => 'required_with:hotSearches|string|max:50',
            'promoSlides' => 'nullable|array',
            'promoSlides.*.title' => 'required_with:promoSlides|string|max:100',
            'promoSlides.*.tagline' => 'nullable|string|max:150',
            'promoSlides.*.description' => 'nullable|string|max:255',
            'promoSlides.*.image' => 'nullable|url',
            'promoSlides.*.badge' => 'nullable|string|max:50',
            'promoSlides.*.btnQuery' => 'nullable|string|max:50',
        ];
    }
}
