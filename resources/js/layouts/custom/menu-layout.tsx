import { Link } from '@inertiajs/react';
import React from 'react';

const menuItems = [
    { label: 'Manajemen Rumah', path: '/house-management' },
    { label: 'Rumah', path: '/houses' },
    { label: 'Cari Warga', path: '/resident/search-ui' },
    { label: 'Tagihan Warga', path: '/pemasukan' },
    { label: 'Keuangan', path: '/keuangan' },
    { label: 'Pengeluaran', path: '/pengeluaran' },
    { label: 'Pengeluaran Bulanan ', path: '/fixed-expense' },
];

const MenuLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="flex min-h-screen flex-col">
            <nav className="flex justify-between border-b border-gray-200 bg-gray-100 px-6 py-4">
                <div className="flex">
                    {menuItems.map((item) => {
                        const isActive = location.pathname.startsWith(item.path);
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`mr-6 border-b-2 pb-1 text-base transition-colors ${
                                    isActive
                                        ? 'border-gray-900 font-bold text-gray-900'
                                        : 'border-transparent font-normal text-gray-700 hover:text-gray-900'
                                } `}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </div>
                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="mr-6 border-b-2 border-transparent pb-1 text-base font-normal text-gray-700 transition-colors hover:text-gray-900"
                >
                    Logout
                </Link>
            </nav>
            <main className="flex-1 bg-white p-8">{children}</main>
        </div>
    );
};

export default MenuLayout;
