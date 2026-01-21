"use client"
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useState } from 'react';

export default function MostPopular() {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const products = [
        {
            name: "Neutrogena Hydro Boost Water Gel",
            price: "From $500.00",
            image: "https://mavon-beauty.myshopify.com/cdn/shop/files/18_2d9de600-36bb-4e80-a564-80a4e956a4f7.png?v=1686134750&width=1445",
            hoverImage: "https://mavon-beauty.myshopify.com/cdn/shop/files/17_ebf925ce-dc42-488c-951d-974c50c1e3a4.png?v=1686134750&width=1445",
            colors: ["#2D5F4C", "#C8D5C8", "#F5E6D3"],
            extraColors: 3
        },
        {
            name: "Cetaphil Gentle Skin Cleanser",
            price: "From $280.00",
            image: "https://mavon-beauty.myshopify.com/cdn/shop/files/17_ebf925ce-dc42-488c-951d-974c50c1e3a4.png?v=1686134750&width=1445",
            hoverImage: "https://mavon-beauty.myshopify.com/cdn/shop/files/16_e8458d18-4c37-4ec0-bb3d-533d6a4a96cc.png?v=1686134750&width=1445",
            colors: ["#F4B8A4", "#E8A89C", "#A8C9C9"],
            extraColors: 3
        },
        {
            name: "Hyaluronic Acid Moisturizer",
            price: "From $200.00",
            image: "https://mavon-beauty.myshopify.com/cdn/shop/files/16_e8458d18-4c37-4ec0-bb3d-533d6a4a96cc.png?v=1686134750&width=1445",
            hoverImage: "https://mavon-beauty.myshopify.com/cdn/shop/files/19.png?v=1686134750&width=1445",
            colors: ["#E8C4A8", "#A8C9C9", "#2D8B9C"],
            extraColors: 2
        },
        {
            name: "Luxurious Body Butter",
            price: "From $200.00",
            image: "https://mavon-beauty.myshopify.com/cdn/shop/files/1.png?v=1686042782&width=1445",
            hoverImage: "https://mavon-beauty.myshopify.com/cdn/shop/files/13_27828166-3931-4e17-9026-71cd6c52e1b5.png?v=1686134749&width=1445",
            colors: ["#E8C4A8", "#A8C9C9", "#2D8B9C"],
            extraColors: 2
        }
    ];

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
                            <div key={index} className="group">
                                <div
                                    className="relative mb-4 overflow-hidden bg-transparent "
                                    onMouseEnter={() => setHoveredIndex(index)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                >
                                    <div className="h-100 w-full relative ">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className={`w-full h-full object-cover transition-opacity duration-300 ${hoveredIndex === index ? 'opacity-0' : 'opacity-100'
                                                }`}
                                        />
                                        <img
                                            src={product.hoverImage}
                                            alt={product.name}
                                            className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-300 ${hoveredIndex === index ? 'opacity-100' : 'opacity-0'
                                                }`}
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
                </div>
            </div>
        </section>
    );
}