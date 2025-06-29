import MenuLayout from '@/layouts/custom/menu-layout';
import { FormEvent, useState } from 'react';

interface PageProps {
    expense: {
        id: number;
        name: string;
        amount: string;
        tanggal_berlaku: string;
        username?: string;
    };
}

const FixedExpenseEdit = ({ expense }: PageProps) => {
    const [form, setForm] = useState({
        name: expense.name,
        amount: expense.amount,
        tanggal_berlaku: expense.tanggal_berlaku,
        username: expense.username || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        console.log(expense.id);
        const response = await fetch(`/fixed-expense/${expense.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                Accept: 'application/json',
            },
            body: JSON.stringify(form),
        });

        if (response.ok) {
            window.location.href = '/fixed-expense';
        } else {
            alert('Gagal memperbarui pengeluaran tetap.');
        }
    };

    return (
        <MenuLayout>
            <h1 className="mb-4 text-2xl font-bold">Edit Pengeluaran Tetap</h1>

            <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
                <div>
                    <label className="block font-medium">Nama Pengeluaran</label>
                    <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full rounded border px-3 py-2" />
                </div>

                <div>
                    <label className="block font-medium">Jumlah Biaya</label>
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
                    <label className="block font-medium">Tanggal Mulai Berlaku</label>
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
                    <label className="block font-medium">Pengguna yang Bertanggung Jawab</label>
                    <input type="text" name="username" value={form.username} onChange={handleChange} className="w-full rounded border px-3 py-2" />
                </div>

                <div className="text-right">
                    <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                        Perbarui
                    </button>
                </div>
            </form>
        </MenuLayout>
    );
};

export default FixedExpenseEdit;
