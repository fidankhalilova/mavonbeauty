"use client"
import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, X, Check, AlertCircle, Upload, Image as ImageIcon, Home } from 'lucide-react';

interface Product {
    _id: string;
    name: string;
    description: string;
    images: string[];
    brand: string;
    color: string;
    size: string;
    weight: number;
    price: number;
    stock: number;
    homePage?: boolean;
}

interface Brand {
    _id: string;
    name: string;
}

interface Color {
    _id: string;
    name: string;
    hexCode: string;
}

interface Size {
    _id: string;
    name: string;
    category: string;
}

const API_BASE_URL = 'http://localhost:5000/api/v1';

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [colors, setColors] = useState<Color[]>([]);
    const [sizes, setSizes] = useState<Size[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        brand: '',
        color: '',
        size: '',
        weight: 0,
        price: 0,
        stock: 0,
        homePage: false
    });

    // Fetch all data
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

    const fetchBrands = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/brands`);
            const data = await response.json();
            if (data.success) setBrands(data.data || []);
        } catch (err) {
            console.error('Error fetching brands:', err);
        }
    };

    const fetchColors = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/colors`);
            const data = await response.json();
            if (data.success) setColors(data.data || []);
        } catch (err) {
            console.error('Error fetching colors:', err);
        }
    };

    const fetchSizes = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/sizes`);
            const data = await response.json();
            if (data.success) setSizes(data.data || []);
        } catch (err) {
            console.error('Error fetching sizes:', err);
        }
    };

    // Handle file selection
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length + selectedFiles.length > 5) {
            alert('Maximum 5 images allowed');
            return;
        }

        setSelectedFiles(prev => [...prev, ...files]);

        // Create preview URLs
        const newPreviewUrls = files.map(file => URL.createObjectURL(file));
        setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    };

    // Remove selected image
    const removeSelectedImage = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        URL.revokeObjectURL(previewUrls[index]);
        setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    };

    // Delete product image from server
    const deleteProductImage = async (productId: string, imageUrl: string) => {
        if (!confirm('Delete this image?')) return;

        try {
            const response = await fetch(`${API_BASE_URL}/products/${productId}/image`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imageUrl })
            });
            const data = await response.json();

            if (data.success) {
                setProducts(products.map(p => p._id === productId ? data.data : p));
                if (editingProduct && editingProduct._id === productId) {
                    setEditingProduct(data.data);
                }
            }
        } catch (err) {
            console.error('Error deleting image:', err);
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

    const openCreateModal = () => {
        setEditingProduct(null);
        setFormData({
            name: '',
            description: '',
            brand: '',
            color: '',
            size: '',
            weight: 0,
            price: 0,
            stock: 0,
            homePage: false
        });
        setSelectedFiles([]);
        setPreviewUrls([]);
        setShowModal(true);
    };

    const openEditModal = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description || '',
            brand: product.brand,
            color: product.color,
            size: product.size,
            weight: product.weight,
            price: product.price,
            stock: product.stock,
            homePage: product.homePage || false
        });
        setSelectedFiles([]);
        setPreviewUrls([]);
        setShowModal(true);
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.brand) {
            alert('Please fill in all required fields');
            return;
        }
        
        try {
            const url = editingProduct 
                ? `${API_BASE_URL}/products/${editingProduct._id}`
                : `${API_BASE_URL}/products`;
            
            const method = editingProduct ? 'PUT' : 'POST';
            
            // Create FormData for file upload
            const formDataToSend = new FormData();
            Object.keys(formData).forEach(key => {
                formDataToSend.append(key, formData[key as keyof typeof formData].toString());
            });

            // Append images
            selectedFiles.forEach(file => {
                formDataToSend.append('images', file);
            });

            const response = await fetch(url, {
                method,
                body: formDataToSend
            });
            const data = await response.json();
            
            if (data.success) {
                if (editingProduct) {
                    setProducts(products.map(p => p._id === editingProduct._id ? data.data : p));
                } else {
                    setProducts([data.data, ...products]);
                }
                setShowModal(false);
                setEditingProduct(null);
                setSelectedFiles([]);
                setPreviewUrls([]);
            } else {
                alert(data.message || 'Failed to save product');
            }
        } catch (err) {
            alert('Error saving product');
            console.error('Error:', err);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchBrands();
        fetchColors();
        fetchSizes();
    }, []);

    // Cleanup preview URLs on unmount
    useEffect(() => {
        return () => {
            previewUrls.forEach(url => URL.revokeObjectURL(url));
        };
    }, [previewUrls]);

    if (loading && products.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-800">Product Management</h2>
                    <p className="text-gray-600 mt-1">Manage your product catalog</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Add Product
                </button>
            </div>

            {error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <span className="text-red-700">{error}</span>
                    <button onClick={() => setError(null)} className="ml-auto">
                        <X className="w-5 h-5 text-red-500" />
                    </button>
                </div>
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                    <div key={product._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                        {/* Product Image */}
                        <div className="relative h-48 bg-gray-100">
                            {product.images && product.images.length > 0 ? (
                                <img
                                    src={`${API_BASE_URL.replace('/api/v1', '')}${product.images[0]}`}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = 'https://via.placeholder.com/300x200?text=No+Image';
                                    }}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <ImageIcon className="w-12 h-12 text-gray-300" />
                                </div>
                            )}
                            {product.images && product.images.length > 1 && (
                                <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
                                    +{product.images.length - 1} more
                                </div>
                            )}
                            {product.homePage && (
                                <div className="absolute top-2 left-2 bg-emerald-500 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                                    <Home className="w-3 h-3" />
                                    <span>Home</span>
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="p-4">
                            <h3 className="font-semibold text-gray-800 mb-1">{product.name}</h3>
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                            
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs bg-gray-100 px-2 py-1 rounded">{product.brand}</span>
                                {product.color && colors.find(c => c.name === product.color) && (
                                    <div className="flex items-center gap-1">
                                        <div
                                            className="w-4 h-4 rounded-full border border-gray-300"
                                            style={{ backgroundColor: colors.find(c => c.name === product.color)?.hexCode }}
                                        ></div>
                                        <span className="text-xs text-gray-600">{product.color}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between mb-3">
                                <span className="text-lg font-bold text-emerald-600">${product.price.toFixed(2)}</span>
                                <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => openEditModal(product)}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    Edit
                                </button>
                                <button
                                    onClick={() => deleteProduct(product._id)}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {products.length === 0 && (
                    <div className="col-span-full text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Plus className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 mb-2">No products found</p>
                        <button
                            onClick={openCreateModal}
                            className="text-emerald-600 hover:text-emerald-700 font-medium"
                        >
                            Add your first product
                        </button>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-semibold mb-6">
                            {editingProduct ? 'Edit Product' : 'Add New Product'}
                        </h3>
                        
                        {/* Image Upload Section */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Product Images (Max 5)
                            </label>
                            
                            {/* Existing Images (Edit mode) */}
                            {editingProduct && editingProduct.images && editingProduct.images.length > 0 && (
                                <div className="mb-4">
                                    <p className="text-xs text-gray-500 mb-2">Current images:</p>
                                    <div className="grid grid-cols-5 gap-2">
                                        {editingProduct.images.map((img, idx) => (
                                            <div key={idx} className="relative group">
                                                <img
                                                    src={`${API_BASE_URL.replace('/api/v1', '')}${img}`}
                                                    alt={`Product ${idx + 1}`}
                                                    className="w-full h-20 object-cover rounded-lg border border-gray-200"
                                                />
                                                <button
                                                    onClick={() => deleteProductImage(editingProduct._id, img)}
                                                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* New Images Preview */}
                            {previewUrls.length > 0 && (
                                <div className="mb-4">
                                    <p className="text-xs text-gray-500 mb-2">New images to upload:</p>
                                    <div className="grid grid-cols-5 gap-2">
                                        {previewUrls.map((url, idx) => (
                                            <div key={idx} className="relative group">
                                                <img
                                                    src={url}
                                                    alt={`Preview ${idx + 1}`}
                                                    className="w-full h-20 object-cover rounded-lg border border-emerald-300"
                                                />
                                                <button
                                                    onClick={() => removeSelectedImage(idx)}
                                                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Upload Button */}
                            <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-colors">
                                <Upload className="w-5 h-5 text-gray-400" />
                                <span className="text-gray-600">Click to upload images</span>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Product Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g., Ruby Woo Lipstick"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Product description..."
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Brand *</label>
                                <select
                                    value={formData.brand}
                                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                >
                                    <option value="">Select brand</option>
                                    {brands.map(brand => (
                                        <option key={brand._id} value={brand.name}>{brand.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                                <select
                                    value={formData.color}
                                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                >
                                    <option value="">Select color</option>
                                    {colors.map(color => (
                                        <option key={color._id} value={color.name}>{color.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                                <select
                                    value={formData.size}
                                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                >
                                    <option value="">Select size</option>
                                    {sizes.map(size => (
                                        <option key={size._id} value={size.name}>{size.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg) *</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.weight || ''}
                                    onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })}
                                    placeholder="0.00"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Price ($) *</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.price || ''}
                                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                                    placeholder="0.00"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Stock *</label>
                                <input
                                    type="number"
                                    value={formData.stock || ''}
                                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                                    placeholder="0"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>

                            {/* HomePage Checkbox */}
                            <div className="col-span-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.homePage}
                                        onChange={(e) => setFormData({ ...formData, homePage: e.target.checked })}
                                        className="w-4 h-4 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500"
                                    />
                                    <div className="flex items-center gap-2">
                                        <Home className="w-4 h-4 text-emerald-600" />
                                        <span className="text-sm font-medium text-gray-700">
                                            Show on Home Page
                                        </span>
                                    </div>
                                </label>
                                <p className="text-xs text-gray-500 ml-6 mt-1">
                                    Enable to feature this product on the home page
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setEditingProduct(null);
                                    setSelectedFiles([]);
                                    setPreviewUrls([]);
                                }}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={!formData.name || !formData.brand}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Check className="w-5 h-5" />
                                {editingProduct ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}