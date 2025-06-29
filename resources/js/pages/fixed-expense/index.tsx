import MenuLayout from '@/layouts/custom/menu-layout';
import { Link } from '@inertiajs/react';

interface FixedExpense {
    id: number;
    name: string;
    amount: number;
    tanggal_berlaku: string;
    username?: string;
}

interface PageProps {
    expenses: FixedExpense[];
}

const FixedExpenseIndex = ({ expenses }: PageProps) => {
    return (
        <MenuLayout>
            <div className="mb-4 flex justify-between">
                <h1 className="text-2xl font-bold">Daftar Pengeluaran Tetap</h1>

                <div className="flex gap-3">
                    <Link href="/fixed-expense/create" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                        Bayar Pengeluaran Tetap
                    </Link>
                    <Link href="/fixed-expense/create" className="rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700">
                        Tambah Pengeluaran Tetap
                    </Link>
                </div>
            </div>

            <table className="w-full border text-sm">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border px-4 py-2">Nama</th>
                        <th className="border px-4 py-2">Nominal</th>
                        <th className="border px-4 py-2">Tanggal Berlaku</th>
                        <th className="border px-4 py-2">Username</th>
                        <th className="border px-4 py-2">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {expenses.map((e) => (
                        <tr key={e.id}>
                            <td className="border px-4 py-2">{e.name}</td>
                            <td className="border px-4 py-2">Rp{Number(e.amount).toLocaleString('id-ID')}</td>
                            <td className="border px-4 py-2">{e.tanggal_berlaku}</td>
                            <td className="border px-4 py-2">{e.username ?? '-'}</td>
                            <td className="border px-4 py-2">
                                <Link href={`/fixed-expense/${e.id}/edit`} className="mr-2 text-blue-600 hover:underline">
                                    Edit
                                </Link>
                                <Link method="delete" as="button" href={`/fixed-expense/${e.id}`} className="text-red-600 hover:underline">
                                    Hapus
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </MenuLayout>
    );
};

export default FixedExpenseIndex;
