import { House_Model_Props } from '@/model/house_model';
import { Fragment } from 'react/jsx-runtime';

const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
};

const HouseManagement = ({ houses }: House_Model_Props) => {
    return (
        <div className="p-6">
            <h1 className="mb-6 text-2xl font-bold">Manajemen Rumah</h1>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {houses.map((house) => {
                    const activeResidents = (house.house_residents ?? []).filter((res) => res.tanggal_keluar === null);

                    const lastTanggalKeluar = house.house_residents
                        ?.filter((res) => res.tanggal_keluar !== null)
                        .sort((a, b) => (a.tanggal_keluar! < b.tanggal_keluar! ? 1 : -1))[0]?.tanggal_keluar;

                    return (
                        <div key={house.id} className="relative overflow-hidden rounded border bg-white p-4 pb-20 shadow">
                            <h2 className="mb-2 text-lg font-semibold">{house.nomor_rumah}</h2>

                            {activeResidents.length > 0 ? (
                                <ul className="list-disc pl-5 text-gray-700">
                                    {activeResidents.map((res) => {
                                        return (
                                            <Fragment key={res.id}>
                                                <li>{res.nama_keluarga}</li>
                                                {res.residents?.map((child_row) => (
                                                    <li key={'angota-keluarga-' + res.id + '-' + child_row.id}>{child_row.nama_lengkap}</li>
                                                ))}
                                            </Fragment>
                                        );
                                    })}
                                    <a href={'tagihan/' + activeResidents[0].id}>
                                        <button className="absolute bottom-8 left-0 w-full bg-blue-500 p-1 font-bold text-white">
                                            Bayar Tahihan
                                        </button>
                                    </a>
                                </ul>
                            ) : (
                                <p className="text-sm text-gray-500 italic">
                                    Rumah kosong
                                    {lastTanggalKeluar ? ` sejak ${formatDate(lastTanggalKeluar)}` : ''}
                                </p>
                            )}
                            <a href={'tagihan/'}>
                                <button className="absolute bottom-0 left-0 w-full bg-yellow-400 p-1 font-bold text-white">Kelola Penghuni</button>
                            </a>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default HouseManagement;
