// File: resources/js/Pages/Resident/Search.tsx

import MenuLayout from '@/layouts/custom/menu-layout';
import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface ResidentResult {
    id: number;
    nama_lengkap: string;
    no_telp: string;
    foto_ktp: string | null;
    nomor_rumah: string | null;
    status_menikah: number;
    tipe_penghuni: string;
    house_id: number;
}

const SearchResident = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<ResidentResult[]>([]);
    const [previewKTP, setPreviewKTP] = useState<string | null>(null);

    const handleSearch = async () => {
        if (!query.trim()) return;
        const response = await fetch(`/resident/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        setResults(data);
    };

    useEffect(() => {
        const delay = setTimeout(() => {
            if (query.length >= 2) handleSearch();
        }, 300);
        return () => clearTimeout(delay);
    }, [query]);

    return (
        <MenuLayout>
            <h1 className="mb-4 text-2xl font-bold">Cari Penghuni</h1>

            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari berdasarkan nama..."
                className="mb-4 w-full rounded border px-3 py-2"
            />

            <table className="w-full border text-sm">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border px-4 py-2 text-left">Nama</th>
                        <th className="border px-4 py-2 text-left">No. Telp</th>
                        <th className="border px-4 py-2 text-left">Status Menikah</th>
                        <th className="border px-4 py-2 text-left">Tipe Penghuni</th>
                        <th className="border px-4 py-2 text-left">Nomor Rumah Terakhir</th>
                        <th className="border px-4 py-2 text-left">KTP/KK</th>
                        <th className="border px-4 py-2 text-left">Lihat Detail Keluarga</th>
                    </tr>
                </thead>
                <tbody>
                    {results.map((res) => (
                        <tr key={res.id}>
                            <td className="border px-4 py-2">{res.nama_lengkap}</td>
                            <td className="border px-4 py-2">{res.no_telp}</td>
                            <td className="border px-4 py-2">{res.status_menikah ? 'Sudah' : 'Belum'}</td>
                            <td className="border px-4 py-2">{res.tipe_penghuni}</td>
                            <td className="border px-4 py-2">{res.nomor_rumah || '-'}</td>
                            <td className="border px-4 py-2">
                                {res.foto_ktp ? (
                                    <button onClick={() => setPreviewKTP(`/storage/${res.foto_ktp}`)} className="text-blue-500 hover:underline">
                                        Lihat KTP/KK
                                    </button>
                                ) : (
                                    '-'
                                )}
                            </td>
                            <td className="border px-4 py-2">
                                {res.foto_ktp ? (
                                    <Link href={`/house-resident/${res.house_id}/residents`}>
                                        <button className="text-blue-500 hover:underline">Lihat Keluarga</button>
                                    </Link>
                                ) : (
                                    '-'
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {previewKTP && (
                <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black" onClick={() => setPreviewKTP(null)}>
                    <div className="max-w-full p-4">
                        <img src={previewKTP} alt="Preview KTP" className="max-h-screen rounded shadow-lg" />
                    </div>
                </div>
            )}
        </MenuLayout>
    );
};

export default SearchResident;
