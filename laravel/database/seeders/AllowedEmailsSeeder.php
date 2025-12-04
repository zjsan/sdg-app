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
        $emails = [
            ['email' => 'zjsantos25@gmail.com', 'is_active' => true],
            ['email' => 'zdsantos@mmsu.edu.ph', 'is_active' => true],
            ['email' => 'ninanisperos519@gmail.com', 'is_active' => true],
            ['email' => 'sfnisperos@mmsu.edu.ph', 'is_active' => true],
            ['email' => 'jpacang@mmsu.edu.ph', 'is_active' => true],
            ['email' => 'wrpagtaconan@mmsu.edu.ph', 'is_active' => true],
        ];

        //cleaning the emails table before seeding
        $emails = array_map(function($item){

            $cleanEmail = strtolower(trim($item['email']));
            $cleanEmail = filter_var($cleanEmail, FILTER_SANITIZE_EMAIL);

            return [
                'email' => $cleanEmail,
                'is_active' => $item['is_active'],
            ];

        }, $emails);

        //insert or update emails in the allowed_emails table
        foreach ($emails as $email) {
            DB::table('allowed_emails')->updateOrInsert(
                ['email' => $email['email']], // where condition
                [
                    'is_active' => $email['is_active'],
                    'updated_at' => now(),
                    'created_at' => now(),
                ]
            );
        }
    }
}
