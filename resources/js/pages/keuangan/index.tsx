import MenuLayout from '@/layouts/custom/menu-layout';
import { useEffect, useState } from 'react';
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface DataPoint {
    bulan: string;
    pemasukan: number;
    pengeluaran: number;
}

interface Summary {
    pemasukan: number;
    pengeluaran: number;
    sisa_saldo: number;
}

interface Payment {
    id: number;
    tanggal_pembayaran: string;
    periode_bulan: string;
    nominal: number;
    fee_type_name: string;
    nama_keluarga: string;
}

interface Expenditure {
    id: number;
    tanggal: string;
    amount: number;
    description: string;
    username?: string;
}

const KeuanganIndex = () => {
    const [chartData, setChartData] = useState<DataPoint[]>([]);
    const [summary, setSummary] = useState<Summary | null>(null);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [expenditures, setExpenditures] = useState<Expenditure[]>([]);
    const [selectedMonth, setSelectedMonth] = useState<string>('');

    const handleExport = () => {
        const url = selectedMonth ? `/export-keuangan?bulan=${selectedMonth}` : `/export-keuangan`;
        window.open(url, '_blank');
    };

    // Utility: Format 'YYYY-MM' menjadi 'Juni 2025'
    const formatMonth = (ym: string) => {
        const [year, month] = ym.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1);
        return new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(date);
    };

    // Utility: Generate 12 bulan terakhir
    const generateMonthOptions = () => {
        const now = new Date();
        const options: string[] = [];
        for (let i = 0; i < 12; i++) {
            const d = new Date(now.getFullYear(), now.getMonth() - i);
            const ym = d.toISOString().slice(0, 7); // Format YYYY-MM
            options.push(ym);
        }
        return options;
    };
    console.log(chartData);
    useEffect(() => {
        fetch('/keuangan/chart')
            .then((res) => res.json())
            .then((json) => {
                setChartData(json.data);
                setSummary(json.summary);
            });

        fetch('/keuangan/payments')
            .then((res) => res.json())
            .then(setPayments);

        fetch('/keuangan/expenditures')
            .then((res) => res.json())
            .then(setExpenditures);
    }, []);

    return (
        <MenuLayout>
            <h1 className="mb-4 text-2xl font-bold">Grafik Keuangan Bulanan</h1>
            <div className="mb-4 flex flex-col flex-wrap gap-2">
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Pilih Bulan:</label>
                    <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="rounded border px-2 py-1">
                        <option value="">Semua Bulan</option>
                        {generateMonthOptions().map((bulan) => (
                            <option key={bulan} value={bulan}>
                                {formatMonth(bulan)}
                            </option>
                        ))}
                    </select>
                </div>

                <button onClick={handleExport} className="w-fit rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700">
                    Cetak Laporan
                </button>
            </div>

            {summary && (
                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="overflow-hidden rounded bg-green-100 p-4 text-green-800">
                        <div className="text-sm">Total Pemasukan</div>
                        <div className="text-lg font-semibold break-words">Rp{summary.pemasukan.toLocaleString('id-ID')}</div>
                    </div>
                    <div className="overflow-hidden rounded bg-red-100 p-4 text-red-800">
                        <div className="text-sm">Total Pengeluaran</div>
                        <div className="text-lg font-semibold break-words">Rp{summary.pengeluaran.toLocaleString('id-ID')}</div>
                    </div>
                    <div className="overflow-hidden rounded bg-blue-100 p-4 text-blue-800">
                        <div className="text-sm">Sisa Saldo</div>
                        <div className="text-lg font-semibold break-words">Rp{summary.sisa_saldo.toLocaleString('id-ID')}</div>
                    </div>
                </div>
            )}

            <div className="h-[400px] w-full p-2">
                <ResponsiveContainer>
                    <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#dc2626" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="bulan" />
                        <YAxis tickFormatter={(v) => `Rp${(v / 1000).toFixed(0)}k`} />
                        <Tooltip formatter={(value: number) => `Rp${value.toLocaleString('id-ID')}`} />
                        <Legend />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Area
                            type="monotone"
                            dataKey="pemasukan"
                            stroke="#16a34a"
                            fillOpacity={1}
                            fill="url(#colorIncome)"
                            name="Pemasukan"
                            isAnimationActive={false}
                        />
                        <Area
                            type="monotone"
                            dataKey="pengeluaran"
                            stroke="#dc2626"
                            fillOpacity={1}
                            fill="url(#colorExpense)"
                            name="Pengeluaran"
                            isAnimationActive={false}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-10 space-y-10 overflow-x-auto">
                <div>
                    <h2 className="mb-2 text-xl font-semibold">Daftar Pengeluaran</h2>
                    <table className="w-full min-w-[800px] border text-sm">
                        <thead className="bg-red-100">
                            <tr>
                                <th className="border px-3 py-2">Tanggal</th>
                                <th className="border px-3 py-2">Deskripsi</th>
                                <th className="border px-3 py-2">Pengguna</th>
                                <th className="border px-3 py-2">Nominal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenditures.map((e) => (
                                <tr key={e.id}>
                                    <td className="border px-3 py-2">{e.tanggal}</td>
                                    <td className="border px-3 py-2">{e.description}</td>
                                    <td className="border px-3 py-2">{e.username ?? '-'}</td>
                                    <td className="border px-3 py-2 text-right">Rp{e.amount.toLocaleString('id-ID')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div>
                    <h2 className="mb-2 text-xl font-semibold">Daftar Pemasukan</h2>
                    <table className="w-full min-w-[800px] border text-sm">
                        <thead className="bg-green-100">
                            <tr>
                                <th className="border px-3 py-2">Tanggal</th>
                                <th className="border px-3 py-2">Periode</th>
                                <th className="border px-3 py-2">Jenis</th>
                                <th className="border px-3 py-2">Keluarga</th>
                                <th className="border px-3 py-2">Nominal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map((p) => (
                                <tr key={p.id}>
                                    <td className="border px-3 py-2">{p.tanggal_pembayaran}</td>
                                    <td className="border px-3 py-2">{p.periode_bulan}</td>
                                    <td className="border px-3 py-2">{p.fee_type_name}</td>
                                    <td className="border px-3 py-2">{p.nama_keluarga}</td>
                                    <td className="border px-3 py-2 text-right">Rp{p.nominal.toLocaleString('id-ID')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </MenuLayout>
    );
};

export default KeuanganIndex;
