<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AllowedEmail extends Model
{
    use HasFactory;
    
    //
    protected $fillable = [
        'email',
        'is_active',
        'organization_id',
        'role_id',
    ];

    // Eager load roles automatically to save lines of code in controllers
    protected $with = ['role'];

    //casting the is_active field to boolean for easier handling in the application
    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    //Scope a query to only include active records for a specific role.
    //helper function for the admin/developer safeguard logic in the controller 
    public function scopeActiveByRole(Builder $query, int $roleId): Builder
    {
        return $query->where('role_id', $roleId)->where('is_active', true);
    }
}
