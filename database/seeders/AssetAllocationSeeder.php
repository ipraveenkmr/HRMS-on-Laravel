<?php

namespace Database\Seeders;

use App\Models\AssetAllocation;
use App\Models\Asset;
use App\Models\AssetCategory;
use App\Models\Employee;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class AssetAllocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $employees = Employee::where('emp_status', 'Working')->get();
        $assets = Asset::all();
        $assetCategories = AssetCategory::all();
        
        if ($employees->isEmpty()) {
            $this->command->error('No employees found. Please run DatabaseSeeder first.');
            return;
        }

        if ($assets->isEmpty()) {
            $this->command->error('No assets found. Please run AssetSeeder first.');
            return;
        }

        $this->command->info('Creating asset allocations...');

        $allocationStatuses = ['Allocated', 'Returned', 'Under Maintenance', 'Lost/Damaged'];
        $allocationCounter = 0;

        // Track which assets are currently allocated to avoid conflicts
        $allocatedAssets = [];

        // Prioritize certain asset types for specific employee types
        $priorityAllocations = $this->createPriorityAllocations($employees, $assets, $assetCategories);
        
        foreach ($priorityAllocations as $allocation) {
            $this->createAssetAllocation($allocation, $allocatedAssets);
            $allocationCounter++;
        }

        // Create additional random allocations for remaining assets
        $remainingAssets = $assets->whereNotIn('id', $allocatedAssets);
        
        foreach ($remainingAssets as $asset) {
            // 70% chance this asset gets allocated
            if (rand(1, 100) <= 70) {
                $employee = $employees->random();
                $allocation = $this->generateAllocationData($asset, $employee);
                $this->createAssetAllocation($allocation, $allocatedAssets);
                $allocationCounter++;
            }
        }

        // Create historical allocations (returned/completed)
        $historicalCount = $this->createHistoricalAllocations($employees, $assets);
        $allocationCounter += $historicalCount;

        $this->command->info("Created {$allocationCounter} asset allocations successfully!");
    }

    private function createPriorityAllocations($employees, $assets, $assetCategories)
    {
        $priorityAllocations = [];

        // Get category mappings
        $laptopCategory = $assetCategories->where('category_name', 'Laptop')->first();
        $mobileCategory = $assetCategories->where('category_name', 'Mobile')->first();
        $deskCategory = $assetCategories->where('category_name', 'Furniture')->first();

        // Allocate laptops to engineering and management staff
        $techEmployees = $employees->filter(function ($emp) {
            return in_array($emp->emp_type, ['Manager', 'Admin']) || 
                   (isset($emp->department) && $emp->department->department_name === 'Engineering');
        });

        $laptops = $laptopCategory ? $assets->where('asset_category_id', $laptopCategory->id) : collect();
        
        foreach ($techEmployees->take($laptops->count()) as $index => $employee) {
            if ($laptops->get($index)) {
                $priorityAllocations[] = $this->generateAllocationData($laptops->get($index), $employee, 'Allocated');
            }
        }

        // Allocate mobile phones to managers and sales staff
        $mobileUsers = $employees->filter(function ($emp) {
            return $emp->emp_type === 'Manager' || 
                   (isset($emp->department) && in_array($emp->department->department_name ?? '', ['Sales', 'Marketing']));
        });

        $mobiles = $mobileCategory ? $assets->where('asset_category_id', $mobileCategory->id) : collect();
        
        foreach ($mobileUsers->take($mobiles->count()) as $index => $employee) {
            if ($mobiles->get($index)) {
                $priorityAllocations[] = $this->generateAllocationData($mobiles->get($index), $employee, 'Allocated');
            }
        }

        return $priorityAllocations;
    }

    private function generateAllocationData($asset, $employee, $status = null)
    {
        $status = $status ?? $this->getRandomAllocationStatus();
        $allocationDate = fake()->dateTimeBetween('-2 years', 'now');
        
        // Calculate allocation end date and return date based on status
        $allocationUpto = Carbon::parse($allocationDate)->addMonths(rand(6, 36)); // 6 months to 3 years
        $returnDate = null;

        if ($status === 'Returned') {
            $returnDate = fake()->dateTimeBetween($allocationDate, 'now');
        } elseif ($status === 'Under Maintenance') {
            // Some maintenance items might be returned
            if (rand(1, 100) <= 30) {
                $returnDate = fake()->dateTimeBetween($allocationDate, 'now');
            }
        } elseif ($status === 'Lost/Damaged') {
            $returnDate = fake()->dateTimeBetween($allocationDate, 'now');
        }

        return [
            'asset' => $asset,
            'employee' => $employee,
            'status' => $status,
            'allocation_date' => $allocationDate,
            'allocation_upto' => $allocationUpto,
            'return_date' => $returnDate,
            'description' => $this->getStatusDescription($status, $asset->asset_name)
        ];
    }

    private function createAssetAllocation($allocationData, &$allocatedAssets)
    {
        $asset = $allocationData['asset'];
        $employee = $allocationData['employee'];

        AssetAllocation::create([
            'asset_id' => $asset->id,
            'asset_category' => $asset->asset_category_id,
            'username' => $employee->username,
            'employee_id' => $employee->id,
            'department_id' => $employee->department_id,
            'allocation_date' => $allocationData['allocation_date']->format('Y-m-d'),
            'allocation_upto' => $allocationData['allocation_upto']->format('Y-m-d'),
            'return_date' => $allocationData['return_date'] ? $allocationData['return_date']->format('Y-m-d') : null,
            'status' => $allocationData['status'],
            'description' => $allocationData['description'],
            'created_at' => $allocationData['allocation_date'],
            'updated_at' => $allocationData['allocation_date']
        ]);

        // Mark asset as allocated if currently active
        if (in_array($allocationData['status'], ['Allocated', 'Under Maintenance'])) {
            $allocatedAssets[] = $asset->id;
        }
    }

    private function createHistoricalAllocations($employees, $assets)
    {
        $historicalCounter = 0;
        $historicalStatuses = ['Returned', 'Lost/Damaged'];

        // Create 20-30 historical allocations
        $historicalCount = rand(20, 30);

        for ($i = 0; $i < $historicalCount; $i++) {
            $asset = $assets->random();
            $employee = $employees->random();
            $status = $historicalStatuses[array_rand($historicalStatuses)];

            // Historical allocations are from 6 months to 3 years ago
            $allocationDate = fake()->dateTimeBetween('-3 years', '-6 months');
            $returnDate = fake()->dateTimeBetween($allocationDate, '-3 months');
            $allocationUpto = Carbon::parse($allocationDate)->addMonths(rand(3, 24));

            AssetAllocation::create([
                'asset_id' => $asset->id,
                'asset_category' => $asset->asset_category_id,
                'username' => $employee->username,
                'employee_id' => $employee->id,
                'department_id' => $employee->department_id,
                'allocation_date' => $allocationDate->format('Y-m-d'),
                'allocation_upto' => $allocationUpto->format('Y-m-d'),
                'return_date' => $returnDate->format('Y-m-d'),
                'status' => $status,
                'description' => $this->getStatusDescription($status, $asset->asset_name),
                'created_at' => $allocationDate,
                'updated_at' => $returnDate
            ]);

            $historicalCounter++;
        }

        return $historicalCounter;
    }

    private function getRandomAllocationStatus()
    {
        $statuses = ['Allocated', 'Returned', 'Under Maintenance', 'Lost/Damaged'];
        $weights = [60, 25, 10, 5]; // 60% allocated, 25% returned, 10% maintenance, 5% lost/damaged
        
        $rand = rand(1, 100);
        if ($rand <= 60) return 'Allocated';
        if ($rand <= 85) return 'Returned';
        if ($rand <= 95) return 'Under Maintenance';
        return 'Lost/Damaged';
    }

    private function getStatusDescription($status, $assetName)
    {
        $descriptions = [
            'Allocated' => [
                "Asset {$assetName} allocated for official use",
                "Assigned {$assetName} for project work",
                "Allocated {$assetName} for daily operations",
                "Issued {$assetName} for field work"
            ],
            'Returned' => [
                "Asset {$assetName} returned in good condition",
                "Successfully returned {$assetName} after project completion",
                "Asset {$assetName} returned due to role change",
                "Returned {$assetName} as per policy requirements"
            ],
            'Under Maintenance' => [
                "Asset {$assetName} sent for repair",
                "Maintenance required for {$assetName}",
                "Hardware issue reported for {$assetName}",
                "Preventive maintenance for {$assetName}"
            ],
            'Lost/Damaged' => [
                "Asset {$assetName} reported lost",
                "Accidental damage to {$assetName}",
                "Asset {$assetName} stolen during travel",
                "Hardware failure in {$assetName}"
            ]
        ];

        $statusDescriptions = $descriptions[$status] ?? $descriptions['Allocated'];
        return $statusDescriptions[array_rand($statusDescriptions)];
    }
}