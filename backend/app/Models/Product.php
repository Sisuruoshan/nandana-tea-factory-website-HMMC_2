<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name',
        'description',
        'slug',
        'price',
        'wholesale_price',
        'image',
        'origin',
        'notes',
        'brewing_guide',
        'long_description',
        'stock',
        'is_wholesale',
    ];
}
