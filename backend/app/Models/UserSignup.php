<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserSignup extends Model
{
    protected $table = 'user_signups';

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'address',
    ];

    protected $hidden = [
        'password',
    ];
}
