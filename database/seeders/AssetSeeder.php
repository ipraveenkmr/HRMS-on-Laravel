<?php

namespace Database\Seeders;

use App\Models\Asset;
use App\Models\AssetCategory;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class AssetSeeder extends Seeder
{
    public function run(): void
    {
        $assetCategories = AssetCategory::all();

        $assets = [
            // IT Equipment
            [
                'category' => 'IT Equipment',
                'asset_name' => 'Dell Laptop Inspiron 15',
                'manufacturer' => 'Dell',
                'model_number' => 'Inspiron 15-3515',
                'serial_number' => 'DL001234567',
                'support_link' => 'https://www.dell.com/support',
                'purchasing_date' => '2023-06-15',
                'active_service_date' => '2023-06-20',
                'purchasing_value' => '65000',
                'description' => 'High-performance laptop for development work'
            ],
            [
                'category' => 'IT Equipment',
                'asset_name' => 'HP Desktop Computer',
                'manufacturer' => 'HP',
                'model_number' => 'EliteDesk 800 G6',
                'serial_number' => 'HP001234567',
                'support_link' => 'https://support.hp.com',
                'purchasing_date' => '2023-05-10',
                'active_service_date' => '2023-05-15',
                'purchasing_value' => '55000',
                'description' => 'Desktop computer for office work'
            ],
            [
                'category' => 'IT Equipment',
                'asset_name' => 'MacBook Pro 13"',
                'manufacturer' => 'Apple',
                'model_number' => 'MacBook Pro M2',
                'serial_number' => 'AP001234567',
                'support_link' => 'https://support.apple.com',
                'purchasing_date' => '2024-01-20',
                'active_service_date' => '2024-01-25',
                'purchasing_value' => '120000',
                'description' => 'Premium laptop for design and development'
            ],

            // Mobile Devices
            [
                'category' => 'Mobile Devices',
                'asset_name' => 'iPhone 14',
                'manufacturer' => 'Apple',
                'model_number' => 'iPhone 14',
                'serial_number' => 'IP001234567',
                'support_link' => 'https://support.apple.com',
                'purchasing_date' => '2023-09-25',
                'active_service_date' => '2023-09-30',
                'purchasing_value' => '80000',
                'description' => 'Company mobile phone for senior management'
            ],
            [
                'category' => 'Mobile Devices',
                'asset_name' => 'Samsung Galaxy S23',
                'manufacturer' => 'Samsung',
                'model_number' => 'Galaxy S23',
                'serial_number' => 'SM001234567',
                'support_link' => 'https://www.samsung.com/support',
                'purchasing_date' => '2023-08-15',
                'active_service_date' => '2023-08-20',
                'purchasing_value' => '75000',
                'description' => 'Android smartphone for field employees'
            ],

            // Office Furniture
            [
                'category' => 'Office Furniture',
                'asset_name' => 'Executive Office Chair',
                'manufacturer' => 'Herman Miller',
                'model_number' => 'Aeron Chair',
                'serial_number' => 'HM001234567',
                'support_link' => 'https://www.hermanmiller.com/support',
                'purchasing_date' => '2023-07-10',
                'active_service_date' => '2023-07-12',
                'purchasing_value' => '85000',
                'description' => 'Ergonomic office chair for executives'
            ],
            [
                'category' => 'Office Furniture',
                'asset_name' => 'Standing Desk',
                'manufacturer' => 'IKEA',
                'model_number' => 'BEKANT',
                'serial_number' => 'IK001234567',
                'support_link' => 'https://www.ikea.com/support',
                'purchasing_date' => '2023-06-05',
                'active_service_date' => '2023-06-10',
                'purchasing_value' => '25000',
                'description' => 'Height-adjustable standing desk'
            ],

            // Audio Visual
            [
                'category' => 'Audio Visual',
                'asset_name' => 'Conference Room Projector',
                'manufacturer' => 'Epson',
                'model_number' => 'EB-2255U',
                'serial_number' => 'EP001234567',
                'support_link' => 'https://epson.com/support',
                'purchasing_date' => '2023-04-20',
                'active_service_date' => '2023-04-25',
                'purchasing_value' => '95000',
                'description' => 'High-resolution projector for presentations'
            ],
            [
                'category' => 'Audio Visual',
                'asset_name' => '4K Monitor 27"',
                'manufacturer' => 'LG',
                'model_number' => '27UK850-W',
                'serial_number' => 'LG001234567',
                'support_link' => 'https://lg.com/support',
                'purchasing_date' => '2023-05-15',
                'active_service_date' => '2023-05-20',
                'purchasing_value' => '35000',
                'description' => '4K UHD monitor for design work'
            ],

            // Networking Equipment
            [
                'category' => 'Networking Equipment',
                'asset_name' => 'Cisco Router',
                'manufacturer' => 'Cisco',
                'model_number' => 'ISR 4331',
                'serial_number' => 'CS001234567',
                'support_link' => 'https://cisco.com/support',
                'purchasing_date' => '2023-03-10',
                'active_service_date' => '2023-03-15',
                'purchasing_value' => '125000',
                'description' => 'Enterprise-grade router for office network'
            ],

            // Software Licenses
            [
                'category' => 'Software Licenses',
                'asset_name' => 'Microsoft Office 365',
                'manufacturer' => 'Microsoft',
                'model_number' => 'Business Premium',
                'serial_number' => 'MS001234567',
                'support_link' => 'https://support.microsoft.com',
                'purchasing_date' => '2024-01-01',
                'active_service_date' => '2024-01-01',
                'purchasing_value' => '50000',
                'description' => 'Annual license for productivity suite'
            ],

            // Security Equipment
            [
                'category' => 'Security Equipment',
                'asset_name' => 'CCTV Camera System',
                'manufacturer' => 'Hikvision',
                'model_number' => 'DS-2CD2043G2-I',
                'serial_number' => 'HV001234567',
                'support_link' => 'https://hikvision.com/support',
                'purchasing_date' => '2023-02-20',
                'active_service_date' => '2023-02-25',
                'purchasing_value' => '45000',
                'description' => 'IP camera for office security monitoring'
            ],

            // Vehicles
            [
                'category' => 'Vehicles',
                'asset_name' => 'Maruti Swift Dzire',
                'manufacturer' => 'Maruti Suzuki',
                'model_number' => 'Swift Dzire VXI',
                'serial_number' => 'MV001234567',
                'support_link' => 'https://marutisuzuki.com/service',
                'purchasing_date' => '2023-01-15',
                'active_service_date' => '2023-01-20',
                'purchasing_value' => '850000',
                'description' => 'Company car for business travel'
            ],

            // Kitchen & Pantry
            [
                'category' => 'Kitchen & Pantry',
                'asset_name' => 'Coffee Machine',
                'manufacturer' => 'Nespresso',
                'model_number' => 'Vertuo Next',
                'serial_number' => 'NP001234567',
                'support_link' => 'https://nespresso.com/support',
                'purchasing_date' => '2023-08-01',
                'active_service_date' => '2023-08-05',
                'purchasing_value' => '15000',
                'description' => 'Office coffee machine for employee break area'
            ]
        ];

        foreach ($assets as $assetData) {
            $category = $assetCategories->where('category', $assetData['category'])->first();

            if ($category) {
                Asset::create([
                    'asset_category_id' => $category->id,
                    'asset_name' => $assetData['asset_name'],
                    'manufacturer' => $assetData['manufacturer'],
                    'model_number' => $assetData['model_number'],
                    'serial_number' => $assetData['serial_number'],
                    'support_link' => $assetData['support_link'],
                    'purchasing_date' => $assetData['purchasing_date'],
                    'active_service_date' => $assetData['active_service_date'],
                    'purchasing_value' => $assetData['purchasing_value'],
                    'description' => $assetData['description']
                ]);
            }
        }
    }
}