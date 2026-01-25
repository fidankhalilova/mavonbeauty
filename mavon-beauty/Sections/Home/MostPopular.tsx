"use client"
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';

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
    homePage: boolean;
}

const API_BASE_URL = 'http://localhost:5000/api/v1';

export default function MostPopular() {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHomePageProducts();
    }, []);

    const fetchHomePageProducts = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/products?homePage=true`);
            const data = await response.json();
            
            if (data.success) {
                setProducts(data.data || []);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    // Show skeleton loading with same UI structure
    if (loading) {
        return (
            <section className="py-16 px-4 md:px-8 -mt-2.5 bg-white" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-gray-800">
                        Most Popular
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="animate-pulse">
                                <div className="bg-gray-200 h-96 mb-4 rounded"></div>
                                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    // If no products, show empty state but keep UI structure
    if (products.length === 0) {
        return (
            <section className="py-16 px-4 md:px-8 -mt-2.5 bg-white" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-gray-800">
                        Most Popular
                    </h2>
                    <div className="text-center py-12">
                        <p className="text-gray-500">No featured products available</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 px-4 md:px-8 -mt-2.5 bg-white" style={{ fontFamily: '"Montserrat", sans-serif' }}>
            <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-gray-800">
                    Most Popular
                </h2>
                <div className="relative">
                    <button className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10 w-12 h-12 rounded-full border-2 border-gray-300 bg-white hover:bg-gray-50 flex items-center justify-center transition-colors">
                        <ChevronLeft className="w-6 h-6 text-gray-600" />
                    </button>

                    <button className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10 w-12 h-12 rounded-full border-2 border-gray-300 bg-white hover:bg-gray-50 flex items-center justify-center transition-colors">
                        <ChevronRight className="w-6 h-6 text-gray-600" />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ">
                        {products.map((product, index) => (
                            <div key={product._id} className="group">
                                <div
                                    className="relative mb-4 overflow-hidden bg-transparent "
                                    onMouseEnter={() => setHoveredIndex(index)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                >
                                    <div className="h-100 w-full relative ">
                                        <img
                                            src={
                                                product.images && product.images.length > 0
                                                    ? `${API_BASE_URL.replace('/api/v1', '')}${product.images[0]}`
                                                    : 'https://via.placeholder.com/400x500?text=No+Image'
                                            }
                                            alt={product.name}
                                            className={`w-full h-full object-cover transition-opacity duration-300 ${
                                                hoveredIndex === index ? 'opacity-0' : 'opacity-100'
                                            }`}
                                            onError={(e) => {
                                                e.currentTarget.src = 'https://via.placeholder.com/400x500?text=No+Image';
                                            }}
                                        />
                                        <img
                                            src={
                                                product.images && product.images.length > 1
                                                    ? `${API_BASE_URL.replace('/api/v1', '')}${product.images[1]}`
                                                    : product.images && product.images.length > 0
                                                    ? `${API_BASE_URL.replace('/api/v1', '')}${product.images[0]}`
                                                    : 'https://via.placeholder.com/400x500?text=No+Image'
                                            }
                                            alt={product.name}
                                            className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-300 ${
                                                hoveredIndex === index ? 'opacity-100' : 'opacity-0'
                                            }`}
                                            onError={(e) => {
                                                e.currentTarget.src = 'https://via.placeholder.com/400x500?text=No+Image';
                                            }}
                                        />
                                    </div>
                                    <button className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white hover:bg-green-200 text-black  flex items-center justify-center transition-colors shadow-lg">
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="text-left">
                                    <h3 className="text-gray-900 font-bold mb-2 text-sm md:text-base">
                                        {product.name}
                                    </h3>
                                    <p className="text-gray-900 font-semibold mb-3 text-[19px]">
                                        From ${product.price.toFixed(2)}
                                    </p>
                                    <div className="flex items-center justify-left gap-2">
                                        {/* Show brand as a color badge if available */}
                                        {product.brand && (
                                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                                {product.brand}
                                            </span>
                                        )}
                                        {/* Show color info if available */}
                                        {product.color && (
                                            <span className="text-xs text-gray-600">
                                                {product.color}
                                            </span>
                                        )}
                                        {/* Show image count as extra colors */}
                                        {product.images && product.images.length > 3 && (
                                            <span className="text-sm text-gray-600">
                                                +{product.images.length - 3}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}