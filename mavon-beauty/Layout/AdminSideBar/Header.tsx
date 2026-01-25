"use client"
import React, { useState, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
    Search, Bell, Settings, Menu, LogOut, Filter, X
} from 'lucide-react';

interface MenuItem {
    id: string;
    icon: any;
    label: string;
    href: string;
}

interface AdminLayoutProps {
    children: ReactNode;
    menuItems: MenuItem[];
    showFilters?: boolean;
    onFiltersChange?: (filters: FilterState) => void;
    colors?: Array<{ id: string; name: string; hex: string }>;
    brands?: string[];
    sizes?: string[];
}

interface FilterState {
    colors: string[];
    brands: string[];
    sizes: string[];
}

export default function AdminLayout({ 
    children, 
    menuItems, 
    showFilters = false, 
    onFiltersChange,
    colors = [],
    brands = [],
    sizes = []
}: AdminLayoutProps) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [filterOpen, setFilterOpen] = useState(false);
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

    const toggleFilter = (value: string, setter: React.Dispatch<React.SetStateAction<string[]>>, current: string[]) => {
        const newValues = current.includes(value)
            ? current.filter(item => item !== value)
            : [...current, value];
        
        setter(newValues);
        
        if (onFiltersChange) {
            const updatedFilters = {
                colors: setter === setSelectedColors ? newValues : selectedColors,
                brands: setter === setSelectedBrands ? newValues : selectedBrands,
                sizes: setter === setSelectedSizes ? newValues : selectedSizes,
            };
            onFiltersChange(updatedFilters);
        }
    };

    const clearAllFilters = () => {
        setSelectedColors([]);
        setSelectedBrands([]);
        setSelectedSizes([]);
        if (onFiltersChange) {
            onFiltersChange({ colors: [], brands: [], sizes: [] });
        }
    };

    const activeFilterCount = selectedColors.length + selectedBrands.length + selectedSizes.length;

    const getCurrentPageTitle = () => {
        const currentItem = menuItems.find(item => pathname === item.href);
        return currentItem?.label || 'Dashboard';
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-emerald-600 to-teal-600 text-white transition-all duration-300`}>
                <div className="p-4 border-b border-emerald-700">
                    <div className="flex items-center justify-between">
                        {sidebarOpen && (
                            <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-lg">
                                <img 
                                    src="https://mavon-beauty.myshopify.com/cdn/shop/files/mavon_140x.png?v=1691552606" 
                                    alt="Mavon Beauty" 
                                    className="h-8 w-auto object-contain"
                                />
                            </div>
                        )}
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-emerald-700 rounded-lg">
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {sidebarOpen && (
                    <div className="p-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-300" />
                            <input
                                type="text"
                                placeholder="Axtar..."
                                className="w-full bg-emerald-700 text-white placeholder-emerald-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white"
                            />
                        </div>
                    </div>
                )}

                <nav className="mt-6 px-2">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.id}
                                href={item.href}
                                className={`w-full flex items-center gap-3 px-4 py-3 mb-2 rounded-lg transition-all ${
                                    isActive
                                        ? 'bg-white text-emerald-600 shadow-lg'
                                        : 'text-white hover:bg-emerald-700'
                                }`}
                            >
                                <item.icon className="w-5 h-5" />
                                {sidebarOpen && <span className="font-medium">{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {sidebarOpen && (
                    <div className="absolute bottom-0 w-64 p-4 border-t border-emerald-700">
                        <div className="flex items-center gap-3">
                            <img
                                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
                                alt="Admin"
                                className="w-10 h-10 rounded-full border-2 border-white"
                            />
                            <div className="flex-1">
                                <p className="text-sm font-medium">Admin User</p>
                                <p className="text-xs text-emerald-200">admin@beauty.com</p>
                            </div>
                            <button className="p-2 hover:bg-emerald-700 rounded-lg">
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-light text-gray-800">
                            {getCurrentPageTitle()}
                        </h1>
                        <div className="flex items-center gap-4">
                            {showFilters && (
                                <button 
                                    onClick={() => setFilterOpen(!filterOpen)}
                                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors relative"
                                >
                                    <Filter className="w-4 h-4" />
                                    <span>Filterlər</span>
                                    {activeFilterCount > 0 && (
                                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-xs rounded-full flex items-center justify-center">
                                            {activeFilterCount}
                                        </span>
                                    )}
                                </button>
                            )}
                            <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                                <Bell className="w-5 h-5 text-gray-600" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-lg">
                                <Settings className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Filter Panel */}
                {filterOpen && showFilters && (
                    <div className="bg-white border-b border-gray-200 px-6 py-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Filterlər</h3>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={clearAllFilters}
                                    className="text-sm text-emerald-600 hover:text-emerald-700"
                                >
                                    Təmizlə
                                </button>
                                <button 
                                    onClick={() => setFilterOpen(false)}
                                    className="p-1 hover:bg-gray-100 rounded"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Colors */}
                            {colors.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-medium text-gray-700 mb-3">Rənglər</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {colors.map(color => (
                                            <button
                                                key={color.id}
                                                onClick={() => toggleFilter(color.id, setSelectedColors, selectedColors)}
                                                className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all ${
                                                    selectedColors.includes(color.id)
                                                        ? 'border-emerald-600 bg-emerald-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                <span 
                                                    className="w-4 h-4 rounded-full border border-gray-300"
                                                    style={{ backgroundColor: color.hex }}
                                                ></span>
                                                <span className="text-sm">{color.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Brands */}
                            {brands.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-medium text-gray-700 mb-3">Brendlər</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {brands.map(brand => (
                                            <button
                                                key={brand}
                                                onClick={() => toggleFilter(brand, setSelectedBrands, selectedBrands)}
                                                className={`px-3 py-2 rounded-lg border-2 transition-all text-sm ${
                                                    selectedBrands.includes(brand)
                                                        ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                {brand}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Sizes */}
                            {sizes.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-medium text-gray-700 mb-3">Ölçülər</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {sizes.map(size => (
                                            <button
                                                key={size}
                                                onClick={() => toggleFilter(size, setSelectedSizes, selectedSizes)}
                                                className={`px-3 py-2 rounded-lg border-2 transition-all text-sm font-medium ${
                                                    selectedSizes.includes(size)
                                                        ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Active Filters Summary */}
                        {activeFilterCount > 0 && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-sm text-gray-600">Aktiv filterlər:</span>
                                    {selectedColors.map(colorId => {
                                        const color = colors.find(c => c.id === colorId);
                                        return (
                                            <span key={colorId} className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs">
                                                <span 
                                                    className="w-3 h-3 rounded-full border border-emerald-300"
                                                    style={{ backgroundColor: color?.hex }}
                                                ></span>
                                                {color?.name}
                                                <button onClick={() => toggleFilter(colorId, setSelectedColors, selectedColors)}>
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </span>
                                        );
                                    })}
                                    {selectedBrands.map(brand => (
                                        <span key={brand} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                                            {brand}
                                            <button onClick={() => toggleFilter(brand, setSelectedBrands, selectedBrands)}>
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))}
                                    {selectedSizes.map(size => (
                                        <span key={size} className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                                            {size}
                                            <button onClick={() => toggleFilter(size, setSelectedSizes, selectedSizes)}>
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Content */}
                <div className="p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}