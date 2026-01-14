<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WholesaleInquiry extends Model
{
    protected $table = 'wholesale_inquiries';

    protected $fillable = [
        'name',
        'company',
        'email',
        'phone',
        'address',
        'details',
        'status',
        'admin_notes',
    ];
}
