"use client"
import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, AlertCircle, Check, X, Ruler } from 'lucide-react';

interface Size {
    _id: string;
    name: string;
    category: string;
    createdAt?: string;
}

const API_BASE_URL = 'http://localhost:5000/api/v1';

const SIZE_CATEGORIES = [
    { value: 'clothing', label: 'Clothing' },
    { value: 'cosmetics', label: 'Cosmetics (ml)' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'shoes', label: 'Shoes' },
];

export default function SizePage() {
    const [sizes, setSizes] = useState<Size[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [editingSize, setEditingSize] = useState<Size | null>(null);
    const [formData, setFormData] = useState({ name: '', category: 'clothing' });
    const [filterCategory, setFilterCategory] = useState<string>('all');

    // Fetch sizes
    const fetchSizes = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${API_BASE_URL}/sizes`);
            const data = await response.json();
            
            if (data.success) {
                setSizes(data.data || []);
            } else {
                setError('Failed to fetch sizes');
            }
        } catch (err) {
            setError('Error connecting to server');
            console.error('Error fetching sizes:', err);
        } finally {
            setLoading(false);
        }
    };

    // Create size
    const handleCreate = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/sizes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            
            if (data.success) {
                fetchSizes();
                setShowModal(false);
                setFormData({ name: '', category: 'clothing' });
            } else {
                setError(data.message || 'Failed to create size');
            }
        } catch (err) {
            setError('Error creating size');
            console.error('Error:', err);
        }
    };

    // Update size
    const handleUpdate = async () => {
        if (!editingSize) return;
        
        try {
            const response = await fetch(`${API_BASE_URL}/sizes/${editingSize._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            
            if (data.success) {
                fetchSizes();
                setShowModal(false);
                setEditingSize(null);
                setFormData({ name: '', category: 'clothing' });
            } else {
                setError(data.message || 'Failed to update size');
            }
        } catch (err) {
            setError('Error updating size');
            console.error('Error:', err);
        }
    };

    // Delete size
    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this size?')) return;
        
        try {
            const response = await fetch(`${API_BASE_URL}/sizes/${id}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            
            if (data.success) {
                fetchSizes();
            } else {
                setError(data.message || 'Failed to delete size');
            }
        } catch (err) {
            setError('Error deleting size');
            console.error('Error:', err);
        }
    };

    // Open modal for create
    const openCreateModal = () => {
        setEditingSize(null);
        setFormData({ name: '', category: 'clothing' });
        setShowModal(true);
    };

    // Open modal for edit
    const openEditModal = (size: Size) => {
        setEditingSize(size);
        setFormData({ name: size.name, category: size.category });
        setShowModal(true);
    };

    useEffect(() => {
        fetchSizes();
    }, []);

    // Filter sizes by category
    const filteredSizes = filterCategory === 'all' 
        ? sizes 
        : sizes.filter(size => size.category === filterCategory);

    // Group sizes by category
    const groupedSizes = filteredSizes.reduce((acc, size) => {
        if (!acc[size.category]) {
            acc[size.category] = [];
        }
        acc[size.category].push(size);
        return acc;
    }, {} as Record<string, Size[]>);

    if (loading && sizes.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600">Loading sizes...</p>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-800">Size Management</h2>
                    <p className="text-gray-600 mt-1">Manage product sizes</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Add Size
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <span className="text-red-700">{error}</span>
                    <button onClick={() => setError(null)} className="ml-auto">
                        <X className="w-5 h-5 text-red-500" />
                    </button>
                </div>
            )}

            {/* Category Filter */}
            <div className="mb-6 flex gap-2 flex-wrap">
                <button
                    onClick={() => setFilterCategory('all')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                        filterCategory === 'all'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    All ({sizes.length})
                </button>
                {SIZE_CATEGORIES.map(cat => {
                    const count = sizes.filter(s => s.category === cat.value).length;
                    return (
                        <button
                            key={cat.value}
                            onClick={() => setFilterCategory(cat.value)}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                                filterCategory === cat.value
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {cat.label} ({count})
                        </button>
                    );
                })}
            </div>

            {/* Grouped Sizes */}
            {Object.keys(groupedSizes).length > 0 ? (
                <div className="space-y-6">
                    {Object.entries(groupedSizes).map(([category, categorySize]) => (
                        <div key={category} className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <Ruler className="w-5 h-5 text-emerald-600" />
                                {SIZE_CATEGORIES.find(c => c.value === category)?.label || category}
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                {categorySize.map((size) => (
                                    <div
                                        key={size._id}
                                        className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors group"
                                    >
                                        <div className="text-center mb-3">
                                            <div className="w-12 h-12 bg-linear-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                                                <span className="text-white font-bold text-lg">{size.name}</span>
                                            </div>
                                            <p className="text-sm font-medium text-gray-700">{size.name}</p>
                                        </div>
                                        
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => openEditModal(size)}
                                                className="flex-1 p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                                            >
                                                <Edit2 className="w-3 h-3 mx-auto" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(size._id)}
                                                className="flex-1 p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                                            >
                                                <Trash2 className="w-3 h-3 mx-auto" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Ruler className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">No sizes yet</h3>
                    <p className="text-gray-600 mb-4">Get started by adding your first size</p>
                    <button
                        onClick={openCreateModal}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                        Add Size
                    </button>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                        <h3 className="text-xl font-semibold mb-4">
                            {editingSize ? 'Edit Size' : 'Add New Size'}
                        </h3>
                        
                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category
                                </label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                >
                                    {SIZE_CATEGORIES.map(cat => (
                                        <option key={cat.value} value={cat.value}>
                                            {cat.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Size Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g., XS, S, M, L, XL, 30ml, 50ml"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>

                            {/* Preview */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-sm text-gray-600 mb-2">Preview:</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-16 h-16 bg-linear-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                                        <span className="text-white font-bold text-xl">
                                            {formData.name || '?'}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800">{formData.name || 'Size Name'}</p>
                                        <p className="text-sm text-gray-500">
                                            {SIZE_CATEGORIES.find(c => c.value === formData.category)?.label}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setEditingSize(null);
                                    setFormData({ name: '', category: 'clothing' });
                                }}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={editingSize ? handleUpdate : handleCreate}
                                disabled={!formData.name}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Check className="w-5 h-5" />
                                {editingSize ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}