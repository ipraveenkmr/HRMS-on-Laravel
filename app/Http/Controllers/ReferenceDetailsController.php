<?php

namespace App\Http\Controllers;

use App\Models\ReferenceDetails;
use Illuminate\Http\Request;

class ReferenceDetailsController extends Controller
{
    public function index()
    {
        return ReferenceDetails::get();
    }
    public function store(Request $request)
    {
        $reference = ReferenceDetails::create($request->all());
        return response()->json($reference, 201);
    }

    public function update(Request $request, ReferenceDetails $employeeReference)
    {
        $employeeReference->update($request->all());
        return response()->json($employeeReference);
    }

    public function destroy(ReferenceDetails $employeeReference)
    {
        $employeeReference->delete();
        return response()->json(null, 204);
    }
}
