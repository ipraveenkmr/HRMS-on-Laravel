<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Asset;
use App\Models\AssetAllocation;
use App\Models\AssetCategory;
use Illuminate\Http\JsonResponse;

class AssetController extends Controller
{
    // Assets
    public function index(): JsonResponse
    {
        $assets = Asset::with(['assetCategory'])
            ->orderBy('created_at')
            ->get();
        
        return response()->json($assets);
    }

    public function show($id): JsonResponse
    {
        $asset = Asset::with(['assetCategory'])->find($id);
        
        if (!$asset) {
            return response()->json(['error' => 'Asset not found'], 404);
        }
        
        return response()->json($asset);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'asset_category_id' => 'required|exists:asset_categories,id',
            'asset_name' => 'nullable|string|max:99',
            'manufacturer' => 'nullable|string|max:99',
            'model_number' => 'nullable|string|max:99',
            'serial_number' => 'nullable|string|max:99',
            'support_link' => 'nullable|string|max:99',
            'purchasing_date' => 'nullable|date',
            'active_service_date' => 'nullable|date',
            'purchasing_value' => 'nullable|string|max:99',
            'description' => 'nullable|string',
        ]);

        $asset = Asset::create($validated);
        
        return response()->json([
            'message' => 'Asset created successfully',
            'asset' => $asset->load(['assetCategory'])
        ], 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $asset = Asset::find($id);
        
        if (!$asset) {
            return response()->json(['error' => 'Asset not found'], 404);
        }

        $validated = $request->validate([
            'asset_category_id' => 'sometimes|exists:asset_categories,id',
            'asset_name' => 'nullable|string|max:99',
            'manufacturer' => 'nullable|string|max:99',
            'model_number' => 'nullable|string|max:99',
            'serial_number' => 'nullable|string|max:99',
            'support_link' => 'nullable|string|max:99',
            'purchasing_date' => 'nullable|date',
            'active_service_date' => 'nullable|date',
            'purchasing_value' => 'nullable|string|max:99',
            'description' => 'nullable|string',
        ]);

        $asset->update($validated);
        
        return response()->json([
            'message' => 'Asset updated successfully',
            'asset' => $asset->load(['assetCategory'])
        ]);
    }

    public function destroy($id): JsonResponse
    {
        $asset = Asset::find($id);
        
        if (!$asset) {
            return response()->json(['error' => 'Asset not found'], 404);
        }
        
        $asset->delete();
        
        return response()->json(['message' => 'Asset deleted successfully']);
    }

    // Asset Allocations
    public function indexAllocations(): JsonResponse
    {
        $allocations = AssetAllocation::with(['asset', 'employee', 'department'])
            ->orderBy('created_at')
            ->get();
        
        return response()->json($allocations);
    }

    public function showAllocation($id): JsonResponse
    {
        $allocation = AssetAllocation::with(['asset', 'employee', 'department'])->find($id);
        
        if (!$allocation) {
            return response()->json(['error' => 'Asset allocation not found'], 404);
        }
        
        return response()->json($allocation);
    }

    public function storeAllocation(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'asset_id' => 'required|exists:assets,id',
            'asset_category' => 'nullable|integer',
            'username' => 'nullable|string|max:200',
            'employee_id' => 'required|exists:employees,id',
            'department_id' => 'required|exists:departments,id',
            'allocation_date' => 'nullable|string|max:99',
            'allocation_upto' => 'nullable|string|max:99',
            'return_date' => 'nullable|string|max:99',
            'status' => 'nullable|string|max:99',
            'description' => 'nullable|string',
        ]);

        $allocation = AssetAllocation::create($validated);
        
        return response()->json([
            'message' => 'Asset allocation created successfully',
            'allocation' => $allocation->load(['asset', 'employee', 'department'])
        ], 201);
    }

    public function updateAllocation(Request $request, $id): JsonResponse
    {
        $allocation = AssetAllocation::find($id);
        
        if (!$allocation) {
            return response()->json(['error' => 'Asset allocation not found'], 404);
        }

        $validated = $request->validate([
            'asset_id' => 'sometimes|exists:assets,id',
            'asset_category' => 'nullable|integer',
            'username' => 'nullable|string|max:200',
            'employee_id' => 'sometimes|exists:employees,id',
            'department_id' => 'sometimes|exists:departments,id',
            'allocation_date' => 'nullable|string|max:99',
            'allocation_upto' => 'nullable|string|max:99',
            'return_date' => 'nullable|string|max:99',
            'status' => 'nullable|string|max:99',
            'description' => 'nullable|string',
        ]);

        $allocation->update($validated);
        
        return response()->json([
            'message' => 'Asset allocation updated successfully',
            'allocation' => $allocation->load(['asset', 'employee', 'department'])
        ]);
    }

    public function destroyAllocation($id): JsonResponse
    {
        $allocation = AssetAllocation::find($id);
        
        if (!$allocation) {
            return response()->json(['error' => 'Asset allocation not found'], 404);
        }
        
        $allocation->delete();
        
        return response()->json(['message' => 'Asset allocation deleted successfully']);
    }

    public function getEmployeeAssets($employeeId): JsonResponse
    {
        $allocations = AssetAllocation::with(['asset', 'department'])
            ->where('employee_id', $employeeId)
            ->orderBy('created_at')
            ->get();
        
        return response()->json($allocations);
    }

    public function getAssetsByDepartment($departmentId): JsonResponse
    {
        $allocations = AssetAllocation::with(['asset', 'employee'])
            ->where('department_id', $departmentId)
            ->orderBy('created_at')
            ->get();
        
        return response()->json($allocations);
    }

    public function getEmployeeAllocationsByUsername($username): JsonResponse
    {
        $allocations = AssetAllocation::with(['asset.assetCategory', 'employee', 'department'])
            ->where('username', $username)
            ->orderBy('created_at', 'desc')
            ->get();
        
        return response()->json($allocations);
    }

    public function getAllocationsByManager($managerId): JsonResponse
    {
        // Get allocations for employees under this manager
        // First get all employees under this manager
        $employeeIds = \App\Models\Employee::where('manager_id', $managerId)
            ->pluck('id')
            ->toArray();
        
        $allocations = AssetAllocation::with(['asset.assetCategory', 'employee', 'department'])
            ->whereIn('employee_id', $employeeIds)
            ->orderBy('created_at', 'desc')
            ->get();
        
        return response()->json($allocations);
    }

    // Asset Categories
    public function indexCategories(): JsonResponse
    {
        $categories = AssetCategory::orderBy('created_at')->get();
        return response()->json($categories);
    }

    public function storeCategory(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category' => 'required|string|max:99|unique:asset_categories',
            'description' => 'nullable|string',
        ]);

        $category = AssetCategory::create($validated);
        
        return response()->json([
            'message' => 'Asset category created successfully',
            'category' => $category
        ], 201);
    }

    public function updateCategory(Request $request, $id): JsonResponse
    {
        $category = AssetCategory::find($id);
        
        if (!$category) {
            return response()->json(['error' => 'Asset category not found'], 404);
        }

        $validated = $request->validate([
            'category' => 'sometimes|string|max:99|unique:asset_categories,category,' . $id,
            'description' => 'nullable|string',
        ]);

        $category->update($validated);
        
        return response()->json([
            'message' => 'Asset category updated successfully',
            'category' => $category
        ]);
    }

    public function destroyCategory($id): JsonResponse
    {
        $category = AssetCategory::find($id);
        
        if (!$category) {
            return response()->json(['error' => 'Asset category not found'], 404);
        }
        
        $category->delete();
        
        return response()->json(['message' => 'Asset category deleted successfully']);
    }
}