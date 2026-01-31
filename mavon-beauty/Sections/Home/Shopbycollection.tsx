"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef } from "react";
import type { Swiper as SwiperType } from "swiper";
import { useTranslations } from "next-intl";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";

export default function ShopByCollection() {
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [totalSlides, setTotalSlides] = useState(0);

  const swiperRef = useRef<SwiperType | null>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const t = useTranslations("Home.shopByCollection");

  const categories = [
    {
      name: t("nailCare"),
      image:
        "https://mavon-beauty.myshopify.com/cdn/shop/files/3_f6fe49f6-0d17-44c9-871c-0fa418ee0ee9.png?v=1686138362&width=1500",
    },
    {
      name: t("skinCare"),
      image:
        "https://images.unsplash.com/photo-1763873993447-1d0be71a96d9?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHNvZnQlMjBiZWF1dHklMjBwcm9kdWN0c3xlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      name: t("makeup"),
      image:
        "https://mavon-beauty.myshopify.com/cdn/shop/files/Rectangle_354.png?v=1686369354&width=1500",
    },
    {
      name: t("bodyCare"),
      image:
        "https://mavon-beauty.myshopify.com/cdn/shop/files/Rectangle_355.png?v=1686369370&width=1500",
    },
    {
      name: t("hairCare"),
      image:
        "https://mavon-beauty.myshopify.com/cdn/shop/files/1_c9dfc688-81b0-4226-a6a7-d3bcc0b1b6d9.png?v=1686138339&width=1500",
    },
    {
      name: t("fragrance"),
      image:
        "https://mavon-beauty.myshopify.com/cdn/shop/files/2_da6259a5-cff6-4e33-bab7-148a4608e7cc.png?v=1686138353&width=1500",
    },
  ];

  // Function to calculate total slides for dots
  const getTotalSlides = () => {
    return totalSlides;
  };

  // Handle category click
  const handleCategoryClick = (categoryName: string) => {
    // Navigate to category page or filter products
    console.log("Navigating to category:", categoryName);
    // Example: window.location.href = `/shop?category=${encodeURIComponent(categoryName)}`;
  };

  return (
    <section
      className="py-16 px-4 md:px-8 bg-white -mt-7.5"
      style={{ fontFamily: '"Montserrat", sans-serif' }}
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-[40px] font-bold text-center mb-12 text-gray-900">
          Shop by collection
        </h2>

        <div className="relative">
          {/* Previous Button */}
          <button
            ref={prevRef}
            onClick={() => swiperRef.current?.slidePrev()}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-lg flex items-center justify-center transition-all border border-gray-200 hover:bg-gray-50 hover:shadow-xl disabled:opacity-30 disabled:cursor-not-allowed"
            disabled={activeIndex === 0}
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          {/* Swiper Container */}
          <div className="px-12 md:px-14">
            <Swiper
              spaceBetween={24}
              slidesPerView={1}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 3,
                  spaceBetween: 24,
                },
                1024: {
                  slidesPerView: 4,
                  spaceBetween: 24,
                },
              }}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
                // Calculate initial total slides
                setTotalSlides(
                  Math.max(
                    0,
                    categories.length -
                      (swiper.params.slidesPerView as number) +
                      1,
                  ),
                );
              }}
              onSlideChange={(swiper) => {
                setActiveIndex(swiper.activeIndex);
              }}
              onBreakpoint={(swiper) => {
                // Recalculate total slides when breakpoint changes
                setTotalSlides(
                  Math.max(
                    0,
                    categories.length -
                      (swiper.params.slidesPerView as number) +
                      1,
                  ),
                );
              }}
              className="pb-10!"
            >
              {categories.map((category, index) => (
                <SwiperSlide key={index} className="h-auto!">
                  <div
                    className="group relative overflow-hidden cursor-pointer h-full"
                    onMouseEnter={() => setHoveredCategory(index)}
                    onMouseLeave={() => setHoveredCategory(null)}
                    onClick={() => handleCategoryClick(category.name)}
                  >
                    <div className="relative h-80 overflow-hidden">
                      <img
                        src={category.image}
                        alt={category.name}
                        className={`w-full h-full object-cover transition-transform duration-500 ${
                          hoveredCategory === index ? "scale-110" : "scale-100"
                        }`}
                      />
                    </div>
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                      <button className="bg-white px-4 py-3 rounded-sm font-semibold text-gray-900 hover:bg-gray-900 hover:text-white transition-colors shadow-lg">
                        {category.name}
                      </button>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Next Button */}
          <button
            ref={nextRef}
            onClick={() => swiperRef.current?.slideNext()}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-lg flex items-center justify-center transition-all border border-gray-200 hover:bg-gray-50 hover:shadow-xl disabled:opacity-30 disabled:cursor-not-allowed"
            disabled={activeIndex >= getTotalSlides() - 1}
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Custom Dots Indicator - Only show if there's more than 1 slide */}
        {totalSlides > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: getTotalSlides() }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => swiperRef.current?.slideTo(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === activeIndex
                    ? "bg-gray-900 w-8"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
