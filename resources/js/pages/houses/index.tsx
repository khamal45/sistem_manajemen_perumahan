import MenuLayout from '@/layouts/custom/menu-layout';
import { House_Model_Props } from '@/model/house_model';
import { alertSuccess, confirmDelete } from '@/utils/swal';
import { Link } from '@inertiajs/react';

const Index = ({ houses }: House_Model_Props) => {
    return (
        <MenuLayout>
            <h1 className="mb-4 text-2xl font-bold">Daftar Rumah</h1>

            <Link href="/houses/create" className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
                + Tambah Rumah
            </Link>

            <table className="mt-4 w-full border">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border px-4 py-2">ID</th>
                        <th className="border px-4 py-2">Alamat</th>
                        <th className="border px-4 py-2">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {houses.map((house) => (
                        <tr key={house.id}>
                            <td className="border px-4 py-2">{house.id}</td>
                            <td className="border px-4 py-2">{house.nomor_rumah}</td>
                            <td className="border px-4 py-2">
                                <Link href={`/houses/${house.id}/edit`} className="mr-2 text-blue-500 hover:underline">
                                    Edit
                                </Link>

                                <form
                                    method="POST"
                                    action={`/houses/${house.id}`}
                                    onSubmit={(e) => {
                                        e.preventDefault();

                                        confirmDelete().then((result) => {
                                            if (result.isConfirmed) {
                                                fetch(`/houses/${house.id}`, {
                                                    method: 'POST',
                                                    headers: {
                                                        'X-CSRF-TOKEN':
                                                            (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
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
                                    }}
                                    className="inline"
                                >
                                    <button type="submit" className="text-red-500 hover:underline">
                                        Hapus
                                    </button>
                                </form>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </MenuLayout>
    );
};

export default Index;
