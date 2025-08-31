<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class NotificationDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'status',
        'description'
    ];

    protected $attributes = [
        'status' => 'Active'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    const STATUS_CHOICES = ['Active', 'Inactive'];
}