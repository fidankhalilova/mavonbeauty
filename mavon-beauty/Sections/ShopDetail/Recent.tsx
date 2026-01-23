"use client";
import ProductCard from "@/Components/ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";

// Import Swiper styles
import "swiper/css";

export default function Recent() {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [totalSlides, setTotalSlides] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4); // Default for SSR

  const products = [
    {
      id: 1,
      name: "Neutrogena Hydro Boost Water Gel",
      price: 500,
      image:
        "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=600",
      colors: ["#2C5F4F", "#C8E6C9", "#FFE5B4"],
      moreColors: 3,
      showWishlist: true,
    },
    {
      id: 2,
      name: "Cetaphil Gentle Skin Cleanser",
      price: 280,
      image: "https://images.unsplash.com/photo-1556228578-dd3f6e90bc1a?w=600",
      colors: ["#F4C2A8", "#F8B4AA", "#B8E6D5"],
      moreColors: 3,
      showWishlist: true,
    },
    {
      id: 3,
      name: "Hyaluronic Acid Moisturizer",
      price: 200,
      image:
        "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600",
      colors: ["#F4C2A8", "#B8E6D5", "#4DB8AC"],
      moreColors: 2,
      showWishlist: true,
    },
    {
      id: 4,
      name: "Luxurious Body Butter",
      price: 200,
      image:
        "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600",
      colors: ["#F4C2A8", "#B8E6D5", "#4DB8AC"],
      moreColors: 2,
      showWishlist: true,
    },
    {
      id: 5,
      name: "Vitamin C Serum",
      price: 450,
      image: "https://images.unsplash.com/photo-1556229010-aa1e86d66414?w=600",
      colors: ["#FFD700", "#F4C2A8", "#E8E8E8"],
      moreColors: 1,
      showWishlist: true,
    },
  ];

  // Calculate responsive values on client side
  useEffect(() => {
    const calculateResponsiveValues = () => {
      const width = window.innerWidth;
      let newItemsPerView = 4;

      if (width >= 1024) {
        newItemsPerView = 4;
      } else if (width >= 768) {
        newItemsPerView = 3;
      } else if (width >= 640) {
        newItemsPerView = 2;
      } else {
        newItemsPerView = 1;
      }

      setItemsPerView(newItemsPerView);
      // Calculate total slides for dots (max slide positions)
      setTotalSlides(Math.max(0, products.length - newItemsPerView + 1));
    };

    // Calculate on mount
    calculateResponsiveValues();

    // Recalculate on resize
    window.addEventListener("resize", calculateResponsiveValues);

    return () => {
      window.removeEventListener("resize", calculateResponsiveValues);
    };
  }, [products.length]);

  // Function to calculate total slides (using state)
  const getTotalSlides = () => {
    return totalSlides;
  };

  return (
    <div className="mt-20 px-4">
      <div>
        <div>
          <h2 className="text-center font-bold text-3xl tracking-wide mb-10">
            Recently viewed product
          </h2>
        </div>

        <div className="relative max-w-7xl mx-auto">
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
              }}
              onSlideChange={(swiper) => {
                setActiveIndex(swiper.activeIndex);
              }}
              className="pb-10!"
            >
              {products.map((product) => (
                <SwiperSlide key={product.id} className="h-auto!">
                  <div className="h-full">
                    <ProductCard product={product} />
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
    </div>
  );
}
