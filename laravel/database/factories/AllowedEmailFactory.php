<?php

namespace Database\Factories;

use App\Models\AllowedEmail;
use App\Models\Role;
use App\Models\Organization;
use Illuminate\Database\Eloquent\Factories\Factory;

class AllowedEmailFactory extends Factory
{
    protected $model = AllowedEmail::class;

    public function definition(): array
    {
        return [
            // Generates a random unique email
            'email' => $this->faker->unique()->safeEmail(),
            
            // Randomly attaches to an existing role or organization ID
            'role_id' => Role::inRandomOrder()->first()?->id ?? Role::factory(),
            'organization_id' => Organization::inRandomOrder()->first()?->id ?? Organization::factory(),
            
            'created_at' => $this->faker->dateTimeBetween('-1 month', 'now'),
        ];
    }
}
