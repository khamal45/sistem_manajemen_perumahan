import MenuLayout from '@/layouts/custom/menu-layout';
import { router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';

const PengeluaranCreate = () => {
    const today = new Date().toISOString().split('T')[0];
    const [form, setForm] = useState({
        tanggal: today,
        amount: '',
        description: '',
        username: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        router.post('/pengeluaran', form);
    };

    return (
        <MenuLayout>
            <h1 className="mb-4 text-2xl font-bold">Tambah Pengeluaran</h1>
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
                    <label className="block font-medium">Pengguna</label>
                    <input
                        type="text"
                        required
                        name="username"
                        value={form.username}
                        onChange={handleChange}
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

                <div className="text-right">
                    <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                        Simpan
                    </button>
                </div>
            </form>
        </MenuLayout>
    );
};

export default PengeluaranCreate;
