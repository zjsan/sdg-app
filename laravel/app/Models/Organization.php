<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Organization extends Model
{
    //
    protected $fillable = ['name', 'slug', 'pbi_embed_id'];//whitelist these fields for mass assignment

    public function users() {
        return $this->hasMany(User::class);
    }
}
