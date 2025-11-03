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
}
