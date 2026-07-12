<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->string('id')->primary(); // e.g. prod-susu-murni
            $table->string('shop_id');
            $table->foreign('shop_id')->references('id')->on('shops')->onDelete('cascade');
            $table->string('category_id');
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('cascade');
            $table->string('name');
            $table->text('description');
            $table->integer('price');
            $table->string('unit');
            $table->string('image');
            $table->double('rating')->default(5.0);
            $table->integer('reviews_count')->default(0);
            $table->boolean('is_available')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
