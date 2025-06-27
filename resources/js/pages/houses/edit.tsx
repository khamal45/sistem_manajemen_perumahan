import { House_Model } from '@/model/house_model';
import { alertSuccess } from '@/utils/swal';
import { Link, router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';

const Edit = ({ house }: { house: House_Model }) => {
    const [nomor_rumah, setNomorRumah] = useState(house.nomor_rumah);
    const [errors, setErrors] = useState<{ nomor_rumah?: string }>({});

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setErrors({});

        router.put(
            `/houses/${house.id}`,
            { nomor_rumah },
            {
                onError: (err) => setErrors(err),
                onSuccess: () => {
                    alertSuccess('Data berhasil diperbarui.');
                },
            },
        );
    };

    return (
        <div className="p-6">
            <h1 className="mb-4 text-2xl font-bold">Edit Rumah</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="nomor_rumah" className="block font-medium">
                        Nomor Rumah
                    </label>
                    <input
                        type="text"
                        id="nomor_rumah"
                        value={nomor_rumah}
                        onChange={(e) => setNomorRumah(e.target.value)}
                        className="mt-1 w-full rounded border px-3 py-2"
                    />
                    {errors.nomor_rumah && <div className="text-sm text-red-500">{errors.nomor_rumah}</div>}
                </div>

                <div className="flex items-center gap-2">
                    <button type="submit" className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
                        Update
                    </button>
                    <Link href="/houses" className="rounded border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100">
                        Batal
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default Edit;
