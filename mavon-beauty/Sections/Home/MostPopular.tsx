"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import type { Swiper as SwiperType } from "swiper";
import { useTranslations } from "next-intl";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import ProductCard from "@/Components/ProductCard";

interface Product {
  _id: string;
  name: string;
  description: string;
  images: string[];
  brand: string;
  colors: string[];
  sizes: string[];
  weight: number;
  price: number;
  stock: number;
  homePage: boolean;
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

// Define the type expected by ProductCard
interface ProductCardProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  colors: string[];
  showWishlist: boolean;
  badge?: string;
  rating?: number;
  reviews?: number;
  originalPrice?: number;
}

const API_BASE_URL = "http://localhost:3001/api/v1";

export default function MostPopular() {
  const [products, setProducts] = useState<ProductCardProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [totalSlides, setTotalSlides] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);

  const swiperRef = useRef<SwiperType | null>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const t = useTranslations();

  useEffect(() => {
    fetchHomePageProducts();
  }, []);

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

  const fetchHomePageProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/products?homePage=true`);
      const data = await response.json();

      if (data.success) {
        const fetchedProducts = data.data || [];

        // Transform the API data to match ProductCard props
        const transformedProducts = fetchedProducts.map(
          (product: Product): ProductCardProduct => {
            // Generate colors from product data for display
            const colors: string[] = [];

            // If product has colors array, use them
            if (
              product.colors &&
              Array.isArray(product.colors) &&
              product.colors.length > 0
            ) {
              // Map color names to hex values
              const colorMap: Record<string, string> = {
                red: "#FF0000",
                green: "#00FF00",
                blue: "#0000FF",
                black: "#000000",
                white: "#FFFFFF",
                yellow: "#FFFF00",
                pink: "#FFC0CB",
                purple: "#800080",
                brown: "#A52A2A",
                gray: "#808080",
                silver: "#C0C0C0",
                gold: "#FFD700",
                beige: "#F5F5DC",
                navy: "#000080",
                teal: "#008080",
                orange: "#FFA500",
              };

              // Take first 3 colors from the array
              product.colors.slice(0, 3).forEach((colorName) => {
                const normalizedColor = colorName.toLowerCase().trim();
                const hexColor = colorMap[normalizedColor] || "#808080";
                colors.push(hexColor);
              });
            } else {
              // If no colors specified, generate some based on product
              const defaultColors = [
                "#4DB8AC",
                "#B8E6D5",
                "#F4C2A8",
                "#F8B4AA",
                "#2C5F4F",
              ];
              colors.push(...defaultColors.slice(0, 2));
            }

            // Add additional color variations if images exist
            if (product.images && product.images.length > 1) {
              const additionalColors = [
                "#4DB8AC",
                "#B8E6D5",
                "#F4C2A8",
                "#F8B4AA",
                "#2C5F4F",
              ];
              for (let i = 0; i < Math.min(product.images.length - 1, 2); i++) {
                if (colors.length < 3) {
                  colors.push(additionalColors[i % additionalColors.length]);
                }
              }
            }

            // Determine if product should show wishlist button
            const showWishlist = product.stock > 0;

            // Determine badge based on stock
            let badge = "";
            if (product.stock < 10 && product.stock > 0) {
              badge = "Low Stock";
            } else if (product.stock === 0) {
              badge = "Out of Stock";
            }

            // Generate a rating (for demo purposes)
            const rating = 4 + Math.random(); // 4-5 star rating
            const reviews = Math.floor(Math.random() * 100) + 1;

            // Sometimes add original price for discount effect
            const originalPrice =
              Math.random() > 0.7 ? product.price * 1.2 : undefined;

            // Transform image URL
            let imageUrl = "https://via.placeholder.com/400x500?text=No+Image";
            if (product.images && product.images.length > 0) {
              const firstImage = product.images[0];
              if (firstImage.startsWith("http")) {
                imageUrl = firstImage; // Already absolute URL
              } else if (firstImage.startsWith("/")) {
                imageUrl = `${API_BASE_URL.replace("/api/v1", "")}${firstImage}`;
              } else {
                imageUrl = `${API_BASE_URL.replace("/api/v1", "")}/${firstImage}`;
              }
            }

            return {
              id: product._id,
              name: product.name,
              price: product.price,
              image: imageUrl,
              colors,
              showWishlist,
              badge: badge || undefined,
              rating: parseFloat(rating.toFixed(1)),
              reviews,
              originalPrice,
            };
          },
        );

        setProducts(transformedProducts);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to calculate total slides (using state)
  const getTotalSlides = () => {
    return totalSlides;
  };

  // Handle product click
  const handleProductClick = (productId: string) => {
    // Navigate to product detail page
    window.location.href = `/shop/${productId}`;
  };

  // Show skeleton loading
  if (loading) {
    return (
      <section
        className="py-16 px-4 md:px-8 -mt-2.5 bg-white"
        style={{ fontFamily: '"Montserrat", sans-serif' }}
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-gray-800">
            {t("Home.mostPopular.sectionTitle")}
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
      <section
        className="py-16 px-4 md:px-8 -mt-2.5 bg-white"
        style={{ fontFamily: '"Montserrat", sans-serif' }}
      >
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
    <section
      className="py-16 px-4 md:px-8 -mt-2.5 bg-white"
      style={{ fontFamily: '"Montserrat", sans-serif' }}
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-gray-800">
          Most Popular
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
              }}
              onSlideChange={(swiper) => {
                setActiveIndex(swiper.activeIndex);
              }}
              className="pb-10!"
            >
              {products.map((product) => (
                <SwiperSlide key={product.id} className="h-auto!">
                  <div className="h-full">
                    <ProductCard
                      product={product}
                      onProductClick={() => handleProductClick(product.id)}
                    />
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
