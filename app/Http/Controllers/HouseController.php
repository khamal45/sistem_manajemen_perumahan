<?php

namespace App\Http\Controllers;

use App\Models\House;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HouseController extends Controller
{
    public function index()
    {
        $houses = House::with('houseResidents')->get();
        return Inertia::render('houses/index', [
            'houses' => $houses,
        ]);
    }

    public function create()
    {
        return Inertia::render('houses/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nomor_rumah' => 'required|string|max:255',
        ]);

        House::create($validated);

        return redirect()->route('houses.index')->with('success', 'House created successfully.');
    }

    public function edit(House $house)
    {
        return Inertia::render('houses/edit', [
            'house' => $house,
        ]);
    }

    public function update(Request $request, House $house)
    {
        $validated = $request->validate([
            'nomor_rumah' => 'required|string|max:255',
        ]);

        $house->update($validated);

        return redirect()->route('houses.index')->with('success', 'House updated successfully.');
    }

    public function destroy(House $house)
    {
        $house->delete();

        return redirect()->route('houses.index')->with('success', 'House deleted successfully.');
    }

    public function management()
    {
        $houses = House::with('houseResidents.residents')->get();

        return Inertia::render('house-management-menu', [
            'houses' => $houses,
        ]);
    }
}
