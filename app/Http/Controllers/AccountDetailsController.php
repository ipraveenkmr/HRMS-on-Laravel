<?php

namespace App\Http\Controllers;

use App\Models\AccountDetails;
use Illuminate\Http\Request;

class AccountDetailsController extends Controller
{
    public function index()
    {
        return AccountDetails::get();
    }
    public function store(Request $request)
    {
        $account = AccountDetails::create($request->all());
        return response()->json($account, 201);
    }

    public function update(Request $request, AccountDetails $employeeAccount)
    {
        $employeeAccount->update($request->all());
        return response()->json($employeeAccount);
    }
    public function show($id)
    {
        $account = AccountDetails::with('employeeDetails')->findOrFail($id);
        return response()->json($account);
    }
}
