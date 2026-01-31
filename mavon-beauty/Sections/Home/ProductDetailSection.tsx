"use client";
import React, { useState } from "react";
import {
  ShoppingCart,
  Heart,
  Share2,
  Plus,
  Minus,
  Star,
  Facebook,
  Twitter,
} from "lucide-react";
import { useTranslations } from "next-intl";

export default function ProductDetailSection() {
  const [selectedColor, setSelectedColor] = useState("peach-orange");
  const [selectedWeight, setSelectedWeight] = useState("100gm");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const thumbnailRef = React.useRef(null);
  const t = useTranslations("Home.productDetail");

  const feature = t.raw("features"); // For array translation

  const colors = [
    { id: "light-green", color: "#D4E5D4", name: "Light Green" },
    { id: "peach-orange", color: "#FFD4B3", name: "Peach Orange" },
    { id: "dark-teal", color: "#2C5F5F", name: "Dark Teal" },
    { id: "light-pink", color: "#FFD4E5", name: "Light Pink" },
    { id: "purple", color: "#8B6B9B", name: "Purple" },
    { id: "light-gray", color: "#E5E5E5", name: "Light Gray" },
  ];

  const weights = ["100gm", "50gm", "200gm", "500gm"];

  const images = [
    "https://mavon-beauty.myshopify.com/cdn/shop/files/1.png?v=1686042782&width=990",
    "https://mavon-beauty.myshopify.com/cdn/shop/files/3.png?v=1686042170&width=990",
    "https://mavon-beauty.myshopify.com/cdn/shop/files/11_2dd34d08-3f42-4966-b576-8780e7016bc1.png?v=1686042194&width=990",
    "https://mavon-beauty.myshopify.com/cdn/shop/files/5.png?v=1686041880&width=990",
    "https://mavon-beauty.myshopify.com/cdn/shop/files/3.png?v=1686042170&width=990",
    "https://mavon-beauty.myshopify.com/cdn/shop/files/4_285a80d9-6ebf-4027-8016-f9faf48f2a92.png?v=1686041880&width=990",
  ];

  const features = [
    "Deeply hydrates and nourishes dry hands",
    "Skin-soothing properties",
    "Long-lasting hydration",
    "Improves overall hand health and appearance",
  ];

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const scrollLeft = () => {
    if (thumbnailRef.current) {
      thumbnailRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (thumbnailRef.current) {
      thumbnailRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 py-9 mt-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="w-175 h-195 flex items-center justify-center">
            <img
              src={images[selectedImage]}
              alt="Product"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative group w-175">
            <div
              ref={thumbnailRef}
              className="flex gap-3 overflow-x-auto scroll-smooth scrollbar-hide"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-32 h-32 shrink-0 overflow-hidden border-2 transition-all ${
                    selectedImage === idx
                      ? "border-gray-800"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-emerald-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-emerald-600 z-10"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-emerald-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-emerald-600 z-10"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="space-y-6 w-100 ml-22.5">
          {/* Brand */}
          <p className="text-sm text-black uppercase tracking-wider">
            {t("brand")}
          </p>
          <h1 className="text-4xl font-bold text-gray-900 -mt-2.5">
            {t("productName")}
          </h1>
          <div className="text-3xl font-bold text-gray-900">{t("price")}</div>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="w-5 h-5 fill-[#0AA350] text-[#0AA350]"
              />
            ))}
            <span className="text-sm text-gray-500">{t("reviews")}</span>
          </div>
          <div className="space-y-2">
            <p className="text-[#0AA350] font-medium text-[14px]">
              {t("stockWarning")}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-[#0AA350] h-2 rounded-full"
                style={{ width: "45%" }}
              ></div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-gray-700 font-semibold text-[14px]">
                {t("color")}
              </span>
              <span className="text-gray-500 text-[14px]">
                {t("colorName")}
              </span>
            </div>
            <div className="flex gap-3">
              {colors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setSelectedColor(color.id)}
                  className={`w-8 h-8 rounded-lg border-2 transition-all ${
                    selectedColor === color.id
                      ? "border-gray-800 scale-110"
                      : "border-gray-300 hover:border-gray-500"
                  }`}
                  style={{ backgroundColor: color.color }}
                  title={color.name}
                />
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-gray-700 font-semibold text-[14px]">
                {t("weight")}
              </span>
              <span className="text-gray-500">{selectedWeight}</span>
            </div>
            <div className="flex gap-3">
              {weights.map((weight) => (
                <button
                  key={weight}
                  onClick={() => setSelectedWeight(weight)}
                  className={`px-3 py-1.25 rounded-[6px] border-2 font-medium transition-all ${
                    selectedWeight === weight
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-gray-700 border-gray-300 hover:border-gray-500"
                  }`}
                >
                  {weight}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-[#0AA350] flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-[#0AA350]"></div>
                </div>
                <span className="text-gray-600">{feature}</span>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <p className="text-gray-700 font-medium">{t("quantity")}</p>
            <div className="flex gap-4">
              <div className="flex items-center border-2 border-gray-300 rounded-lg">
                <button
                  onClick={decrementQuantity}
                  className="p-3 hover:bg-gray-100 transition-colors"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="px-6 text-lg font-medium">{quantity}</span>
                <button
                  onClick={incrementQuantity}
                  className="p-3 hover:bg-gray-100 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <button className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-gray-900 text-gray-900 font-semibold py-3 px-6 rounded-lg hover:bg-gray-900 hover:text-white transition-all">
                <ShoppingCart className="w-5 h-5" />
                {t("addToCart")}
              </button>
              <button className="w-full bg-[#0AA350] text-white font-semibold py-4 px-6 rounded-lg hover:bg-emerald-600 transition-colors">
                {t("buyNow")}
              </button>
            </div>
          </div>
          <div className="pt-6 border-t border-gray-200">
            <button className="flex items-center gap-2 text-gray-900 font-semibold">
              <Heart className="w-5 h-5" />
              Reviews
            </button>
          </div>
          <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
            <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
              <Facebook className="w-5 h-5" />
              Facebook
            </button>
            <button className="flex items-center gap-2 text-gray-600 hover:text-blue-400 transition-colors">
              <Twitter className="w-5 h-5" />
              Twitter
            </button>
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  }