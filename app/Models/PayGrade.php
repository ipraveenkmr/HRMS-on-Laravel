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
        'min_gross_range' => 'float',
        'max_gross_range' => 'float',
        'basic' => 'float',
        'hra' => 'float',
        'ta' => 'float',
        'com' => 'float',
        'medical' => 'float',
        'edu' => 'float',
        'sa' => 'float',
        'income_tax' => 'float',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    public function employees()
    {
        return $this->hasMany(Employee::class);
    }
}