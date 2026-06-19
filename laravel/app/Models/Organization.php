<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes; 

class Organization extends Model
{

    use HasFactory, SoftDeletes;
    
    //
    protected $fillable = ['name', 'slug', 'pbi_embed_id'];//whitelist these fields for mass assignment

    // Dates array ensures deleted_at is cast to a Carbon instance automatically
    protected $dates = ['deleted_at'];

    public function users() {
        return $this->hasMany(User::class);
    }

    public function allowedEmails(){
        return $this->hasMany(AllowedEmail::class);
    }
}
