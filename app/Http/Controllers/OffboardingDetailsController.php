<?php

namespace App\Http\Controllers;

use App\Models\OffboardingDetails;
use Illuminate\Http\Request;

class OffboardingDetailsController extends Controller
{
    public function index()
    {
        return OffboardingDetails::get();
    }
    public function store(Request $request)
    {
        $offboarding = OffboardingDetails::create($request->all());
        return response()->json($offboarding, 201);
    }

    public function update(Request $request, OffboardingDetails $employeeOffboarding)
    {
        $employeeOffboarding->update($request->all());
        return response()->json($employeeOffboarding);
    }
}
