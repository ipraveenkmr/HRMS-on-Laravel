<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class BranchDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_name_id',
        'branch_name',
        'branch_address',
        'longitude',
        'latitude'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    public function companyDetail()
    {
        return $this->belongsTo(CompanyDetail::class, 'company_name_id');
    }

    public function companyName()
    {
        return $this->belongsTo(CompanyDetail::class, 'company_name_id');
    }

    public function employees()
    {
        return $this->hasMany(Employee::class, 'branch_name_id');
    }
}