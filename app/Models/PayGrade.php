<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PayGrade extends Model
{
    use HasFactory;

    protected $fillable = [
        'grade',
        'min_gross_range',
        'max_gross_range',
        'basic',
        'hra',
        'ta',
        'com',
        'medical',
        'edu',
        'sa',
        'income_tax'
    ];

    protected $casts = [
        'grade' => 'integer',
        'min_gross_range' => 'integer',
        'max_gross_range' => 'integer',
        'basic' => 'integer',
        'hra' => 'integer',
        'ta' => 'integer',
        'com' => 'integer',
        'medical' => 'integer',
        'edu' => 'integer',
        'sa' => 'integer',
        'income_tax' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    public function employees()
    {
        return $this->hasMany(Employee::class);
    }
}