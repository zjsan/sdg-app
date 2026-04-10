<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $roles = [
        ['name' => 'Developer', 'slug' => 'developer'],
        ['name' => 'Admin', 'slug' => 'admin'],
        ['name' => 'Viewer', 'slug' => 'viewer'],
    ];

    foreach ($roles as $role) {
        Role::updateOrCreate(['slug' => $role['slug']], $role);
        }
    }
}
