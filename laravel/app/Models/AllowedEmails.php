<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AllowedEmails extends Model
{
    //
    protected $fillable = [
        'email',
        'is_active',
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
