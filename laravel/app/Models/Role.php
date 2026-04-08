<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    //
    protected $fillable = ['name', 'slug']; //whitelist these fields for mass assignment

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
}
