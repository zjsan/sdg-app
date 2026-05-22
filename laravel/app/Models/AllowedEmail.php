<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AllowedEmail extends Model
{
    //
    protected $fillable = [
        'email',
        'is_active',
        'organization_id',
        'role_id',
    ];

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
}
