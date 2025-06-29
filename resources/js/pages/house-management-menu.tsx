import MenuLayout from '@/layouts/custom/menu-layout';
import { House_Model_Props } from '@/model/house_model';
import { Link } from '@inertiajs/react';
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
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const isUnpaidThisOrPreviousMonth = (res: any) => {
        return (res.unpaid_fees ?? []).some((fee: any) => {
            const [year, month] = fee.periode_bulan.split('-').map(Number);
            return (year === currentYear && month <= currentMonth + 1) || (year === currentYear - 1 && month === 12 && currentMonth === 0);
        });
    };

    return (
        <MenuLayout>
            <div className="p-6">
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
                                    <ul className="max-h-40 list-disc overflow-auto pl-5 text-gray-700">
                                        {activeResidents.map((res) => {
                                            const hasUnpaid = isUnpaidThisOrPreviousMonth(res);
                                            console.log(activeResidents);
                                            return (
                                                <Fragment key={res.id}>
                                                    <li>{res.nama_keluarga}</li>
                                                    <ol className="list-decimal pl-5">
                                                        {res.residents?.map((child_row) => (
                                                            <li key={'angota-keluarga-' + res.id + '-' + child_row.id}>{child_row.nama_lengkap}</li>
                                                        ))}
                                                    </ol>
                                                    {hasUnpaid && (
                                                        <p className="text-sm text-red-500 italic">Tagihan belum dibayar bulan ini atau sebelumnya</p>
                                                    )}
                                                </Fragment>
                                            );
                                        })}
                                        <Link href={'tagihan/' + activeResidents[0].id}>
                                            <button className="absolute bottom-8 left-0 w-full bg-blue-500 p-1 font-bold text-white">
                                                Bayar Tagihan
                                            </button>
                                        </Link>
                                    </ul>
                                ) : (
                                    <p className="text-sm text-gray-500 italic">
                                        Rumah kosong
                                        {lastTanggalKeluar ? ` sejak ${formatDate(lastTanggalKeluar)}` : ''}
                                    </p>
                                )}
                                <Link href={'/house-resident/' + house.id + '/residents'}>
                                    <button className="absolute bottom-0 left-0 w-full bg-purple-500 p-1 font-bold text-white">
                                        Kelola Penghuni
                                    </button>
                                </Link>
                            </div>
                        );
                    })}
                    <Link
                        href="houses"
                        className="flex min-h-36 flex-col items-center justify-center overflow-hidden rounded border bg-white p-4 shadow"
                    >
                        <h1 className="text-3xl font-bold">Kelola Rumah</h1>
                    </Link>
                </div>
            </div>
        </MenuLayout>
    );
};

export default HouseManagement;
