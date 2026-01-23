"use client"
import React, { useState } from 'react';
import { 
    Home, Users, Package, Settings, Search, Bell, 
    Edit2, Trash2, Plus, X, Check, ChevronDown, Sparkles,
    LogOut, Menu
} from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
}

interface Product {
    id: number;
    name: string;
    brand: string;
    color: string;
    size: string;
    weight: number;
    price: number;
    stock: number;
    isEditing?: boolean;
}

export default function AdminDashboard() {
    const [currentPage, setCurrentPage] = useState<'dashboard' | 'users' | 'products'>('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    
    const [users, setUsers] = useState<User[]>([
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
        { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'User', status: 'Inactive' },
    ]);

    const [products, setProducts] = useState<Product[]>([
        { id: 1, name: 'Hydrating Serum', brand: 'GlowCo', color: 'Clear', size: '30ml', weight: 0.05, price: 89.99, stock: 45 },
        { id: 2, name: 'Night Cream', brand: 'BeautyPro', color: 'White', size: '50ml', weight: 0.1, price: 124.99, stock: 32 },
        { id: 3, name: 'Face Mask', brand: 'SkinLux', color: 'Pink', size: '75ml', weight: 0.08, price: 45.50, stock: 67 },
    ]);

    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isAddingProduct, setIsAddingProduct] = useState(false);
    const [newProduct, setNewProduct] = useState<Product>({
        id: 0,
        name: '',
        brand: '',
        color: '',
        size: '',
        weight: 0,
        price: 0,
        stock: 0
    });

    const deleteProduct = (id: number) => {
        if (confirm('Are you sure you want to delete this product?')) {
            setProducts(products.filter(p => p.id !== id));
        }
    };

    const deleteUser = (id: number) => {
        if (confirm('Are you sure you want to delete this user?')) {
            setUsers(users.filter(u => u.id !== id));
        }
    };

    const startEdit = (product: Product) => {
        setEditingProduct({ ...product });
    };

    const saveEdit = () => {
        if (editingProduct) {
            setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p));
            setEditingProduct(null);
        }
    };

    const cancelEdit = () => {
        setEditingProduct(null);
    };

    const addProduct = () => {
        if (!newProduct.name || !newProduct.brand) {
            alert('Please fill in all required fields');
            return;
        }
        const product = { ...newProduct, id: Math.max(...products.map(p => p.id)) + 1 };
        setProducts([...products, product]);
        setNewProduct({ id: 0, name: '', brand: '', color: '', size: '', weight: 0, price: 0, stock: 0 });
        setIsAddingProduct(false);
    };

    const menuItems = [
        { id: 'dashboard', icon: Home, label: 'Dashboard' },
        { id: 'users', icon: Users, label: 'Users' },
        { id: 'products', icon: Package, label: 'Products' },
    ];

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-linear-to-b from-emerald-600 to-teal-600 text-white transition-all duration-300`}>
                <div className="p-4 border-b border-emerald-700">
                    <div className="flex items-center justify-between">
                        {sidebarOpen && (
                            <>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                                        <Sparkles className="w-6 h-6 text-emerald-600" />
                                    </div>
                                    <span className="text-xl font-light">Beauty Admin</span>
                                </div>
                            </>
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
                                placeholder="Search..."
                                className="w-full bg-emerald-700 text-white placeholder-emerald-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white"
                            />
                        </div>
                    </div>
                )}

                <nav className="mt-6 px-2">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setCurrentPage(item.id as any)}
                            className={`w-full flex items-center gap-3 px-4 py-3 mb-2 rounded-lg transition-all ${
                                currentPage === item.id
                                    ? 'bg-white text-emerald-600 shadow-lg'
                                    : 'text-white hover:bg-emerald-700'
                            }`}
                        >
                            <item.icon className="w-5 h-5" />
                            {sidebarOpen && <span className="font-medium">{item.label}</span>}
                        </button>
                    ))}
                </nav>

                {sidebarOpen && (
                    <div className="absolute bottom-0 w-64 p-4 border-t border-emerald-700">
                        <div className="flex items-center gap-3">
                            <img
                                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop "
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
                            {currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}
                        </h1>
                        <div className="flex items-center gap-4">
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

                {/* Content */}
                <div className="p-6">
                    {currentPage === 'dashboard' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 text-sm">Total Users</p>
                                        <p className="text-3xl font-semibold text-gray-800 mt-2">{users.length}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-linear-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                                        <Users className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 text-sm">Total Products</p>
                                        <p className="text-3xl font-semibold text-gray-800 mt-2">{products.length}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-linear-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                                        <Package className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 text-sm">Total Stock</p>
                                        <p className="text-3xl font-semibold text-gray-800 mt-2">
                                            {products.reduce((sum, p) => sum + p.stock, 0)}
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                                        <Sparkles className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentPage === 'users' && (
                        <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Name</th>
                                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Email</th>
                                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Role</th>
                                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Status</th>
                                            <th className="px-6 py-4 text-center text-sm font-medium text-gray-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user, idx) => (
                                            <tr key={user.id} className={idx > 0 ? 'border-t border-emerald-50' : ''}>
                                                <td className="px-6 py-4 text-gray-800">{user.name}</td>
                                                <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                                <td className="px-6 py-4">
                                                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm">
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-sm ${
                                                        user.status === 'Active' 
                                                            ? 'bg-green-100 text-green-700' 
                                                            : 'bg-gray-100 text-gray-700'
                                                    }`}>
                                                        {user.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button className="p-2 hover:bg-emerald-50 rounded-lg text-emerald-600">
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                        <button 
                                                            onClick={() => deleteUser(user.id)}
                                                            className="p-2 hover:bg-rose-50 rounded-lg text-rose-600"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {currentPage === 'products' && (
                        <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Name</th>
                                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Brand</th>
                                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Color</th>
                                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Size</th>
                                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Weight (kg)</th>
                                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Price</th>
                                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Stock</th>
                                            <th className="px-6 py-4 text-center text-sm font-medium text-gray-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map((product, idx) => (
                                            <tr key={product.id} className={idx > 0 ? 'border-t border-emerald-50' : ''}>
                                                {editingProduct?.id === product.id ? (
                                                    <>
                                                        <td className="px-6 py-4">
                                                            <input
                                                                type="text"
                                                                value={editingProduct.name}
                                                                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                                                                className="w-full border border-emerald-200 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                                                            />
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <input
                                                                type="text"
                                                                value={editingProduct.brand}
                                                                onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                                                                className="w-full border border-emerald-200 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                                                            />
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <input
                                                                type="text"
                                                                value={editingProduct.color}
                                                                onChange={(e) => setEditingProduct({ ...editingProduct, color: e.target.value })}
                                                                className="w-full border border-emerald-200 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                                                            />
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <input
                                                                type="text"
                                                                value={editingProduct.size}
                                                                onChange={(e) => setEditingProduct({ ...editingProduct, size: e.target.value })}
                                                                className="w-full border border-emerald-200 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                                                            />
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <input
                                                                type="number"
                                                                step="0.01"
                                                                value={editingProduct.weight}
                                                                onChange={(e) => setEditingProduct({ ...editingProduct, weight: parseFloat(e.target.value) })}
                                                                className="w-full border border-emerald-200 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                                                            />
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <input
                                                                type="number"
                                                                step="0.01"
                                                                value={editingProduct.price}
                                                                onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                                                                className="w-full border border-emerald-200 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                                                            />
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <input
                                                                type="number"
                                                                value={editingProduct.stock}
                                                                onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) })}
                                                                className="w-full border border-emerald-200 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                                                            />
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center justify-center gap-2">
                                                                <button onClick={saveEdit} className="p-2 hover:bg-green-50 rounded-lg text-green-600">
                                                                    <Check className="w-4 h-4" />
                                                                </button>
                                                                <button onClick={cancelEdit} className="p-2 hover:bg-rose-50 rounded-lg text-rose-600">
                                                                    <X className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </>
                                                ) : (
                                                    <>
                                                        <td className="px-6 py-4 text-gray-800 font-medium">{product.name}</td>
                                                        <td className="px-6 py-4 text-gray-600">{product.brand}</td>
                                                        <td className="px-6 py-4 text-gray-600">{product.color}</td>
                                                        <td className="px-6 py-4 text-gray-600">{product.size}</td>
                                                        <td className="px-6 py-4 text-gray-600">{product.weight}</td>
                                                        <td className="px-6 py-4 text-gray-800 font-medium">${product.price.toFixed(2)}</td>
                                                        <td className="px-6 py-4 text-gray-600">{product.stock}</td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center justify-center gap-2">
                                                                <button 
                                                                    onClick={() => startEdit(product)}
                                                                    className="p-2 hover:bg-emerald-50 rounded-lg text-emerald-600"
                                                                >
                                                                    <Edit2 className="w-4 h-4" />
                                                                </button>
                                                                <button 
                                                                    onClick={() => deleteProduct(product.id)}
                                                                    className="p-2 hover:bg-rose-50 rounded-lg text-rose-600"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </>
                                                )}
                                            </tr>
                                        ))}
                                        
                                        {isAddingProduct && (
                                            <tr className="border-t border-emerald-50 bg-emerald-50">
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="text"
                                                        placeholder="Product name"
                                                        value={newProduct.name}
                                                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                                        className="w-full border border-emerald-200 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                                                    />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="text"
                                                        placeholder="Brand"
                                                        value={newProduct.brand}
                                                        onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                                                        className="w-full border border-emerald-200 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                                                    />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="text"
                                                        placeholder="Color"
                                                        value={newProduct.color}
                                                        onChange={(e) => setNewProduct({ ...newProduct, color: e.target.value })}
                                                        className="w-full border border-emerald-200 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                                                    />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="text"
                                                        placeholder="Size"
                                                        value={newProduct.size}
                                                        onChange={(e) => setNewProduct({ ...newProduct, size: e.target.value })}
                                                        className="w-full border border-emerald-200 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                                                    />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        placeholder="0.00"
                                                        value={newProduct.weight || ''}
                                                        onChange={(e) => setNewProduct({ ...newProduct, weight: parseFloat(e.target.value) || 0 })}
                                                        className="w-full border border-emerald-200 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                                                    />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        placeholder="0.00"
                                                        value={newProduct.price || ''}
                                                        onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })}
                                                        className="w-full border border-emerald-200 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                                                    />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="number"
                                                        placeholder="0"
                                                        value={newProduct.stock || ''}
                                                        onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) || 0 })}
                                                        className="w-full border border-emerald-200 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                                                    />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button onClick={addProduct} className="p-2 hover:bg-green-50 rounded-lg text-green-600">
                                                            <Check className="w-4 h-4" />
                                                        </button>
                                                        <button 
                                                            onClick={() => {
                                                                setIsAddingProduct(false);
                                                                setNewProduct({ id: 0, name: '', brand: '', color: '', size: '', weight: 0, price: 0, stock: 0 });
                                                            }} 
                                                            className="p-2 hover:bg-rose-50 rounded-lg text-rose-600"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            
                            {!isAddingProduct && (
                                <div className="p-6 border-t border-emerald-100">
                                    <button
                                        onClick={() => setIsAddingProduct(true)}
                                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md"
                                    >
                                        <Plus className="w-5 h-5" />
                                        Add New Product
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}