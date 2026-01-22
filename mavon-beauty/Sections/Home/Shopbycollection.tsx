"use client"
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function ShopByCollection() {
    const [hoveredCategory, setHoveredCategory] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);

    const categories = [
        {
            name: "Nail care",
            image: "https://mavon-beauty.myshopify.com/cdn/shop/files/3_f6fe49f6-0d17-44c9-871c-0fa418ee0ee9.png?v=1686138362&width=1500",
        },
        {
            name: "Skin care",
            image: "https://mavon-beauty.myshopify.com/cdn/shop/files/4_a556d7ef-6106-46bd-82f6-9f117c303e5a.png?v=1686138395&width=1500",
        },
        {
            name: "Makeup",
            image: "https://mavon-beauty.myshopify.com/cdn/shop/files/Rectangle_354.png?v=1686369354&width=1500",
        },
        {
            name: "Body Care",
            image: "https://mavon-beauty.myshopify.com/cdn/shop/files/Rectangle_355.png?v=1686369370&width=1500",
        },
        {
            name: "Hair Care",
            image: "https://mavon-beauty.myshopify.com/cdn/shop/files/1_c9dfc688-81b0-4226-a6a7-d3bcc0b1b6d9.png?v=1686138339&width=1500",
        },
        {
            name: "Fragrance",
            image: "https://mavon-beauty.myshopify.com/cdn/shop/files/2_da6259a5-cff6-4e33-bab7-148a4608e7cc.png?v=1686138353&width=1500",
        }
    ];

    const itemsPerPage = 4;
    const maxSlide = categories.length - itemsPerPage;

    const nextSlide = () => {
        setCurrentSlide((prev) => Math.min(prev + 1, maxSlide));
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => Math.max(prev - 1, 0));
    };

    const visibleCategories = categories.slice(
        currentSlide,
        currentSlide + itemsPerPage
    );

    return (
        <section className="py-16 px-4 md:px-8 bg-white -mt-7.5" style={{ fontFamily: '"Montserrat", sans-serif' }}>
            <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl md:text-[40px] font-bold text-center mb-12 text-gray-900">
                    Shop by collection
                </h2>
                <div className="relative">
                    {currentSlide > 0 && (
                        <button
                            onClick={prevSlide}
                            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10 w-12 h-12 rounded-full border-2 border-gray-300 bg-white hover:bg-gray-50 flex items-center justify-center transition-colors"
                        >
                            <ChevronLeft className="w-6 h-6 text-gray-600" />
                        </button>
                    )}

                    {currentSlide < maxSlide && (
                        <button
                            onClick={nextSlide}
                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10 w-12 h-12 rounded-full border-2 border-gray-300 bg-white hover:bg-gray-50 flex items-center justify-center transition-colors"
                        >
                            <ChevronRight className="w-6 h-6 text-gray-600" />
                        </button>
                    )}
                    <div className="overflow-hidden">
                        <div
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-500"
                        >
                            {visibleCategories.map((category, index) => (
                                <div
                                    key={currentSlide + index}
                                    className="group relative overflow-hidden cursor-pointer"
                                    onMouseEnter={() => setHoveredCategory(currentSlide + index)}
                                    onMouseLeave={() => setHoveredCategory(null)}
                                >
                                    <div className="relative h-80 overflow-hidden">
                                        <img
                                            src={category.image}
                                            alt={category.name}
                                            className={`w-full h-full object-cover transition-transform duration-500 ${hoveredCategory === currentSlide + index ? 'scale-110' : 'scale-100'
                                                }`}
                                        />
                                    </div>
                                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                                        <button className="bg-white px-8 py-3 rounded-sm font-semibold text-gray-900 hover:bg-gray-900 hover:text-white transition-colors shadow-lg">
                                            {category.name}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}