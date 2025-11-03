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
        //email list to be whitelisted
        DB::table('whitelisted_emails')->insert([
            ['email' => 'zjsantos25@gmail.com', 'is_active' => true],
            ['email' => 'zdsantos@mmsu.edu.ph', 'is_active' => true],
            ['email' => 'ninanisperos519@gmail.com', 'is_active' => false],
        ]);
    }
}
