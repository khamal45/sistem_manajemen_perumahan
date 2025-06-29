import { Link } from '@inertiajs/react';
import React from 'react';

const menuItems = [
    { label: 'Manajemen Rumah', path: '/house-management' },
    { label: 'Rumah', path: '/houses' },
    { label: 'Cari Warga', path: '/resident/search-ui' },
    { label: 'Keuangan', path: '/keuangan' },
    { label: 'Pengeluaran', path: '/pengeluaran' },
    { label: 'Pengeluaran Tetap', path: '/fixed-expense' },
];

const MenuLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <nav style={{ display: 'flex', background: '#f5f5f5', padding: '16px 24px', borderBottom: '1px solid #ddd' }}>
                {menuItems.map((item) => {
                    const isActive = location.pathname.startsWith(item.path);
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            style={{
                                marginRight: 24,
                                color: '#333',
                                fontWeight: isActive ? 'bold' : 'normal',
                                textDecoration: 'none',
                                fontSize: 16,
                                borderBottom: isActive ? '2px solid #333' : '2px solid transparent',
                                paddingBottom: 4,
                            }}
                        >
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
            <main style={{ flex: 1, padding: 32, background: '#fff' }}>{children}</main>
        </div>
    );
};

export default MenuLayout;
