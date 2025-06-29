import MenuLayout from '@/layouts/custom/menu-layout';
import { router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';

const FixedExpenseCreate = () => {
    const [form, setForm] = useState({
        name: '',
        amount: '',
        tanggal_berlaku: '',
        username: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const response = await fetch('/fixed-expense', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                Accept: 'application/json',
            },
            body: JSON.stringify(form),
        });

        if (response.ok) {
            router.visit('/fixed-expense');
        } else {
            alert('Gagal menyimpan data. Periksa input atau server.');
        }
    };

    return (
        <MenuLayout>
            <h1 className="mb-4 text-2xl font-bold">Tambah Pengeluaran Tetap</h1>

            <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
                <div>
                    <label className="block font-medium">Nama Pengeluaran</label>
                    <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full rounded border px-3 py-2" />
                </div>

                <div>
                    <label className="block font-medium">Nominal</label>
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
                    <label className="block font-medium">Tanggal Berlaku</label>
                    <input
                        type="date"
                        name="tanggal_berlaku"
                        value={form.tanggal_berlaku}
                        onChange={handleChange}
                        required
                        className="w-full rounded border px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block font-medium">Penguna</label>
                    <input type="text" name="username" value={form.username} onChange={handleChange} className="w-full rounded border px-3 py-2" />
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

export default FixedExpenseCreate;
