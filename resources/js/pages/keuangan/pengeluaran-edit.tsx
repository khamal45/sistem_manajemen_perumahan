import MenuLayout from '@/layouts/custom/menu-layout';
import { router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';

interface FeeExpense {
    id: number;
    name: string;
    amount: number;
    username?: string;
}

interface Pengeluaran {
    id: number;
    tanggal: string;
    fee_expense_id: number;
    fee_expense: FeeExpense;
}

interface PageProps {
    pengeluaran: Pengeluaran;
}

const PengeluaranEdit = ({ pengeluaran }: PageProps) => {
    const [form, setForm] = useState({
        tanggal: pengeluaran.tanggal,
        fee_expense_id: pengeluaran.fee_expense_id,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const response = await fetch(`/pengeluaran/${pengeluaran.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
            },
            body: JSON.stringify(form),
        });

        if (response.ok) {
            router.visit('/pengeluaran');
        } else {
            alert('Gagal memperbarui pengeluaran.');
        }
    };

    return (
        <MenuLayout>
            <h1 className="mb-4 text-2xl font-bold">Edit Pengeluaran</h1>

            <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
                <div>
                    <label className="block font-medium">Tanggal</label>
                    <input
                        type="date"
                        name="tanggal"
                        value={form.tanggal}
                        onChange={handleChange}
                        required
                        className="w-full rounded border px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block font-medium">Jenis Pengeluaran</label>
                    <input
                        type="text"
                        value={pengeluaran.fee_expense?.name ?? '-'}
                        readOnly
                        className="w-full rounded border bg-gray-100 px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block font-medium">Jumlah</label>
                    <input
                        type="text"
                        value={`Rp${pengeluaran.fee_expense?.amount?.toLocaleString('id-ID')}`}
                        readOnly
                        className="w-full rounded border bg-gray-100 px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block font-medium">Pengguna</label>
                    <input
                        type="text"
                        value={pengeluaran.fee_expense?.username ?? '-'}
                        readOnly
                        className="w-full rounded border bg-gray-100 px-3 py-2"
                    />
                </div>

                <div className="text-right">
                    <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                        Simpan Perubahan
                    </button>
                </div>
            </form>
        </MenuLayout>
    );
};

export default PengeluaranEdit;
