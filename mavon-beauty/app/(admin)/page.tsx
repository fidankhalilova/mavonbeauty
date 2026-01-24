"use client"
import React, { useState } from 'react';
import { Home, Users, Package } from 'lucide-react';
import AdminLayout from '../../Layout/AdminSideBar/Header';
import DashboardPage from './dashboard/page';
import UsersPage from './products/page';
import ProductsPage from './users/page';

export default function AdminDashboard() {
    const [currentPage, setCurrentPage] = useState<'dashboard' | 'users' | 'products'>('dashboard');

    const menuItems = [
        { id: 'dashboard', icon: Home, label: 'Dashboard' },
        { id: 'users', icon: Users, label: 'Users' },
        { id: 'products', icon: Package, label: 'Products' },
    ];

    const renderPage = () => {
        switch (currentPage) {
            case 'dashboard':
                return <DashboardPage />;
            case 'users':
                return <UsersPage />;
            case 'products':
                return <ProductsPage />;
            default:
                return <DashboardPage />;
        }
    };

    return (
        <AdminLayout 
            currentPage={currentPage} 
            onPageChange={(page) => setCurrentPage(page as any)}
            menuItems={menuItems}
        >
            {renderPage()}
        </AdminLayout>
    );
}