<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'username',
        'email',
        'password',
        'google_id',
        'avatar_url',
        'organization_id',
        'role_id',
    ];

    protected $appends = [];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

      /**
     * Override the identifier for authentication.
     */
    public function username()
    {
        return 'username';
    }

    //relationships with other table
    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function organization() {
        return $this->belongsTo(Organization::class);
    }

    /**
     * Get the user's avatar URL or a fallback placeholder.
     */
    public function getAvatarUrlAttribute(): string
    {
        $rawAvatar = $this->attributes['avatar_url'] ?? '';

        // Check if the avatar is empty or contains Google's default empty placeholder
        if (empty($rawAvatar) || str_contains($rawAvatar, 'googleusercontent.com/profile/picture')) {
            return 'https://ui-avatars.com/api/?name=' . urlencode($this->name) . '&color=7F9CF5&background=EBF4FF';
        }

        return $rawAvatar;
    }
}
