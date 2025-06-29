import { FormEvent, useState } from 'react';

interface PageProps {
    house_id: number;
}

const Create = ({ house_id }: PageProps) => {
    const [form, setForm] = useState({
        house_id: house_id,
        nama_keluarga: '',
        tanggal_masuk: '',
        tanggal_keluar: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch(`/house-resident/`, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });

            if (response.ok) {
                console.log(response.json());
                // window.location.href = `/houses/${house_id}/residents`;
            } else {
                alert('Gagal menyimpan data');
            }
        } catch (error) {
            alert('Terjadi kesalahan jaringan');
        }
    };

    return (
        <div className="mx-auto max-w-xl p-6">
            <h1 className="mb-4 text-2xl font-bold">Tambah Penghuni Rumah</h1>

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

                {/* <div>
                    <label className="block font-medium">Tanggal Keluar (Opsional)</label>
                    <input
                        type="date"
                        name="tanggal_keluar"
                        value={form.tanggal_keluar}
                        onChange={handleChange}
                        className="w-full rounded border px-3 py-2"
                    />
                </div> */}

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
