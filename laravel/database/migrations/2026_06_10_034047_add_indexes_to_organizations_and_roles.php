<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('organizations', function (Blueprint $table) {
            //
            $table->unique('name');
            $table->index('slug');  // Standard index for URL lookups
        });

        Schema::table('roles', function (Blueprint $table) {
            $table->unique('name'); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Reverse changes on the roles table
        Schema::table('roles', function (Blueprint $table) {
            // Laravel drops unique keys using the same dropUnique method
            $table->dropUnique(['name']);
        });

        // Reverse changes on the organizations table
        Schema::table('organizations', function (Blueprint $table) {
            $table->dropUnique(['name']);
            $table->dropIndex(['slug']);
        });
    }
};
