<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AllowedEmailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'email' => $this->email,
            'is_active' => (bool) $this->is_active,
            'role' => [
                'id' => $this->role?->id,
                'name' => $this->role?->name,
                'slug' => $this->role?->slug,
            ],
            'organization' => [
                'id' => $this->organization?->id,
                'name' => $this->organization?->name,
            ],
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
