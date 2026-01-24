"use client"
import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, X, Check, AlertCircle } from 'lucide-react';

interface Product {
    _id: string;
    name: string;
    brand: string;
    color: string;
    size: string;
    weight: number;
    price: number;
    stock: number;
}

const API_BASE_URL = 'http://localhost:5000/api/v1';

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isAddingProduct, setIsAddingProduct] = useState(false);
    const [newProduct, setNewProduct] = useState<Omit<Product, '_id'>>({
        name: '',
        brand: '',
        color: '',
        size: '',
        weight: 0,
        price: 0,
        stock: 0
    });

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${API_BASE_URL}/products`);
            const data = await response.json();
            
            if (data.success) {
                setProducts(data.data || []);
            } else {
                setError('Failed to fetch products');
            }
        } catch (err) {
            setError('Error connecting to server');
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    };

    const deleteProduct = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        
        try {
            const response = await fetch(`${API_BASE_URL}/products/${id}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            
            if (data.success) {
                setProducts(products.filter(p => p._id !== id));
            } else {
                alert('Failed to delete product');
            }
        } catch (err) {
            alert('Error deleting product');
            console.error('Error:', err);
        }
    };

    const startEdit = (product: Product) => {
        setEditingProduct({ ...product });
    };

    const saveEdit = async () => {
        if (!editingProduct) return;
        
        try {
            const response = await fetch(`${API_BASE_URL}/products/${editingProduct._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(editingProduct)
            });
            const data = await response.json();
            
            if (data.success) {
                setProducts(products.map(p => p._id === editingProduct._id ? data.data : p));
                setEditingProduct(null);
            } else {
                alert('Failed to update product');
            }
        } catch (err) {
            alert('Error updating product');
            console.error('Error:', err);
        }
    };

    const cancelEdit = () => {
        setEditingProduct(null);
    };

    const addProduct = async () => {
        if (!newProduct.name || !newProduct.brand) {
            alert('Please fill in all required fields');
            return;
        }
        
        try {
            const response = await fetch(`${API_BASE_URL}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newProduct)
            });
            const data = await response.json();
            
            if (data.success) {
                setProducts([data.data, ...products]);
                setNewProduct({ name: '', brand: '', color: '', size: '', weight: 0, price: 0, stock: 0 });
                setIsAddingProduct(false);
            } else {
                alert(data.message || 'Failed to create product');
            }
        } catch (err) {
            alert('Error creating product');
            console.error('Error:', err);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
        );
    }

    return (
        <div>
            {error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <span className="text-red-700">{error}</span>
                </div>
            )}

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
                            {products.length === 0 && !isAddingProduct ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                                        No products found
                                    </td>
                                </tr>
                            ) : (
                                products.map((product, idx) => (
                                    <tr key={product._id} className={idx > 0 ? 'border-t border-emerald-50' : ''}>
                                        {editingProduct?._id === product._id ? (
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
                                                        <button onClick={saveEdit} className="p-2 hover:bg-green-50 rounded-lg text-green-600 transition-colors">
                                                            <Check className="w-4 h-4" />
                                                        </button>
                                                        <button onClick={cancelEdit} className="p-2 hover:bg-rose-50 rounded-lg text-rose-600 transition-colors">
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
                                                            className="p-2 hover:bg-emerald-50 rounded-lg text-emerald-600 transition-colors"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                        <button 
                                                            onClick={() => deleteProduct(product._id)}
                                                            className="p-2 hover:bg-rose-50 rounded-lg text-rose-600 transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))
                            )}
                            
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
                                            <button onClick={addProduct} className="p-2 hover:bg-green-50 rounded-lg text-green-600 transition-colors">
                                                <Check className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    setIsAddingProduct(false);
                                                    setNewProduct({ name: '', brand: '', color: '', size: '', weight: 0, price: 0, stock: 0 });
                                                }} 
                                                className="p-2 hover:bg-rose-50 rounded-lg text-rose-600 transition-colors"
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
        </div>
    );
}