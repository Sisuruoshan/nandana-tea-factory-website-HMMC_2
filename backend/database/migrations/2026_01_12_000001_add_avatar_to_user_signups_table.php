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
        Schema::table('user_signups', function (Blueprint $table) {
            if (!Schema::hasColumn('user_signups', 'phone')) {
                $table->string('phone')->nullable()->after('email');
            }
            if (!Schema::hasColumn('user_signups', 'address')) {
                $table->text('address')->nullable();
            }
            if (!Schema::hasColumn('user_signups', 'avatar')) {
                $table->string('avatar')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_signups', function (Blueprint $table) {
            if (Schema::hasColumn('user_signups', 'phone')) {
                $table->dropColumn('phone');
            }
            if (Schema::hasColumn('user_signups', 'address')) {
                $table->dropColumn('address');
            }
            if (Schema::hasColumn('user_signups', 'avatar')) {
                $table->dropColumn('avatar');
            }
        });
    }
};
