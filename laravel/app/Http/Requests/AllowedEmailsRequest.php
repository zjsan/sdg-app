<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AllowedEmailsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function prepareForValidation()
    {
       // Strictly normalize: strip white spaces and force lowercase.
        if ($this->has('email')) {
            $this->merge([
                'email' => strtolower(trim($this->email)),
            ]);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $allowedEmail = $this->route('allowed_email'); //if this is an update, ignore the current record's email in the unique check

        $allowedEmailId = is_object($allowedEmail) ? $allowedEmail->id : ($allowedEmail ?? 'NULL'); //handle both model binding and direct id passing 

        return [
            'email' => [
                'required',
                'string',
                'lowercase',
                'max:255',
                'email:rfc', // Strict RFC formatting

                //ensure email is unique but ignore when updating the same record
                Rule::unique('allowed_emails', 'email')
                    ->ignore($allowedEmailId)
                    ->whereNull('deleted_at') //consider the uniqueness if it is not soft deleted
            ],
            'organization_id' => [
                'required',
                'integer',
                Rule::exists('organizations', 'id'), //ensure the organization_id exists in the organizations table
            ],
            'role_id' => [
                'required',
                'integer',
                Rule::exists('roles', 'id'), //ensure the role_id exists in the roles table
            ],
            'is_active' => [
                'required',
                'boolean',
            ],
        ];
    }
}
