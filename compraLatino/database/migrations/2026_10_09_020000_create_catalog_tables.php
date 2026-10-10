<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table): void {
            $table->string('id')->primary();
            $table->string('name');
            $table->string('image')->nullable();
            $table->unsignedInteger('item_count')->default(0);
            $table->timestamps();
        });

        Schema::create('products', function (Blueprint $table): void {
            $table->id();
            $table->string('category_id');
            $table->foreign('category_id')->references('id')->on('categories');
            $table->string('name');
            $table->text('description');
            $table->decimal('price_usd', 12, 2);
            $table->decimal('original_price_usd', 12, 2)->nullable();
            $table->string('status')->default('disponible')->index();
            $table->string('image')->nullable();
            $table->string('condition')->nullable();
            $table->string('yauctions_item_id')->nullable()->index();
            $table->boolean('featured')->default(false)->index();
            $table->timestamps();
            $table->index(['category_id', 'name']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
        Schema::dropIfExists('categories');
    }
};
