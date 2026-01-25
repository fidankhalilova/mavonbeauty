"use client";
import React from 'react';
import AdminLayout from '@/Layout/AdminSideBar/Header';
import { Home, Users, Package, Palette, Tag, Ruler } from 'lucide-react';


const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard', href: '/dashboard' },
    { id: 'users', icon: Users, label: 'Users', href: 'dashboard/users' },
    { id: 'products', icon: Package, label: 'Products', href: '/products' },
    { id: 'color', icon: Palette, label: 'Color', href: '/color' },
    { id: 'brand', icon: Tag, label: 'Brand', href: '/brand' },
    { id: 'size', icon: Ruler, label: 'Size', href: '/size' },
];


export default function AdminLayoutWrapper({ 
    children 
}: { 
    children: React.ReactNode 
}) {
    return (
        <AdminLayout menuItems={menuItems}>
            {children}
        </AdminLayout>
    );
}