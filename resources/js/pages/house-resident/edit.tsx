import MenuLayout from '@/layouts/custom/menu-layout';
import { FormEvent, useState } from 'react';

interface HouseResident {
    id: number;
    house_id: number;
    nama_keluarga: string;
    tanggal_masuk: string;
    tanggal_keluar: string | null;
}

interface PageProps {
    house_resident: HouseResident;
}

const Edit = ({ house_resident }: PageProps) => {
    const [form, setForm] = useState({
        nama_keluarga: house_resident.nama_keluarga,
        tanggal_masuk: house_resident.tanggal_masuk,
        tanggal_keluar: house_resident.tanggal_keluar ?? '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch(`/house-resident/${house_resident.id}`, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                    Accept: 'application/json',
                    'X-HTTP-Method-Override': 'PUT',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });

            if (response.ok) {
                window.location.href = `/house-resident/${house_resident.house_id}/residents`;
            } else {
                alert('Gagal memperbarui data');
            }
        } catch (error) {
            alert('Terjadi kesalahan jaringan');
        }
    };

    return (
        <MenuLayout>
            <h1 className="mb-4 text-2xl font-bold">Edit Penghuni Rumah</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium">Nama Keluarga</label>
                    <input
                        type="text"
                        name="nama_keluarga"
                        value={form.nama_keluarga}
                        onChange={handleChange}
                        required
                        className="w-full rounded border px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block font-medium">Tanggal Masuk</label>
                    <input
                        type="date"
                        name="tanggal_masuk"
                        value={form.tanggal_masuk}
                        onChange={handleChange}
                        required
                        className="w-full rounded border px-3 py-2"
                    />
                </div>

                {form.tanggal_keluar && (
                    <div>
                        <label className="block font-medium">Tanggal Keluar (Opsional)</label>
                        <input
                            type="date"
                            name="tanggal_keluar"
                            value={form.tanggal_keluar}
                            onChange={handleChange}
                            className="w-full rounded border px-3 py-2"
                        />
                    </div>
                )}

                <div className="text-right">
                    <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                        Perbarui
                    </button>
                </div>
            </form>
        </MenuLayout>
    );
};

export default Edit;
