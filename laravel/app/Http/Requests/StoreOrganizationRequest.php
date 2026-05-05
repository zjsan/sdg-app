<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrganizationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        Gate::authorize('manage-pbi-links');
    }

    protected function prepareForValidation()
    {
        $this->merge([
            'name' =>  strtoupper(trim($this->name)),
            'last_name'  =>  trim($this->slug),
            'pbi_embed_id' => trim($this->pbi_embed_id),
        ]);
    }


    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            //
        ];
    }
}
