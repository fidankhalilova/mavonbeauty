"use client";
import ProductCard from "@/Components/ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { useTranslations } from "next-intl";

// Import Swiper styles
import "swiper/css";

interface Product {
  id: string;
  _id?: string;
  name: string;
  price: number;
  image: string;
  colors: string[];
  showWishlist?: boolean;
  badge?: string;
  rating?: number;
  reviews?: number;
  originalPrice?: number;
  images?: string[];
  brand?: string;
  color?: string;
  stock?: number;
}

const API_BASE_URL = "http://localhost:3001/api/v1";

export default function Suggestions() {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [totalSlides, setTotalSlides] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("Shop.suggestions");

  // Fetch random products from database
  useEffect(() => {
    const fetchRandomProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // First, get all products
        const response = await fetch(`${API_BASE_URL}/products`);
        const data = await response.json();

        if (data.success) {
          const allProducts = data.data || data.products || [];

          // Select 6 random products
          const randomProducts = getRandomProducts(allProducts, 6);

          // Transform products to match ProductCard format
          const transformedProducts = randomProducts.map((product: any) => {
            // Generate colors for display
            const colors = generateColorsFromProduct(product);

            // Determine if product should show wishlist button
            const showWishlist = product.stock > 0;

            // Determine badge based on stock
            let badge = "";
            if (product.stock < 10 && product.stock > 0) {
              badge = "Low Stock";
            } else if (product.stock === 0) {
              badge = "Out of Stock";
            }

            // Generate a random rating (for demo purposes)
            const rating = 3.5 + Math.random() * 1.5; // 3.5-5 star rating
            const reviews = Math.floor(Math.random() * 100) + 1;

            // Sometimes add original price for discount effect (20% of products)
            const originalPrice =
              Math.random() > 0.8 ? product.price * 1.2 : undefined;

            // Get image URL
            let imageUrl = "https://via.placeholder.com/400x500?text=No+Image";
            if (product.images && product.images.length > 0) {
              const firstImage = product.images[0];
              imageUrl = getFullImageUrl(firstImage);
            } else if (product.image) {
              const firstImage =
                typeof product.image === "string"
                  ? product.image
                  : product.image?.url;
              if (firstImage) {
                imageUrl = getFullImageUrl(firstImage);
              }
            }

            return {
              id: product._id || product.id,
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
          });

          setProducts(transformedProducts);
        } else {
          setError("Failed to fetch products");
        }
      } catch (err) {
        console.error("Error fetching random products:", err);
        setError("Error loading products. Please try again.");
        // Fallback to dummy data if API fails
        setProducts(getFallbackProducts());
      } finally {
        setLoading(false);
      }
    };

    fetchRandomProducts();
  }, []);

  // Helper function to get full image URL
  const getFullImageUrl = (imagePath: string): string => {
    if (imagePath.startsWith("http")) {
      return imagePath;
    } else if (imagePath.startsWith("/")) {
      return `${API_BASE_URL.replace("/api/v1", "")}${imagePath}`;
    } else {
      return `${API_BASE_URL.replace("/api/v1", "")}/${imagePath}`;
    }
  };

  // Helper function to generate colors from product data
  const generateColorsFromProduct = (product: any): string[] => {
    const colors: string[] = [];
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

    // Try to get colors from product
    if (
      product.colors &&
      Array.isArray(product.colors) &&
      product.colors.length > 0
    ) {
      product.colors.slice(0, 3).forEach((color: string) => {
        const normalizedColor = color.toLowerCase().trim();
        const hexColor = colorMap[normalizedColor] || "#808080";
        colors.push(hexColor);
      });
    } else if (product.color) {
      const normalizedColor = product.color.toLowerCase().trim();
      const hexColor = colorMap[normalizedColor] || "#808080";
      colors.push(hexColor);
    }

    // Add random colors if we don't have enough
    const additionalColors = [
      "#4DB8AC",
      "#B8E6D5",
      "#F4C2A8",
      "#F8B4AA",
      "#2C5F4F",
    ];
    while (colors.length < 3) {
      const randomColor =
        additionalColors[Math.floor(Math.random() * additionalColors.length)];
      if (!colors.includes(randomColor)) {
        colors.push(randomColor);
      }
    }

    return colors;
  };

  // Helper function to select random products
  const getRandomProducts = (allProducts: any[], count: number): any[] => {
    if (allProducts.length <= count) {
      return allProducts;
    }

    const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // Fallback products if API fails
  const getFallbackProducts = (): Product[] => {
    return [
      {
        id: "1",
        name: "Neutrogena Hydro Boost Water Gel",
        price: 500,
        image:
          "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=600",
        colors: ["#2C5F4F", "#C8E6C9", "#FFE5B4"],
        showWishlist: true,
        rating: 4.5,
        reviews: 42,
      },
      {
        id: "2",
        name: "Cetaphil Gentle Skin Cleanser",
        price: 280,
        image:
          "https://images.unsplash.com/photo-1667242196599-d2869afe3c3e?w=900&auto=format&fit=crop&q=60",
        colors: ["#F4C2A8", "#F8B4AA", "#B8E6D5"],
        showWishlist: true,
        rating: 4.2,
        reviews: 38,
      },
      {
        id: "3",
        name: "Hyaluronic Acid Moisturizer",
        price: 200,
        image:
          "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600",
        colors: ["#F4C2A8", "#B8E6D5", "#4DB8AC"],
        showWishlist: true,
        rating: 4.7,
        reviews: 56,
      },
      {
        id: "4",
        name: "Luxurious Body Butter",
        price: 200,
        image:
          "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600",
        colors: ["#F4C2A8", "#B8E6D5", "#4DB8AC"],
        showWishlist: true,
        rating: 4.3,
        reviews: 29,
      },
      {
        id: "5",
        name: "Vitamin C Serum",
        price: 450,
        image:
          "https://images.unsplash.com/photo-1720118492579-eaeb5e878bb7?w=900&auto=format&fit=crop&q=60",
        colors: ["#FFD700", "#F4C2A8", "#E8E8E8"],
        showWishlist: true,
        rating: 4.6,
        reviews: 67,
      },
      {
        id: "6",
        name: "Retinol Night Cream",
        price: 350,
        image:
          "https://images.unsplash.com/photo-1556228578-dd3f6e90bc1a?w=600",
        colors: ["#B8E6D5", "#4DB8AC", "#2C5F4F"],
        showWishlist: true,
        rating: 4.4,
        reviews: 31,
      },
    ];
  };

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

  // Handle product click
  const handleProductClick = (productId: string) => {
    window.location.href = `/shop/${productId}`;
  };

  // Show loading skeleton
  if (loading) {
    return (
      <div className="mt-20 px-4">
        <div>
          <h2 className="text-center font-bold text-3xl tracking-wide mb-10">
            {t("title")}
          </h2>
        </div>
        <div className="max-w-7xl mx-auto">
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
      </div>
    );
  }

  // Show error state
  if (error && products.length === 0) {
    return (
      <div className="mt-20 px-4">
        <div>
          <h2 className="text-center font-bold text-3xl tracking-wide mb-10">
            You may also like
          </h2>
        </div>
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800"
          >
            {t("main.tryAgain")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-20 px-4">
      <div>
        <div>
          <h2 className="text-center font-bold text-3xl tracking-wide mb-10">
            You may also like
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
    </div>
  );
}
