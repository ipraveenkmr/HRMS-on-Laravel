<?php

namespace App\Http\Controllers;

use App\Models\EmployeeDetails;
use Illuminate\Http\Request;

class EmployeeDetailsController extends Controller
{
    public function index()
    {
        return EmployeeDetails::with(['account', 'references', 'offboarding'])->get();
    }

    public function store(Request $request)
    {
        $employee = EmployeeDetails::create($request->all());
        return response()->json($employee, 201);
    }

    public function show(EmployeeDetails $employee)
    {
        return $employee->load(['account', 'references', 'offboarding']);
    }

    public function update(Request $request, EmployeeDetails $employee)
    {
        $employee->update($request->all());
        return response()->json($employee);
    }

    public function destroy(EmployeeDetails $employee)
    {
        $employee->delete();
        return response()->json(null, 204);
    }
}
