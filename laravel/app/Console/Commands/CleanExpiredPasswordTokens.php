<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CleanExpiredPasswordTokens extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    //protected $signature = 'app:clean-expired-password-tokens';
    protected $signature = 'password-tokens:clean-expired';
    /**
     * The console command description.
     *
     * @var string
     */
    //protected $description = 'Command description';
    protected $description = 'Delete expired password reset tokens from the database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        //      
        $expired = Carbon::now()->subMinutes(60);
        $deleted = DB::table('password_reset_tokens')
            ->where('created_at', '<', $expired)    
            ->delete();

        $this->info("Deleted {$deleted} expired password reset tokens.");
    }
}
