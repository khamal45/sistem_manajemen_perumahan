import MenuLayout from '@/layouts/custom/menu-layout';
import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface Expenditure {
    id: number;
    tanggal: string;
    amount: number;
    description: string;
    username?: string;
}

const PengeluaranIndex = () => {
    const [data, setData] = useState<Expenditure[]>([]);

    useEffect(() => {
        fetch('/keuangan/expenditures')
            .then((res) => res.json())
            .then(setData);
    }, []);

    return (
        <MenuLayout>
            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Manajemen Pengeluaran</h1>
                <div className="flex gap-2">
                    <Link href="/pengeluaran-tetap/unpaid-ui" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                        Bayar Tagihan Bulanan
                    </Link>
                    <Link href="/pengeluaran/create" className="rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700">
                        Tambah Pengeluaran
                    </Link>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[800px] border text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border px-3 py-2">Tanggal</th>
                            <th className="border px-3 py-2">Deskripsi</th>
                            <th className="border px-3 py-2">Nominal</th>
                            <th className="border px-3 py-2">Pengguna</th>
                            <th className="border px-3 py-2">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item) => (
                            <tr key={item.id}>
                                <td className="border px-3 py-2">{item.tanggal}</td>
                                <td className="border px-3 py-2">{item.description}</td>
                                <td className="border px-3 py-2 text-right">Rp{item.amount.toLocaleString('id-ID')}</td>
                                <td className="border px-3 py-2">{item.username ?? '-'}</td>
                                <td className="space-x-2 border px-3 py-2">
                                    <Link href={`/pengeluaran/${item.id}/edit`} className="text-blue-600 hover:underline">
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => {
                                            if (confirm('Yakin ingin menghapus pengeluaran ini?')) {
                                                fetch(`/pengeluaran/${item.id}`, {
                                                    method: 'POST',
                                                    headers: {
                                                        'X-CSRF-TOKEN':
                                                            (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                                                        'Content-Type': 'application/json',
                                                    },
                                                    body: JSON.stringify({ _method: 'DELETE' }),
                                                }).then(() => window.location.reload());
                                            }
                                        }}
                                        className="text-red-600 hover:underline"
                                    >
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </MenuLayout>
    );
};

export default PengeluaranIndex;
