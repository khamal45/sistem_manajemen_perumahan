import React from 'react';

type LayoutProps = {
    children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => (
    <div>
        <h1 className="mb-6 text-2xl font-bold">Manajemen Rumah</h1>
        {children}
    </div>
);

export default Layout;
