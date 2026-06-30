<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

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
            $name = strtoupper(preg_replace('/\s+/', ' ', trim($this->name)));
            $mergeData['name'] = $name;
            $mergeData['slug'] = Str::slug($this->name);
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
        $routeParam = $this->route('organization');
        $orgId = is_object($routeParam) ? $routeParam->id : $routeParam;

        // Default rules for both Create and Update
        $rules = [
            'pbi_embed_id' => 'required|string|min:10|max:255',
        ];

        if ($this->isMethod('post')) {
            // Rules strictly for CREATING
            // ignore soft-deleted rows
            $rules['name'] = [
                'required', 'string', 'min:3', 'max:255',
                 Rule::unique('organizations', 'name')->whereNull('deleted_at')
            ];
            $rules['slug'] = [
                'required', 'string', 'min:3', 'max:255',
                 Rule::unique('organizations', 'slug')->whereNull('deleted_at')
            ];
        } else {
            // Rules strictly for UPDATING
            // Ignore current record ID AND ignore soft-deleted records
            $rules['name'] = [
                'sometimes', 'required', 'string', 'min:3', 'max:255',
                 Rule::unique('organizations', 'name')->ignore($orgId)->whereNull('deleted_at')
            ];
            $rules['slug'] = [
                'sometimes', 'required', 'string', 'min:3', 'max:255',
                 Rule::unique('organizations', 'slug')->ignore($orgId)->whereNull('deleted_at')
            ];
        }

        return $rules;
    }
}
