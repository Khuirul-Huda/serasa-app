<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->string('id')->primary(); // e.g. rev-1
            $table->string('product_id');
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
            $table->string('user_name');
            $table->integer('rating');
            $table->text('comment');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
