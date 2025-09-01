<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\BranchDetail;
use App\Models\CompanyDetail;
use Illuminate\Http\JsonResponse;

class BranchController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            $branches = BranchDetail::with('companyDetail')->orderBy('created_at', 'desc')->get();
            return response()->json($branches);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to retrieve branches',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'company_name_id' => 'required|exists:company_details,id',
                'branch_name' => 'required|string|max:99',
                'branch_address' => 'nullable|string|max:199',
                'longitude' => 'required|string|max:99',
                'latitude' => 'required|string|max:99',
            ]);

            $branch = BranchDetail::create($validated);

            return response()->json([
                'message' => 'Branch created successfully',
                'branch' => $branch->load('companyDetail')
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'error' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to create branch',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function show(string $id): JsonResponse
    {
        try {
            $branch = BranchDetail::with(['companyDetail', 'employees'])->findOrFail($id);
            return response()->json($branch);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Branch not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to retrieve branch',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $branch = BranchDetail::findOrFail($id);

            $validated = $request->validate([
                'company_name_id' => 'sometimes|required|exists:company_details,id',
                'branch_name' => 'sometimes|required|string|max:99',
                'branch_address' => 'nullable|string|max:199',
                'longitude' => 'sometimes|required|string|max:99',
                'latitude' => 'sometimes|required|string|max:99',
            ]);

            $branch->update($validated);

            return response()->json([
                'message' => 'Branch updated successfully',
                'branch' => $branch->fresh()->load('companyDetail')
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Branch not found'
            ], 404);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'error' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to update branch',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(string $id): JsonResponse
    {
        try {
            $branch = BranchDetail::findOrFail($id);
            
            // Check if branch has associated employees
            if ($branch->employees()->count() > 0) {
                return response()->json([
                    'error' => 'Cannot delete branch with associated employees. Transfer employees first.'
                ], 422);
            }

            $branch->delete();

            return response()->json([
                'message' => 'Branch deleted successfully'
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Branch not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to delete branch',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function getByCompany(string $companyId): JsonResponse
    {
        try {
            $company = CompanyDetail::findOrFail($companyId);
            $branches = BranchDetail::where('company_name_id', $companyId)
                ->with('companyDetail')
                ->orderBy('branch_name')
                ->get();

            return response()->json([
                'company' => $company->company_name,
                'branches' => $branches
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Company not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to retrieve branches',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}