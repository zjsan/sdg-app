<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAllowedEmailsRequest extends FormRequest
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
        $allowedEmailId = $this->route('allowed-emails')?->id;

        return [
            //
            'email' => 'required|email|max:255|unique:allowed_emails,email,' . $allowedEmailId,
            'organization_id' => 'required|exists:organizations,id',
            'role_id' => 'required|exists:roles,id',
            'is_active' => 'required|boolean',
        ];
    }
}
