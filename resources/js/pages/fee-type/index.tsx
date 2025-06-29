import MenuLayout from '@/layouts/custom/menu-layout';
import { Link } from '@inertiajs/react';

interface FeeType {
    id: number;
    nama: string;
    nominal: number;
    tanggal_berlaku: string;
    tanggal_berakhir?: string | null;
}

interface Props {
    fee_types: FeeType[];
}

const FeeTypeIndex = ({ fee_types }: Props) => {
    return (
        <MenuLayout>
            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Tagihan Bulanan Warga</h1>
                <Link href="/pemasukan/create" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                    Tambah
                </Link>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[800px] border text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border px-3 py-2">Nama</th>
                            <th className="border px-3 py-2">Nominal</th>
                            <th className="border px-3 py-2">Mulai</th>
                            <th className="border px-3 py-2">Berakhir</th>
                            <th className="border px-3 py-2">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fee_types.map((item) => (
                            <tr key={item.id}>
                                <td className="border px-3 py-2">{item.nama}</td>
                                <td className="border px-3 py-2 text-right">Rp{item.nominal.toLocaleString('id-ID')}</td>
                                <td className="border px-3 py-2">{item.tanggal_berlaku}</td>
                                <td className="border px-3 py-2">{item.tanggal_berakhir ?? '-'}</td>
                                <td className="space-x-2 border px-3 py-2">
                                    <Link href={`/pemasukan/${item.id}/edit`} className="text-blue-600 hover:underline">
                                        Edit
                                    </Link>
                                    <Link method="delete" as="button" href={`/pemasukan/${item.id}`} className="text-red-600 hover:underline">
                                        Hapus
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </MenuLayout>
    );
};

export default FeeTypeIndex;
