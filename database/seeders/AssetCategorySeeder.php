<?php

namespace Database\Seeders;

use App\Models\AssetCategory;
use Illuminate\Database\Seeder;

class AssetCategorySeeder extends Seeder
{
    public function run(): void
    {
        $assetCategories = [
            [
                'category' => 'IT Equipment',
                'description' => 'Computers, laptops, servers, and other IT hardware'
            ],
            [
                'category' => 'Office Furniture',
                'description' => 'Desks, chairs, tables, and other office furniture'
            ],
            [
                'category' => 'Software Licenses',
                'description' => 'Software licenses and subscriptions'
            ],
            [
                'category' => 'Mobile Devices',
                'description' => 'Smartphones, tablets, and mobile accessories'
            ],
            [
                'category' => 'Audio Visual',
                'description' => 'Projectors, monitors, speakers, and AV equipment'
            ],
            [
                'category' => 'Networking Equipment',
                'description' => 'Routers, switches, access points, and network hardware'
            ],
            [
                'category' => 'Office Supplies',
                'description' => 'Stationery, printing supplies, and general office items'
            ],
            [
                'category' => 'Vehicles',
                'description' => 'Company vehicles and transportation equipment'
            ],
            [
                'category' => 'Security Equipment',
                'description' => 'CCTV cameras, access control systems, and security hardware'
            ],
            [
                'category' => 'Kitchen & Pantry',
                'description' => 'Kitchen appliances, coffee machines, and pantry equipment'
            ]
        ];

        foreach ($assetCategories as $category) {
            AssetCategory::create($category);
        }
    }
}