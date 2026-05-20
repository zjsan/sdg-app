<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Gate;

class OrganizationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
       return true;//
    }

    protected function prepareForValidation()
    {

        $mergeData = [];

        //only merge and transform if the name field is present
        //provent unwanted overwriting of the slug
        if ($this->has('name')) {
            $name = strtoupper(trim($this->name));
            $mergeData['name'] = $name;
            $mergeData['slug'] = Str::lower($this->name);
        }

        if ($this->has('pbi_embed_id')) {
            $mergeData['pbi_embed_id'] = trim($this->pbi_embed_id);
        }

        $this->merge($mergeData);

    }


    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $orgId = $this->route('organization')?->id;

        // Default rules for both Create and Update
        $rules = [
            'pbi_embed_id' => 'required|string|min:10',
        ];

        if ($this->isMethod('post')) {
            // Rules strictly for CREATING
            $rules['name'] = 'required|string|max:255|unique:organizations,name';
            $rules['slug'] = 'required|string|max:255|unique:organizations,slug';
        } else {
            // Rules strictly for UPDATING
            // 'sometimes' means: if the key is missing from the JS payload, ignore it
            $rules['name'] = 'sometimes|required|string|max:255|unique:organizations,name,' . $orgId;
            $rules['slug'] = 'sometimes|required|string|max:255|unique:organizations,slug,' . $orgId;
        }

        return $rules;
    }
}
