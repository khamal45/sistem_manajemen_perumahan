import MenuLayout from '@/layouts/custom/menu-layout';
import { router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';

const FeeTypeCreate = () => {
    const today = new Date().toISOString().split('T')[0];

    const [form, setForm] = useState({
        nama: '',
        nominal: '',
        tanggal_berlaku: today,
        is_bulanan: false,
        durasi_bulan: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        const nominalAsNumber = parseFloat(form.nominal);
        const durasiAsNumber = parseInt(form.durasi_bulan || '0');

        const payload: any = {
            nama: form.nama,
            nominal: form.is_bulanan ? nominalAsNumber : Math.round(nominalAsNumber / durasiAsNumber),
            tanggal_berlaku: form.tanggal_berlaku,
            tanggal_berakhir: form.is_bulanan ? null : generateTanggalBerakhir(form.tanggal_berlaku, durasiAsNumber),
        };

        router.post('/pemasukan', payload);
    };

    const generateTanggalBerakhir = (start: string, duration: number) => {
        const date = new Date(start + 'T00:00:00');
        date.setMonth(date.getMonth() + duration - 1);
        return date.toISOString().split('T')[0];
    };

    const calculatedNominalPerBulan = () => {
        const total = parseFloat(form.nominal);
        const durasi = parseInt(form.durasi_bulan || '0');
        if (!form.is_bulanan && total > 0 && durasi > 0) {
            return Math.round(total / durasi);
        }
        return null;
    };

    return (
        <MenuLayout>
            <h1 className="mb-4 text-2xl font-bold">Tambah Jenis Pemasukan</h1>

            <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
                <div>
                    <label className="block font-medium">Nama Pemasukan</label>
                    <input type="text" name="nama" value={form.nama} onChange={handleChange} required className="w-full rounded border px-3 py-2" />
                </div>

                <div>
                    <label className="block font-medium">Total Nominal</label>
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

                <div className="flex items-center gap-2">
                    <input type="checkbox" name="is_bulanan" checked={form.is_bulanan} onChange={handleChange} />
                    <label className="block font-medium">Ini Tagihan Wajib Bulanan</label>
                </div>

                {!form.is_bulanan && (
                    <>
                        <div>
                            <label className="block font-medium">Dibayar Selama (bulan)</label>
                            <input
                                type="number"
                                name="durasi_bulan"
                                value={form.durasi_bulan}
                                onChange={handleChange}
                                min={1}
                                required
                                className="w-full rounded border px-3 py-2"
                            />
                            <p className="text-sm text-gray-500">Nominal per bulan akan dihitung otomatis.</p>
                        </div>

                        {calculatedNominalPerBulan() !== null && (
                            <div className="rounded border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700">
                                Estimasi tagihan per bulan: <strong>Rp{calculatedNominalPerBulan()?.toLocaleString('id-ID')}</strong>
                            </div>
                        )}
                    </>
                )}

                <div className="text-right">
                    <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                        Simpan
                    </button>
                </div>
            </form>
        </MenuLayout>
    );
};

export default FeeTypeCreate;
