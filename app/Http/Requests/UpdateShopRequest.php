<?php

/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateShopRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() && $this->user()->role === 'owner';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'phone' => 'required|string|max:30',
            'address' => 'required|string|max:255',
            'dusun' => 'required|string|max:100',
            'lat' => 'required|numeric',
            'lng' => 'required|numeric',
            'description' => 'required|string',
            'jamKerja' => 'required|string|max:100',
            'logo' => $this->hasFile('logo') ? 'file|image|max:2048' : 'nullable|string',
            'image' => $this->hasFile('image') ? 'file|image|max:2048' : 'nullable|string',
        ];
    }
}
