<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CompanyDetail;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;

class CompanyController extends Controller
{
    // File upload configuration
    private const UPLOAD_DIR = 'uploads';
    private const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];

    private function isValidImage($filename): bool
    {
        $extension = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
        return in_array('.' . $extension, self::ALLOWED_IMAGE_EXTENSIONS);
    }
    public function index(): JsonResponse
    {
        try {
            $companies = CompanyDetail::orderBy('created_at', 'desc')->get();
            return response()->json($companies);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to retrieve companies',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'company_name' => 'required|string|max:99',
                'company_address' => 'nullable|string|max:199',
                'support_email' => 'nullable|email|max:99',
                // 'longitude' => 'nullable|string|max:99',
                // 'latitude' => 'nullable|string|max:99',
                // 'cloudinary_email' => 'nullable|email|max:99',
                // 'cloudinary_preset' => 'nullable|string|max:99',
                // 'cloudinary_api' => 'nullable|string|max:99',
                // 'status' => ['nullable', Rule::in(['Active', 'Inactive'])],
                // 'logo' => 'nullable|string|max:255'
            ]);

            $company = CompanyDetail::create($request->all());

            return response()->json([
                'message' => 'Company created successfully',
                'company' => $company
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'error' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to create company',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function show(string $id): JsonResponse
    {
        try {
            $company = CompanyDetail::with('branchDetails')->findOrFail($id);
            return response()->json($company);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Company not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to retrieve company',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $company = CompanyDetail::findOrFail($id);

            $validated = $request->validate([
                'company_name' => 'sometimes|required|string|max:99',
                'company_address' => 'nullable|string|max:199',
                'support_email' => 'nullable|email|max:99',
                'longitude' => 'nullable|string|max:99',
                'latitude' => 'nullable|string|max:99',
                'cloudinary_email' => 'nullable|email|max:99',
                'cloudinary_preset' => 'nullable|string|max:99',
                'cloudinary_api' => 'nullable|string|max:99',
                'status' => ['nullable', Rule::in(['Active', 'Inactive'])],
                'logo' => 'nullable|string|max:255'
            ]);

            $company->update($request->all());

            return response()->json([
                'message' => 'Company updated successfully',
                'company' => $company->fresh()
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Company not found'
            ], 404);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'error' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to update company',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(string $id): JsonResponse
    {
        try {
            $company = CompanyDetail::findOrFail($id);
            
            // Check if company has associated branches or employees
            if ($company->branchDetails()->count() > 0) {
                return response()->json([
                    'error' => 'Cannot delete company with associated branches. Delete branches first.'
                ], 422);
            }

            if ($company->employees()->count() > 0) {
                return response()->json([
                    'error' => 'Cannot delete company with associated employees. Transfer employees first.'
                ], 422);
            }

            $company->delete();

            return response()->json([
                'message' => 'Company deleted successfully'
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Company not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to delete company',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function uploadLogo(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'file' => 'required' // 5MB max
            ]);

            $file = $request->file('file');

            if (!$this->isValidImage($file->getClientOriginalName())) {
                return response()->json([
                    'error' => 'Invalid file type. Only image files are allowed.'
                ], 400);
            }

            $extension = $file->getClientOriginalExtension();
            $uniqueFilename = 'company_logo_' . Str::uuid() . '.' . $extension;

            $file->move(public_path(self::UPLOAD_DIR), $uniqueFilename);

            return response()->json([
                'message' => 'Company logo uploaded successfully',
                'file_path' => '/' . self::UPLOAD_DIR . '/' . $uniqueFilename,
                'filename' => $uniqueFilename
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'error' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error uploading company logo: ' . $e->getMessage()
            ], 500);
        }
    }
}