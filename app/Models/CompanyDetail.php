<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CompanyDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_name',
        'company_address',
        'support_email',
        'longitude',
        'latitude',
        'cloudinary_email',
        'cloudinary_preset',
        'cloudinary_api',
        'status',
        'logo'
    ];

    protected $attributes = [
        'status' => 'Active'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    const STATUS_CHOICES = ['Active', 'Inactive'];

    public function branchDetails()
    {
        return $this->hasMany(BranchDetail::class, 'company_name_id');
    }

    public function employees()
    {
        return $this->hasMany(Employee::class, 'company_name_id');
    }
}