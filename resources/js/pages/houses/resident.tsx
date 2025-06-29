import CustomModal from '@/components/custom/modal';
import MenuLayout from '@/layouts/custom/menu-layout';
import { HouseResidentModel } from '@/model/house_resident_model';
import { Resident_Model } from '@/model/resident_model';
import { alertSuccess, confirmDelete } from '@/utils/swal';
import { Link } from '@inertiajs/react';

import { useState } from 'react';

interface Props {
    house: {
        id: number;
        nomor_rumah: string;
    };
    house_residents: HouseResidentModel[];
}

const ByHouse = ({ house, house_residents }: Props) => {
    const active = house_residents.find((hr) => hr.tanggal_keluar === null);
    const history = house_residents.filter((hr) => hr.tanggal_keluar !== null);

    const [selectedKtp, setSelectedKtp] = useState<string | null>(null);
    const [modalResidentHouse, setModalResidnetHouse] = useState(false);

    const handleDelete = (id: number) => {
        confirmDelete().then((result) => {
            if (result.isConfirmed) {
                fetch(`/residents/${id}`, {
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ _method: 'DELETE' }),
                }).then(() => {
                    // Lebih baik dari reload: bisa kasih feedback
                    alertSuccess('Data berhasil dihapus.').then(() => {
                        window.location.reload(); // atau gunakan router.visit('/houses')
                    });
                });
            }
        });
    };

    const handleTanggalKeluar = async (e: React.FormEvent<HTMLFormElement>, residentId: number) => {
        e.preventDefault();

        const tanggalKeluarInput = (e.currentTarget.elements.namedItem('tanggal_keluar') as HTMLInputElement)?.value;

        if (!tanggalKeluarInput) {
            alert('Tanggal keluar wajib diisi');
            return;
        }

        try {
            const response = await fetch(`/house-resident/${residentId}`, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-HTTP-Method-Override': 'PUT',
                },
                body: JSON.stringify({ tanggal_keluar: tanggalKeluarInput }),
            });

            if (response.ok) {
                window.location.reload();
            } else {
                const data = await response.json();
                console.error(data);
                alert('Gagal menyimpan tanggal keluar');
            }
        } catch (error) {
            console.error(error);
            alert('Terjadi kesalahan jaringan');
        }
    };

    return (
        <MenuLayout>
            <h1 className="mb-6 text-2xl font-bold">Penghuni Rumah {house.nomor_rumah}</h1>

            <CustomModal isOpen={selectedKtp != null} onClose={() => setSelectedKtp(null)}>
                <img src={`/storage/${selectedKtp}`} alt="Foto KTP" className="max-h-[80vh] max-w-full" />
            </CustomModal>

            <div className="mb-8">
                <h2 className="mb-2 text-xl font-semibold">Penghuni Aktif</h2>
                {active ? (
                    <div className="rounded border bg-white p-4 shadow">
                        <div className="flex justify-between">
                            <div>
                                <p className="font-medium">{active.nama_keluarga}</p>
                                <p className="mb-4 text-sm text-gray-600">Masuk sejak: {active.tanggal_masuk}</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Link href={`/house-resident/${active.id}/edit`}>
                                    {' '}
                                    <button className="h-fit cursor-pointer rounded-md bg-blue-500 p-2 text-white">Ubah keluarga</button>
                                </Link>

                                <button
                                    className="h-fit cursor-pointer rounded-md bg-red-500 p-2 text-white"
                                    onClick={() => setModalResidnetHouse(true)}
                                >
                                    Keluarga ini sudah tidak tingal disini
                                </button>
                            </div>
                        </div>
                        {active.residents?.length ? (
                            <table className="mb-4 w-full border text-sm">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="border px-2 py-1 text-left">Nama Lengkap</th>
                                        <th className="border px-2 py-1 text-left">No. Telp</th>
                                        <th className="border px-2 py-1 text-left">Status Menikah</th>
                                        <th className="border px-2 py-1 text-left">Tipe Penghuni</th>
                                        <th className="border px-2 py-1 text-left">Foto KTP / KK</th>
                                        <th className="border px-2 py-1 text-left">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {active.residents?.map((res: Resident_Model) => (
                                        <tr key={res.id}>
                                            <td className="border px-2 py-1">{res.nama_lengkap}</td>
                                            <td className="border px-2 py-1">{res.no_telp}</td>
                                            <td className="border px-2 py-1">{res.status_menikah ? 'Sudah' : 'Belum'}</td>
                                            <td className="border px-2 py-1">{res.tipe_penghuni}</td>
                                            <td className="border px-2 py-1">
                                                {res.foto_ktp ? (
                                                    <button onClick={() => setSelectedKtp(res.foto_ktp)} className="text-blue-600 hover:underline">
                                                        Lihat KTP
                                                    </button>
                                                ) : (
                                                    <span className="text-gray-400">Tidak ada</span>
                                                )}
                                            </td>
                                            <td className="border px-2 py-1">
                                                <Link href={`/residents/${res.id}/edit`} className="mr-2 text-blue-500 hover:underline">
                                                    Edit
                                                </Link>
                                                <button onClick={() => handleDelete(res.id)} className="text-red-500 hover:underline">
                                                    Hapus
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <h5>Data keluarga belum ada</h5>
                        )}
                        <a
                            href={`/resident/${active.id}/create`}
                            className="inline-block rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                        >
                            Tambah Anggota Keluarga
                        </a>
                        <CustomModal
                            isOpen={modalResidentHouse}
                            onClose={() => {
                                setModalResidnetHouse(false);
                            }}
                        >
                            <form onSubmit={(e) => handleTanggalKeluar(e, active.id)} className="flex flex-col space-y-4">
                                <label htmlFor="tanggal_keluar" className="text-2xl font-bold">
                                    Tanggal Keluar
                                </label>
                                <input
                                    type="date"
                                    id="tanggal_keluar"
                                    defaultValue={new Date().toISOString().split('T')[0]}
                                    className="rounded border px-2 py-1"
                                />
                                <button className="rounded bg-blue-500 py-2 text-white hover:bg-blue-600">Simpan</button>
                            </form>
                        </CustomModal>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        <p className="text-gray-500 italic">Tidak ada penghuni aktif saat ini.</p>
                        <Link href={`/house-resident/${house.id}/create`}>
                            <button className="w-fit rounded-md bg-blue-500 p-2 text-white">Tambah keluarga</button>
                        </Link>
                    </div>
                )}
            </div>

            {/* History */}
            <div>
                <h2 className="mb-2 text-xl font-semibold">Riwayat Penghuni</h2>
                {history.length > 0 ? (
                    <div className="space-y-4">
                        {history.map((hr) => (
                            <div key={hr.id} className="rounded border bg-white p-4 shadow">
                                <p className="font-medium">{hr.nama_keluarga}</p>
                                <p className="text-sm text-gray-600">
                                    {hr.tanggal_masuk} sampai {hr.tanggal_keluar}
                                </p>
                                <ul className="list-disc pl-5">
                                    {hr.residents?.map((res: Resident_Model) => <li key={res.id}>{res.nama_lengkap}</li>)}
                                </ul>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 italic">Belum ada riwayat penghuni.</p>
                )}
            </div>
        </MenuLayout>
    );
};

export default ByHouse;
