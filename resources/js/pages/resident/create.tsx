// File: resources/js/Pages/Resident/Create.tsx

import { FormEvent, useState } from 'react';

interface PageProps {
    house_residents_id: number;
}

const Create = ({ house_residents_id }: PageProps) => {
    const [form, setForm] = useState({
        nama_lengkap: '',
        no_telp: '',
        status_menikah: '0',
        tipe_penghuni: '',
        foto_ktp: null as File | null,
        house_resident_id: house_residents_id,
    });

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setForm((prev) => ({ ...prev, foto_ktp: file }));
        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            setPreviewUrl(null);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const data = new FormData();
        data.append('nama_lengkap', form.nama_lengkap);
        data.append('no_telp', form.no_telp);
        data.append('status_menikah', form.status_menikah);
        data.append('tipe_penghuni', form.tipe_penghuni);
        data.append('house_residents_id', String(form.house_resident_id));
        if (form.foto_ktp) {
            data.append('foto_ktp', form.foto_ktp);
        }

        try {
            const response = await fetch(`/residents`, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                    Accept: 'application/json',
                },
                body: data,
            });

            if (response.ok) {
                const res = await response.json();
                if (res.house_id) {
                    window.location.href = `/houses/${res.house_id}/residents`;
                }
            } else {
                alert('Gagal menyimpan data');
            }
        } catch (error) {
            alert('Terjadi kesalahan jaringan');
        }
    };

    return (
        <div className="mx-auto max-w-xl p-6">
            <h1 className="mb-4 text-2xl font-bold">Tambah Anggota Keluarga</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium">Nama Lengkap</label>
                    <input
                        type="text"
                        name="nama_lengkap"
                        value={form.nama_lengkap}
                        onChange={handleChange}
                        required
                        className="w-full rounded border px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block font-medium">No. Telepon</label>
                    <input type="text" name="no_telp" value={form.no_telp} onChange={handleChange} className="w-full rounded border px-3 py-2" />
                </div>

                <div>
                    <label className="block font-medium">Status Menikah</label>
                    <select name="status_menikah" value={form.status_menikah} onChange={handleChange} className="w-full rounded border px-3 py-2">
                        <option value="0">Belum</option>
                        <option value="1">Sudah</option>
                    </select>
                </div>

                <div>
                    <label className="block font-medium">Tipe Penghuni</label>
                    <input
                        type="text"
                        name="tipe_penghuni"
                        value={form.tipe_penghuni}
                        onChange={handleChange}
                        required
                        className="w-full rounded border px-3 py-2"
                    />
                </div>

                <div>
                    <label className="mb-1 block font-medium">Foto KTP / KK</label>
                    <div className="relative">
                        <label className="inline-block cursor-pointer rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                            Pilih File
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="absolute top-0 left-0 h-full w-full cursor-pointer opacity-0"
                            />
                        </label>
                        {form.foto_ktp && <span className="ml-4 text-sm text-gray-700">{form.foto_ktp.name}</span>}
                    </div>
                    {previewUrl && <img src={previewUrl} alt="Preview KTP" className="mt-2 max-h-64 rounded border" />}
                </div>

                <div className="text-right">
                    <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                        Simpan
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Create;
