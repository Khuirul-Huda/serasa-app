<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('shops', function (Blueprint $table) {
            $table->boolean('nib')->default(false)->after('is_verified');
            $table->boolean('halal')->default(false)->after('nib');
            $table->boolean('pirt')->default(false)->after('halal');
        });
    }

    public function down(): void
    {
        Schema::table('shops', function (Blueprint $table) {
            $table->dropColumn(['nib', 'halal', 'pirt']);
        });
    }
};
