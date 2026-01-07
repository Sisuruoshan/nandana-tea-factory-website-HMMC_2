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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description');
            $table->string('slug')->unique();
            $table->decimal('price', 10, 2);
            $table->decimal('wholesale_price', 10, 2)->nullable();
            $table->string('image')->nullable();
            $table->text('origin')->nullable();
            $table->text('notes')->nullable();
            $table->text('brewing_guide')->nullable();
            $table->text('long_description')->nullable();
            $table->integer('stock')->default(0);
            $table->boolean('is_wholesale')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
