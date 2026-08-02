<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shops', function (Blueprint $table) {
            $table->string('id')->primary(); // e.g. shop-milk
            $table->string('name');
            $table->string('owner_name');
            $table->text('description');
            $table->string('category'); // e.g. "Pertanian & Susu"
            $table->string('phone')->nullable();
            $table->string('address');
            $table->string('dusun');
            $table->string('image');
            $table->string('logo');
            $table->boolean('is_verified')->default(false);
            $table->double('lat')->nullable();
            $table->double('lng')->nullable();
            $table->string('working_hours')->nullable();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shops');
    }
};
