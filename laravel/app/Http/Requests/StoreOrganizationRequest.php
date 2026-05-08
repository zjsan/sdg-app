<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Gate;

class StoreOrganizationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        Gate::allows('manage-pbi-links');
    }

    protected function prepareForValidation()
    {
        $this->merge([
            'name' =>  strtoupper(trim($this->name)),
            'slug'  =>  Str::lower($this->name),
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
        $orgId = $this->route('organization')?->id;

        return [
            //
            'name' => 'required|string|max:255|unique:organizations,name,' . $orgId,
            'slug' => 'required|string|max:255|unique:organizations,slug,' . $orgId,
            'pbi_embed_id' => 'required|string|min:10',

        ];
    }
}
