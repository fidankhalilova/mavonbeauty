"use client"
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useState } from 'react';

export default function FeaturedProducts() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [hoveredProduct, setHoveredProduct] = useState(null);
    const [hoveredHotspot, setHoveredHotspot] = useState(null);

    const products = [
        {
            name: "Cetaphil Gentle Skin Cleanser",
            price: "From $280.00",
            image: "https://mavon-beauty.myshopify.com/cdn/shop/files/2_9a1087f8-855e-482a-9e51-923b3259a5b4.png?v=1686040892",
            hoverImage: "https://mavon-beauty.myshopify.com/cdn/shop/files/5.png?v=1686041880&width=1445",
            colors: ["#F4B8A4", "#E8A89C", "#A8C9C9"],
            extraColors: 3
        },
        {
            name: "Benefit Cosmetics Hoola Matte Bronzer",
            price: "$500.00",
            image: "https://mavon-beauty.myshopify.com/cdn/shop/files/18_2d9de600-36bb-4e80-a564-80a4e956a4f7.png?v=1686134750&width=1445",
            hoverImage: "https://mavon-beauty.myshopify.com/cdn/shop/files/1_fe5db9ee-9d94-428a-bcd4-e4070d55eea2_360x.png?v=1686034002",
            colors: ["#F4B8A4", "#E8A89C", "#2D3436"],
            extraColors: 0
        },
        {
            name: "Hyaluronic Acid Moisturizer",
            price: "From $200.00",
            image: "https://mavon-beauty.myshopify.com/cdn/shop/files/16_e8458d18-4c37-4ec0-bb3d-533d6a4a96cc.png?v=1686134750&width=1445",
            hoverImage: "https://mavon-beauty.myshopify.com/cdn/shop/files/p-3-hover.png?v=1685785108&width=533",
            colors: ["#E8C4A8", "#A8C9C9", "#2D8B9C"],
            extraColors: 2
        }
    ];

    const hotspots = [
        {
            id: 1,
            top: "25%",
            left: "35%",
            product: "Cetaphil Gentle Skin Cleanser",
            price: "From $280.00"
        },
        {
            id: 2,
            top: "45%",
            right: "25%",
            product: "Organic Moisturizer",
            price: "$350.00"
        },
        {
            id: 3,
            bottom: "30%",
            right: "30%",
            product: "Vitamin C Serum",
            price: "$420.00"
        }
    ];

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % products.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + products.length) % products.length);
    };

    return (
        <section className="py-16 -my-10 px-4 md:px-8 bg-white" style={{ fontFamily: '"Montserrat", sans-serif' }}>
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center ">
                    <div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 -mt-20">
                            {products.slice(currentSlide, currentSlide + 2).map((product, index) => (
                                <div
                                    key={currentSlide + index}
                                    className="group "
                                    onMouseEnter={() => setHoveredProduct(currentSlide + index)}
                                    onMouseLeave={() => setHoveredProduct(null)}
                                >
                                    <div className="relative mb-4 overflow-hidden bg-transparent ">
                                        <div className="relative h-112.5 w-full  mx-auto">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className={`w-full h-full object-cover transition-opacity duration-300 ${hoveredProduct === currentSlide + index ? 'opacity-0' : 'opacity-100'
                                                    }`}
                                            />
                                            <img
                                                src={product.hoverImage}
                                                alt={product.name}
                                                className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-300 ${hoveredProduct === currentSlide + index ? 'opacity-100' : 'opacity-0'
                                                    }`}
                                            />
                                        </div>
                                        <button className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white hover:bg-black text-black hover:text-white flex items-center justify-center transition-colors shadow-lg">
                                            <Plus className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-gray-900 font-medium mb-2 text-sm md:text-base">
                                            {product.name}
                                        </h3>
                                        <p className="text-gray-900 font-semibold mb-3">
                                            {product.price}
                                        </p>
                                        <div className="flex items-center justify-left gap-2">
                                            {product.colors.map((color, colorIndex) => (
                                                <button
                                                    key={colorIndex}
                                                    className="w-6 h-6 rounded-full border-2 border-gray-200 hover:border-gray-400 transition-colors"
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                            {product.extraColors > 0 && (
                                                <span className="text-sm text-gray-600">+{product.extraColors}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-center items-left gap-1">
                            <button
                                onClick={prevSlide}
                                className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer"
                            >
                                <ChevronLeft className="w-5 h-5 text-black" />
                            </button>
                            <div className="flex items-center gap-2">
                                {products.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentSlide(index)}
                                        className={`w-4 h-4 rounded-full transition-all duration-300 cursor-pointer ${currentSlide === index ? 'border-2 border-black bg-black' : 'border-2 border-gray-400 bg-white'
                                            }`}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={nextSlide}
                                className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer"
                            >
                                <ChevronRight className="w-5 h-5 text-black" />
                            </button>
                        </div>
                    </div>
                    <div className="relative h-225  overflow-hidden group">
                        <img
                            src="https://mavon-beauty.myshopify.com/cdn/shop/files/lookbook.png?v=1684297825&width=750"
                            alt="Featured Beauty"
                            className="w-full h-full object-cover"
                        />
                        {hotspots.map((hotspot) => (
                            <div
                                key={hotspot.id}
                                className="absolute"
                                style={{
                                    top: hotspot.top,
                                    left: hotspot.left,
                                    right: hotspot.right,
                                    bottom: hotspot.bottom
                                }}
                                onMouseEnter={() => setHoveredHotspot(hotspot.id)}
                                onMouseLeave={() => setHoveredHotspot(null)}
                            >
                                <div className="relative">
                                    <div className="w-4 h-4 bg-white rounded-full border-2 border-white shadow-lg cursor-pointer animate-pulse" />
                                    {hoveredHotspot === hotspot.id && (
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white rounded-lg shadow-xl p-4 whitespace-nowrap z-10 animate-in fade-in slide-in-from-bottom-2">
                                            <div className="text-sm font-semibold text-gray-900 mb-1">
                                                {hotspot.product}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {hotspot.price}
                                            </div>
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                                                <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-white" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}