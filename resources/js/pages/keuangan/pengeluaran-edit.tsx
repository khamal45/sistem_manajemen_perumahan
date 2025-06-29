// File: resources/js/Pages/Keuangan/PengeluaranEdit.tsx

import MenuLayout from '@/layouts/custom/menu-layout';
import { router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';

interface PengeluaranEditProps {
    pengeluaran: {
        id: number;
        tanggal: string;
        amount: number;
        description: string;
        username: string;
    };
}

const PengeluaranEdit = ({ pengeluaran }: PengeluaranEditProps) => {
    const [form, setForm] = useState({
        tanggal: pengeluaran.tanggal,
        amount: pengeluaran.amount.toString(),
        description: pengeluaran.description,
        username: pengeluaran.username,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        router.post(`/pengeluaran/${pengeluaran.id}`, {
            _method: 'PUT',
            ...form,
        });
    };

    return (
        <MenuLayout>
            <h1 className="mb-4 text-2xl font-bold">Edit Pengeluaran</h1>
            <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
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
                    <label className="block font-medium">Jumlah (Rp)</label>
                    <input
                        type="number"
                        name="amount"
                        value={form.amount}
                        onChange={handleChange}
                        required
                        className="w-full rounded border px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block font-medium">Deskripsi</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        required
                        className="w-full rounded border px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block font-medium">Pengguna</label>
                    <input
                        type="text"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        required
                        className="w-full rounded border px-3 py-2"
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
