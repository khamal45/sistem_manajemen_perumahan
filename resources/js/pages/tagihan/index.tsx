import { FuturePaymentModel, TagihanModel, UnpaidFeeModel } from '@/model/fee_model';
import { alertSuccess } from '@/utils/swal';
import { useEffect, useMemo, useState } from 'react';

const formatCurrency = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(num);

const formatLabel = (dateStr: string) => {
    const [year, month] = dateStr.split('-');
    return `${month}/${year}`;
};

const generateMonthOptions = (start: string, end: string) => {
    const result: string[] = [];
    const startDate = new Date(start + '-01');
    const endDate = new Date(end + '-01');

    while (startDate <= endDate) {
        result.push(startDate.toISOString().slice(0, 7));
        startDate.setMonth(startDate.getMonth() + 1);
    }

    return result;
};

const generateFutureFees = (
    options: FuturePaymentModel[],
    selection: { [fee_type_id: number]: { from: string; to: string } },
    unpaidKeys: Set<string>,
): UnpaidFeeModel[] => {
    const future: UnpaidFeeModel[] = [];

    for (const opt of options) {
        const sel = selection[opt.fee_type_id];
        if (!sel || !sel.from || !sel.to || sel.to === '-') continue;

        const months = generateMonthOptions(sel.from, sel.to);
        months.forEach((bulan) => {
            const key = `${opt.fee_type_name}_${bulan}`;
            if (!unpaidKeys.has(key)) {
                future.push({
                    fee_type: opt.fee_type_name,
                    periode_bulan: bulan,
                    nominal: opt.nominal,
                    fee_type_id: opt.fee_type_id,
                });
            }
        });
    }

    return future;
};

const Tagihan = ({ house_resident, unpaid_fees, future_payment_options }: TagihanModel) => {
    const [bayarBulanDepan, setBayarBulanDepan] = useState<{
        [fee_type_id: number]: { from: string; to: string };
    }>({});

    useEffect(() => {
        const defaults: typeof bayarBulanDepan = {};
        const now = new Date();

        future_payment_options.forEach((opt) => {
            const bulanAwalDate = new Date(opt.bulan_awal + '-01');
            const isFuture = bulanAwalDate > now;

            defaults[opt.fee_type_id] = {
                from: opt.bulan_awal,
                to: isFuture ? '-' : opt.bulan_awal,
            };
        });

        setBayarBulanDepan(defaults);
    }, [future_payment_options]);

    const unpaidKeys = useMemo(() => new Set(unpaid_fees.map((fee) => `${fee.fee_type}_${fee.periode_bulan}`)), [unpaid_fees]);
    const future_fees = useMemo(
        () => generateFutureFees(future_payment_options, bayarBulanDepan, unpaidKeys),
        [bayarBulanDepan, future_payment_options, unpaidKeys],
    );
    const combinedFees = [...unpaid_fees, ...future_fees];

    const total = combinedFees.reduce((sum, fee) => sum + Number(fee.nominal), 0);

    const handleChange = (fee_type_id: number, type: 'from' | 'to', value: string) => {
        setBayarBulanDepan((prev) => ({
            ...prev,
            [fee_type_id]: {
                ...prev[fee_type_id],
                [type]: value,
            },
        }));
    };

    const handleSubmit = () => {
        const payload = combinedFees
            .map((fee) => ({
                fee_type_id: future_payment_options.find((f) => f.fee_type_name === fee.fee_type)?.fee_type_id,
                periode_bulan: fee.periode_bulan,
                nominal: fee.nominal,
            }))
            .filter((fee) => fee.fee_type_id); // filter kalau tidak ketemu

        fetch(`/tagihan/${house_resident.id}/bayar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
            },
            body: JSON.stringify({ data: payload }),
        })
            .then((res) => {
                if (res.ok) {
                    alertSuccess('pembayaran berhasil').then(() => window.location.reload());
                } else {
                    alert('Gagal menyimpan pembayaran');
                }
            })
            .catch(() => alert('Terjadi kesalahan jaringan'));
    };

    return (
        <div className="p-6">
            <h1 className="mb-4 text-2xl font-bold">Tagihan Rumah {house_resident.nama_keluarga}</h1>

            <div className="mb-6 text-sm text-gray-600">
                <p>
                    <strong>Tanggal Masuk:</strong> {house_resident.tanggal_masuk}
                </p>
                {house_resident.tanggal_keluar && (
                    <p>
                        <strong>Tanggal Keluar:</strong> {house_resident.tanggal_keluar}
                    </p>
                )}
            </div>

            {combinedFees.length === 0 ? (
                <p className="font-medium text-green-600">Tidak ada tagihan yang tertunda 🎉</p>
            ) : (
                <>
                    <table className="mb-6 w-full border text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border px-4 py-2 text-left">Jenis Tagihan</th>
                                <th className="border px-4 py-2 text-left">Periode</th>
                                <th className="border px-4 py-2 text-right">Nominal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {combinedFees.map((fee, index) => (
                                <tr key={index}>
                                    <td className="border px-4 py-2">{fee.fee_type}</td>
                                    <td className="border px-4 py-2">{fee.periode_bulan}</td>
                                    <td className="border px-4 py-2 text-right">{formatCurrency(fee.nominal)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="mb-8 text-right text-lg font-semibold">Total: {formatCurrency(total)}</div>
                </>
            )}

            <h2 className="mb-2 font-bold">Bayar untuk Bulan Depan</h2>
            <div className="space-y-4">
                {future_payment_options.map((opt) => {
                    const bulanOptions = generateMonthOptions(opt.bulan_awal, opt.bulan_akhir);
                    return (
                        <div key={opt.fee_type_id} className="flex flex-wrap items-center gap-4">
                            <div className="w-40 font-medium">{opt.fee_type_name}</div>
                            <span>{formatLabel(opt.bulan_awal)}</span>
                            <span>sampai</span>
                            <select
                                value={bayarBulanDepan[opt.fee_type_id]?.to || ''}
                                onChange={(e) => handleChange(opt.fee_type_id, 'to', e.target.value)}
                                className="rounded border px-2 py-1"
                            >
                                <option value="">Sampai Bulan</option>
                                {bulanOptions.map((bulan) => (
                                    <option key={bulan} value={bulan}>
                                        {formatLabel(bulan)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    );
                })}
            </div>

            <div className="mt-6 text-right">
                <button onClick={handleSubmit} className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                    Bayar Sekarang
                </button>
            </div>
        </div>
    );
};

export default Tagihan;
