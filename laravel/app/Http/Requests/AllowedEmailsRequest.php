<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

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
        $this->merge([
            'email'  => filter_var(strtolower(trim($this->email)), FILTER_SANITIZE_EMAIL),
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $allowedEmail = $this->route('allowed_email'); //if this is an update, ignore the current record's email in the unique check

        $id = is_object($allowedEmail) ? $allowedEmail->id : ($allowedEmail ?? 'NULL'); //handle both model binding and direct id passing 

        return [
            //
            'email' => 'required|email|max:255|unique:allowed_emails,email,' . $id,
            'organization_id' => 'required|exists:organizations,id',
            'role_id' => 'required|exists:roles,id',
            'is_active' => 'required|boolean',
        ];
    }
}
