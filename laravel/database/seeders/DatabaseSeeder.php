<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

       // User::factory()->create([
         //   'name' => 'Test User',
           // 'email' => 'test@example.com',
        //]);

        $this->call([
        //keep the order of seeding to (OrganizationSeeder, AllowedEmailsSeeder) to avoid foreign key constraint issues
        OrganizationSeeder::class,
        AllowedEmailsSeeder::class,
    ]);
    }
}
