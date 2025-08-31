<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class AuthController extends Controller
{
    public function signup(Request $request)
    {
        $fields = $request->validate([
            'username' => 'required|string|unique:users,username',
            'password' => 'required|string|min:6',
            'is_active' => 'sometimes|boolean',
        ]);

        // Check if user already exists
        $existingUser = User::where('username', $fields['username'])->first();
        if ($existingUser) {
            return response()->json(['result' => 'Exist']);
        }

        $user = User::create([
            'username' => $fields['username'],
            'hashed_password' => Hash::make($fields['password']),
            'is_active' => $fields['is_active'] ?? true,
            'created_at' => now(),
        ]);

        return response()->json([
            'result' => 'Created',
            'user_id' => $user->id
        ]);
    }

    public function login(Request $request)
    {
        $fields = $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = User::where('username', $fields['username'])->first();

        if (!$user || !Hash::check($fields['password'], $user->hashed_password)) {
            return response()->json([
                'detail' => 'Incorrect username or password'
            ], 401);
        }

        if (!$user->is_active) {
            return response()->json([
                'detail' => 'User account is inactive'
            ], 401);
        }

        $token = $user->createToken('hrms-token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer'
        ]);
    }

    public function getUsers()
    {
        try {
            $users = User::all();
            $result = [];

            foreach ($users as $user) {
                $result[] = [
                    'id' => $user->id,
                    'username' => $user->username,
                    'email' => null, // Default since field doesn't exist in DB yet
                    'role' => 'employee', // Default role
                    'employee_id' => null, // Default since field doesn't exist in DB yet
                    'permissions' => [], // Default empty permissions
                    'is_active' => $user->is_active,
                    'last_login' => null, // Default since field doesn't exist in DB yet
                    'created_at' => $user->created_at
                ];
            }

            return response()->json($result);
        } catch (\Exception $e) {
            return response()->json(['detail' => 'Database error: ' . $e->getMessage()], 500);
        }
    }

    public function updateUser(Request $request, $user_id)
    {
        $user = User::find($user_id);
        if (!$user) {
            return response()->json(['detail' => 'User not found'], 404);
        }

        $fields = $request->validate([
            'username' => 'sometimes|string',
            'password' => 'sometimes|string|min:6',
            'is_active' => 'sometimes|boolean',
        ]);

        // Check if username is being changed and already exists
        if (isset($fields['username']) && $fields['username'] !== $user->username) {
            $existingUser = User::where('username', $fields['username'])->first();
            if ($existingUser) {
                return response()->json(['result' => 'Username already exists']);
            }
        }

        // Update fields
        if (isset($fields['username'])) {
            $user->username = $fields['username'];
        }
        if (isset($fields['is_active'])) {
            $user->is_active = $fields['is_active'];
        }
        if (isset($fields['password'])) {
            $user->hashed_password = Hash::make($fields['password']);
        }

        $user->save();

        return response()->json(['result' => 'Updated']);
    }

    public function updateUserByUsername(Request $request, $username)
    {
        $user = User::where('username', $username)->first();
        if (!$user) {
            return response()->json(['detail' => 'User not found'], 404);
        }

        $fields = $request->validate([
            'username' => 'sometimes|string',
            'password' => 'sometimes|string|min:6',
            'is_active' => 'sometimes|boolean',
        ]);

        // Check if username is being changed and already exists
        if (isset($fields['username']) && $fields['username'] !== $user->username) {
            $existingUser = User::where('username', $fields['username'])->first();
            if ($existingUser) {
                return response()->json(['result' => 'Username already exists']);
            }
        }

        // Update fields
        if (isset($fields['username'])) {
            $user->username = $fields['username'];
        }
        if (isset($fields['is_active'])) {
            $user->is_active = $fields['is_active'];
        }
        if (isset($fields['password'])) {
            $user->hashed_password = Hash::make($fields['password']);
        }

        $user->save();

        return response()->json(['result' => 'Updated']);
    }

    public function resetUserPassword(Request $request, $user_id)
    {
        $user = User::find($user_id);
        if (!$user) {
            return response()->json(['detail' => 'User not found'], 404);
        }

        $fields = $request->validate([
            'new_password' => 'required|string|min:6',
        ]);

        $user->hashed_password = Hash::make($fields['new_password']);
        $user->save();

        return response()->json(['result' => 'Password updated']);
    }

    public function resetPasswordByUsername(Request $request, $username)
    {
        $user = User::where('username', $username)->first();
        if (!$user) {
            return response()->json(['detail' => 'User not found'], 404);
        }

        $fields = $request->validate([
            'new_password' => 'required|string|min:6',
        ]);

        $user->hashed_password = Hash::make($fields['new_password']);
        $user->save();

        return response()->json(['result' => 'Password reset successfully']);
    }

    public function deleteUser($user_id)
    {
        $user = User::find($user_id);
        if (!$user) {
            return response()->json(['detail' => 'User not found'], 404);
        }

        $user->delete();

        return response()->json(['result' => 'Deleted']);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Successfully logged out']);
    }
}
