<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Asset extends Model
{
    use HasFactory;

    protected $fillable = [
        'asset_category_id',
        'asset_name',
        'manufacturer',
        'model_number',
        'serial_number',
        'support_link',
        'purchasing_date',
        'active_service_date',
        'purchasing_value',
        'description'
    ];

    protected $casts = [
        'purchasing_date' => 'date',
        'active_service_date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    public function assetCategory()
    {
        return $this->belongsTo(AssetCategory::class);
    }

    public function assetAllocations()
    {
        return $this->hasMany(AssetAllocation::class);
    }
}