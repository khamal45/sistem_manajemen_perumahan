<?php

namespace App\Http\Controllers;

use App\Models\Resident;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class ResidentController extends Controller
{
    public function create($house_residents_id)
    {
        return Inertia::render('resident/create', [
            'house_residents_id' => (int) $house_residents_id,
        ]);
    }
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'house_residents_id' => 'required|exists:house_residents,id',
            'nama_lengkap'       => 'required|string|max:255',
            'no_telp'            => 'nullable|string|max:20',
            'status_menikah'     => 'required|boolean',
            'tipe_penghuni'      => 'required|string|max:50',
            'foto_ktp'           => 'nullable|image|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();

        if ($request->hasFile('foto_ktp')) {
            $data['foto_ktp'] = $request->file('foto_ktp')->store('ktp', 'public');
        }

        $resident = Resident::create($data);


        $house_id = DB::table('house_residents')
            ->where('id', $resident->house_residents_id)
            ->value('house_id');


        return response()->json([
            'status'   => 'success',
            'message'  => 'Data penghuni berhasil disimpan.',
            'house_id' => $house_id,
        ]);
    }
    public function edit(Resident $resident)
    {
        return Inertia::render('resident/edit', [
            'resident' => $resident
        ]);
    }

    public function update(Request $request, Resident $resident)
    {
        $validator = Validator::make($request->all(), [
            'nama_lengkap'       => 'required|string|max:255',
            'no_telp'            => 'nullable|string|max:20',
            'status_menikah'     => 'required|boolean',
            'tipe_penghuni'      => 'required|string|max:50',
            'foto_ktp'           => 'nullable|image|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();

        // handle file baru
        if ($request->hasFile('foto_ktp')) {
            // hapus file lama
            if ($resident->foto_ktp && Storage::disk('public')->exists($resident->foto_ktp)) {
                Storage::disk('public')->delete($resident->foto_ktp);
            }

            $data['foto_ktp'] = $request->file('foto_ktp')->store('ktp', 'public');
        }

        $resident->update($data);

        // ambil house_id untuk redirect
        $house_id = DB::table('house_residents')
            ->where('id', $resident->house_residents_id)
            ->value('house_id');

        return response()->json([
            'status' => 'success',
            'message' => 'Data penghuni berhasil diperbarui.',
            'house_id' => $house_id,
        ]);
    }

    public function destroy(Resident $resident)
    {
        $house_id = DB::table('house_residents')
            ->where('id', $resident->house_residents_id)
            ->value('house_id');

        // hapus file KTP jika ada
        if ($resident->foto_ktp && Storage::disk('public')->exists($resident->foto_ktp)) {
            Storage::disk('public')->delete($resident->foto_ktp);
        }

        $resident->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Data penghuni berhasil dihapus.',
            'house_id' => $house_id,
        ]);
    }


    public function search(Request $request)
    {
        $query = $request->query('q');

        $results = DB::table('residents')
            ->leftJoin('house_residents', 'residents.house_residents_id', '=', 'house_residents.id')
            ->leftJoin('houses', 'house_residents.house_id', '=', 'houses.id')
            ->select(
                'residents.id',
                'residents.nama_lengkap',
                'residents.no_telp',
                'residents.foto_ktp',
                'residents.tipe_penghuni',
                'houses.nomor_rumah',
                'houses.id as house_id'
            )
            ->when($query, function ($q) use ($query) {
                $q->where(function ($sub) use ($query) {
                    $sub->where('residents.nama_lengkap', 'like', '%' . $query . '%')
                        ->orWhere('residents.no_telp', 'like', '%' . $query . '%');
                });
            })
            ->orderBy('residents.nama_lengkap')
            ->limit(20)
            ->get();

        return response()->json($results);
    }

    public function searchUI()
    {
        return Inertia::render('resident/search');
    }
}
