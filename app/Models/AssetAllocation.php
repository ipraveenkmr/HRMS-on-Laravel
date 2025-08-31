<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AssetAllocation extends Model
{
    use HasFactory;

    protected $fillable = [
        'asset_id',
        'asset_category',
        'username',
        'employee_id',
        'department_id',
        'allocation_date',
        'allocation_upto',
        'return_date',
        'status',
        'description'
    ];

    protected $casts = [
        'asset_category' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    public function asset()
    {
        return $this->belongsTo(Asset::class);
    }

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }
}