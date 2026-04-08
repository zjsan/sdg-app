<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Organization;

class OrganizationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //initial database seeding for the organization table
        Organization::updateOrCreate(
            ['slug' => 'mmsu'], 
            ['name' => 'MMSU', 'pbi_embed_id' => config('app.power_bi.MMSU_EMBED_ID')] // MMSU ID
        );

        Organization::updateOrCreate(
            ['slug' => 'ched'],
            ['name' => 'CHED', 'pbi_embed_id' => config('app.power_bi.CHED_EMBED_ID')] // CHED ID 
        );

        Organization::updateOrCreate(
            ['slug' => 'external'],
            ['name' => 'EXTERNAL', 'pbi_embed_id' => config('app.power_bi.EXTERNAL_EMBED_ID')] // EXTERNAL
        );
    }
}
