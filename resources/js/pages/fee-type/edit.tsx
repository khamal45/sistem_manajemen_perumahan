import MenuLayout from '@/layouts/custom/menu-layout';
import { router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';

interface FeeTypeProps {
    fee_type: {
        id: number;
        nama: string;
        nominal: number;
        tanggal_berlaku: string;
        tanggal_berakhir?: string | null;
    };
}

const FeeTypeEdit = ({ fee_type }: FeeTypeProps) => {
    const [form, setForm] = useState({
        nama: fee_type.nama,
        nominal: fee_type.nominal.toString(),
        tanggal_berlaku: fee_type.tanggal_berlaku,
        tanggal_berakhir: fee_type.tanggal_berakhir ?? '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        router.put(`/pemasukan/${fee_type.id}`, form);
    };

    return (
        <MenuLayout>
            <h1 className="mb-4 text-2xl font-bold">Edit Jenis Pemasukan</h1>

            <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
                <div>
                    <label className="block font-medium">Nama Pemasukan</label>
                    <input type="text" name="nama" value={form.nama} onChange={handleChange} required className="w-full rounded border px-3 py-2" />
                </div>

                <div>
                    <label className="block font-medium">Nominal (Rp)</label>
                    <input
                        type="number"
                        name="nominal"
                        value={form.nominal}
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
                    <label className="block font-medium">Tanggal Berakhir (Opsional)</label>
                    <input
                        type="date"
                        name="tanggal_berakhir"
                        value={form.tanggal_berakhir}
                        onChange={handleChange}
                        className="w-full rounded border px-3 py-2"
                    />
                    <p className="text-sm text-gray-500">Kosongkan jika tagihan ini bersifat bulanan tanpa akhir.</p>
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

export default FeeTypeEdit;
