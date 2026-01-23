"use client";
import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Plus,
  Heart,
  Columns2,
  Columns3,
  Square,
} from "lucide-react";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import ProductCard from "@/Components/ProductCard";

// Main Shop Page Component
export default function ShopMain() {
  const [layout, setLayout] = useState(3); // 1, 2, or 3 columns
  const [priceRange, setPriceRange] = useState([0, 1500]);
  const [openSections, setOpenSections] = useState({
    availability: true,
    price: true,
    color: false,
    brand: true,
    weight: false,
  });

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
      // ADD THESE FIELDS FOR MODAL:
      description:
        "Hydrating water gel that provides 48-hour moisture for plump, dewy skin. Hydrating water gel that provides 48-hour moisture for plump, dewy skin. Hydrating water gel that provides 48-hour moisture for plump, dewy skin.",
      colorOptions: [
        { name: "Forest Green", hex: "#2C5F4F" },
        { name: "Mint", hex: "#C8E6C9" },
        { name: "Peach", hex: "#FFE5B4" },
        { name: "Sky Blue", hex: "#87CEEB" },
      ],
      weightOptions: ["50ml", "100ml", "200ml"],
      badge: "Bestseller",
    },
    {
      id: 2,
      name: "Cetaphil Gentle Skin Cleanser",
      price: 280,
      image: "https://images.unsplash.com/photo-1556228578-dd3f6e90bc1a?w=600",
      colors: ["#F4C2A8", "#F8B4AA", "#B8E6D5"],
      moreColors: 3,
      showWishlist: true,
      // ADD THESE FIELDS FOR MODAL:
      description:
        "Gentle, non-irritating cleanser perfect for sensitive skin.",
      colorOptions: [
        { name: "Peach Orange", hex: "#F4C2A8" },
        { name: "Rose Pink", hex: "#F8B4AA" },
        { name: "Mint Green", hex: "#B8E6D5" },
      ],
      weightOptions: ["100ml", "200ml", "400ml"],
    },
    {
      id: 3,
      name: "Neutrogena Hydro Boost Water Gel",
      price: 500,
      image:
        "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=600",
      colors: ["#2C5F4F", "#C8E6C9", "#FFE5B4"],
      moreColors: 3,
      showWishlist: true,
      // ADD THESE FIELDS FOR MODAL:
      description:
        "Hydrating water gel that provides 48-hour moisture for plump, dewy skin.",
      colorOptions: [
        { name: "Forest Green", hex: "#2C5F4F" },
        { name: "Mint", hex: "#C8E6C9" },
        { name: "Peach", hex: "#FFE5B4" },
        { name: "Sky Blue", hex: "#87CEEB" },
      ],
      weightOptions: ["50ml", "100ml", "200ml"],
      badge: "Bestseller",
    },
    {
      id: 4,
      name: "Cetaphil Gentle Skin Cleanser",
      price: 280,
      image: "https://images.unsplash.com/photo-1556228578-dd3f6e90bc1a?w=600",
      colors: ["#F4C2A8", "#F8B4AA", "#B8E6D5"],
      moreColors: 3,
      showWishlist: true,
      // ADD THESE FIELDS FOR MODAL:
      description:
        "Gentle, non-irritating cleanser perfect for sensitive skin.",
      colorOptions: [
        { name: "Peach Orange", hex: "#F4C2A8" },
        { name: "Rose Pink", hex: "#F8B4AA" },
        { name: "Mint Green", hex: "#B8E6D5" },
      ],
      weightOptions: ["100ml", "200ml", "400ml"],
    },
    {
      id: 5,
      name: "Neutrogena Hydro Boost Water Gel",
      price: 500,
      image:
        "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=600",
      colors: ["#2C5F4F", "#C8E6C9", "#FFE5B4"],
      moreColors: 3,
      showWishlist: true,
      // ADD THESE FIELDS FOR MODAL:
      description:
        "Hydrating water gel that provides 48-hour moisture for plump, dewy skin.",
      colorOptions: [
        { name: "Forest Green", hex: "#2C5F4F" },
        { name: "Mint", hex: "#C8E6C9" },
        { name: "Peach", hex: "#FFE5B4" },
        { name: "Sky Blue", hex: "#87CEEB" },
      ],
      weightOptions: ["50ml", "100ml", "200ml"],
      badge: "Bestseller",
    },
    {
      id: 6,
      name: "Cetaphil Gentle Skin Cleanser",
      price: 280,
      image: "https://images.unsplash.com/photo-1556228578-dd3f6e90bc1a?w=600",
      colors: ["#F4C2A8", "#F8B4AA", "#B8E6D5"],
      moreColors: 3,
      showWishlist: true,
      // ADD THESE FIELDS FOR MODAL:
      description:
        "Gentle, non-irritating cleanser perfect for sensitive skin.",
      colorOptions: [
        { name: "Peach Orange", hex: "#F4C2A8" },
        { name: "Rose Pink", hex: "#F8B4AA" },
        { name: "Mint Green", hex: "#B8E6D5" },
      ],
      weightOptions: ["100ml", "200ml", "400ml"],
    },
  ];

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const getGridClass = () => {
    if (layout === 1) return "grid-cols-1";
    if (layout === 2) return "grid-cols-1 md:grid-cols-2";
    return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
  };

  return (
    <div className="py-8">
      {/* Header with Layout Switcher and Sort */}
      <div className="bg-white rounded-lg py-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-3">
          <button
            onClick={() => setLayout(1)}
            className={`pr-2 hover:bg-gray-100 rounded transition-colors ${
              layout === 1 ? "text-green-600" : "text-gray-400"
            }`}
            title="1 column"
          >
            <Square />
          </button>
          <button
            onClick={() => setLayout(2)}
            className={`p-2 hover:bg-gray-100 rounded transition-colors ${
              layout === 2 ? "text-green-600" : "text-gray-400"
            }`}
            title="2 columns"
          >
            <Columns2 />
          </button>
          <button
            onClick={() => setLayout(3)}
            className={`p-2 hover:bg-gray-100 rounded transition-colors ${
              layout === 3 ? "text-green-600" : "text-gray-400"
            }`}
            title="3 columns"
          >
            <Columns3 />
          </button>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          <span className="text-sm font-medium">Sort by:</span>
          <select className="border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200">
            <option>Alphabetically, A-Z</option>
            <option>Alphabetically, Z-A</option>
            <option>Price, low to high</option>
            <option>Price, high to low</option>
            <option>Date, old to new</option>
            <option>Date, new to old</option>
          </select>
          <span className="text-sm font-medium whitespace-nowrap">
            20 products
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg py-6 pr-4 sticky top-4">
            <h3 className="text-lg font-bold mb-6">Filter:</h3>

            {/* Availability Filter */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <button
                onClick={() => toggleSection("availability")}
                className="flex justify-between items-center w-full text-left font-semibold mb-4"
              >
                <span>Availability</span>
                {openSections.availability ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              {openSections.availability && (
                <div className="space-y-3">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span className="text-sm">In stock</span>
                    </div>
                    <span className="text-sm text-gray-500">(20)</span>
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-400">
                        Out of stock
                      </span>
                    </div>
                    <span className="text-sm text-gray-400">(0)</span>
                  </label>
                </div>
              )}
            </div>

            {/* Price Filter */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <button
                onClick={() => toggleSection("price")}
                className="flex justify-between items-center w-full text-left font-semibold mb-4"
              >
                <span>Price</span>
                {openSections.price ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              {openSections.price && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    The highest price is $1,500.00
                  </p>
                  <div className="relative pt-2">
                    <RangeSlider
                      defaultValue={[0, 1500]}
                      value={[priceRange[0], priceRange[1]]}
                      onInput={(value) => setPriceRange(value)}
                      min={0}
                      max={1500}
                      step={10}
                    />
                  </div>
                  <div className="pt-4">
                    <p className="text-sm font-medium">
                      Price: ${priceRange[0]} - ${priceRange[1]}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Color Filter */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <button
                onClick={() => toggleSection("color")}
                className="flex justify-between items-center w-full text-left font-semibold mb-4"
              >
                <span>Color</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Brand Filter */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <button
                onClick={() => toggleSection("brand")}
                className="flex justify-between items-center w-full text-left font-semibold mb-4"
              >
                <span>Brand</span>
                {openSections.brand ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              {openSections.brand && (
                <div className="space-y-3">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span className="text-sm">Beauty</span>
                    </div>
                    <span className="text-sm text-gray-500">(14)</span>
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span className="text-sm">Mavon</span>
                    </div>
                    <span className="text-sm text-gray-500">(1)</span>
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span className="text-sm">Mavon Beauty</span>
                    </div>
                    <span className="text-sm text-gray-500">(5)</span>
                  </label>
                </div>
              )}
            </div>

            {/* Weight Filter */}
            <div className="pb-2">
              <button
                onClick={() => toggleSection("weight")}
                className="flex justify-between items-center w-full text-left font-semibold"
              >
                <span>Weight</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          <div className={`grid ${getGridClass()} gap-6`}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
