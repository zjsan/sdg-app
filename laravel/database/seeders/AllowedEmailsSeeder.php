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
        // fetch organization IDs once to avoid repeated queries
        $mmsuId = DB::table('organization')->where('slug', 'mmsu')->value('id');
        $chedId = DB::table('organization')->where('slug', 'ched')->value('id');
        $externalId = DB::table('organization')->where('slug', 'external')->value('id');

        //email list to be whitelisted
        $emails = [

            //mmsu
            ['email' => 'zdsantos@mmsu.edu.ph', 'organization_id' => $mmsuId, 'is_active' => true],
            ['email' => 'sfnisperos@mmsu.edu.ph', 'organization_id' => $mmsuId, 'is_active' => true],
            ['email' => 'jpacang@mmsu.edu.ph', 'organization_id' => $mmsuId, 'is_active' => true],
            ['email' => 'wrpagtaconan@mmsu.edu.ph', 'organization_id' => $mmsuId, 'is_active' => true],

            //ched

            //external
            ['email' => 'zjsantos25@gmail.com','organization_id' => $externalId, 'is_active' => true],
            ['email' => 'ninanisperos519@gmail.com', 'organization_id' => $externalId, 'is_active' => true],
        ];

        //cleaning the emails table before seeding
        $emails = array_map(function($item){

            $cleanEmail = strtolower(trim($item['email']));
            $cleanEmail = filter_var($cleanEmail, FILTER_SANITIZE_EMAIL);

            return [
                'email' => $cleanEmail,
                'organization_id' => $item['organization_id'],
                'is_active' => $item['is_active'],
            ];

        }, $emails);

        //insert or update emails in the allowed_emails table
        foreach ($emails as $email) {
            DB::table('allowed_emails')->updateOrInsert(
                ['email' => $email['email']], // where condition
                [
                    'organization_id' => $email['organization_id'],
                    'is_active' => $email['is_active'],
                    'updated_at' => now(),
                    'created_at' => now(),
                ]
            );
        }
    }
}
