<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AllowedEmailsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        DB::table('whitelisted_emails')->insert([
            ['email' => 'test.user@gmail.com', 'is_active' => true],
            ['email' => 'admin.company@gmail.com', 'is_active' => true],
            ['email' => 'inactive.user@gmail.com', 'is_active' => false],
        ]);
    }
}
