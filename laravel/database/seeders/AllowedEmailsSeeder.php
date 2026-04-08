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
        $mmsuId = DB::table('organizations')->where('slug', 'mmsu')->value('id');
        $chedId = DB::table('organizations')->where('slug', 'ched')->value('id');
        $externalId = DB::table('organizations')->where('slug', 'external')->value('id');

        //email list to be whitelisted
        $emails = [

            //mmsu
            ['email' => 'zdsantos@mmsu.edu.ph', 'organizations_id' => $mmsuId, 'is_active' => true],
            ['email' => 'sfnisperos@mmsu.edu.ph', 'organizations_id' => $mmsuId, 'is_active' => true],
            ['email' => 'jpacang@mmsu.edu.ph', 'organizations_id' => $mmsuId, 'is_active' => true],
            ['email' => 'wrpagtaconan@mmsu.edu.ph', 'organizations_id' => $mmsuId, 'is_active' => true],

            //ched

            //external
            ['email' => 'zjsantos25@gmail.com','organizations_id' => $externalId, 'is_active' => true],
            ['email' => 'ninanisperos519@gmail.com', 'organizations_id' => $externalId, 'is_active' => true],
        ];

        //cleaning the emails table before seeding
        $emails = array_map(function($item){

            $cleanEmail = strtolower(trim($item['email']));
            $cleanEmail = filter_var($cleanEmail, FILTER_SANITIZE_EMAIL);

            return [
                'email' => $cleanEmail,
                'organizations_id' => $item['organizations_id'],
                'is_active' => $item['is_active'],
            ];

        }, $emails);

        //insert or update emails in the allowed_emails table
        foreach ($emails as $email) {
            AllowedEmail::upsert(
                $emails,           // The array of data
                ['email'],         // The column that makes a record unique
                ['organizations_id', 'is_active', 'updated_at'] // Columns to update on match
            );
        }
    }
}
