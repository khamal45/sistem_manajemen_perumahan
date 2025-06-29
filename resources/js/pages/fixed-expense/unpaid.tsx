import MenuLayout from '@/layouts/custom/menu-layout';

interface UnpaidFixedExpense {
    id: number;
    name: string;
    amount: number;
    username: string;
    unpaid_months: [string];
}

const PengeluaranTetapUnpaidPage = ({ unpaid }: { unpaid: UnpaidFixedExpense[] }) => {
    // const [unpaid, setUnpaid] = useState<UnpaidFixedExpense[]>([]);
    console.log(unpaid);
    // useEffect(() => {
    //     fetch('/pengeluaran-tetap/unpaid')
    //         .then((res) => res.json())
    //         .then(setUnpaid)
    //         .catch(() => alert('Gagal memuat data pengeluaran tetap belum dibayar'));
    // }, []);

    const handleSubmit = async () => {
        const data = unpaid.flatMap((item) =>
            item.unpaid_months.map((bulan) => ({
                tanggal: `${bulan}-01`,
                fee_expense_id: item.id,
            })),
        );

        try {
            const res = await fetch('/pengeluaran-tetap/bayar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
                body: JSON.stringify({ data }),
            });

            if (res.ok) {
                alert('Pembayaran berhasil disimpan');
                window.location.reload();
            } else {
                const error = await res.json();
                alert('Gagal menyimpan: ' + (error?.message || 'Unknown error'));
            }
        } catch (e) {
            alert('Terjadi kesalahan jaringan');
        }
    };

    return (
        <MenuLayout>
            <h1 className="mb-4 text-2xl font-bold">Pengeluaran Tetap Belum Dibayar</h1>

            {unpaid.length === 0 ? (
                <p className="font-semibold text-green-600">Semua pengeluaran tetap telah dibayar ✅</p>
            ) : (
                <>
                    <table className="mt-4 w-full border text-sm">
                        <thead className="bg-yellow-100">
                            <tr>
                                <th className="border px-4 py-2">Nama Pengeluaran</th>
                                <th className="border px-4 py-2">Harga</th>
                                <th className="border px-4 py-2">Periode</th>
                                <th className="border px-4 py-2">Pengguna</th>
                                <th className="border px-4 py-2">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {unpaid.map((item) => (
                                <tr key={`${item.id}`}>
                                    <td className="border px-4 py-2">{item.name}</td>
                                    <td className="border px-4 py-2 text-right">Rp{Number(item.amount).toLocaleString('id-ID')}</td>
                                    <td className="border px-4 py-2">{item.unpaid_months.join(', ')}</td>
                                    <td className="border px-4 py-2">{item.username}</td>
                                    <td className="border px-4 py-2">{'Rp.' + (item.amount * item.unpaid_months.length).toLocaleString('id-ID')}</td>
                                </tr>
                            ))}
                            <tr>
                                <td className="border px-4 py-2 text-right font-bold" colSpan={4}>
                                    Total yang harus dibayarkan
                                </td>
                                <td className="border px-4 py-2 font-bold">
                                    {`Rp.${unpaid.reduce((sum, item) => sum + item.amount * item.unpaid_months.length, 0).toLocaleString('id-ID')}`}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div className="mt-6 text-right">
                        <button onClick={handleSubmit} className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                            Bayar Sekarang
                        </button>
                    </div>
                </>
            )}
        </MenuLayout>
    );
};

export default PengeluaranTetapUnpaidPage;
