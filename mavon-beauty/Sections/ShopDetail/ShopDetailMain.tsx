"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  Minus,
  Plus,
  ShoppingBag,
  ChevronDown,
  Heart,
  Share2,
} from "lucide-react";
import { useCart } from "@/context/CardContext"; // Import the useCart hook

interface Color {
  _id: string;
  name: string;
  hexCode: string;
}

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

const API_BASE_URL = "http://localhost:3001/api/v1";

export default function ShopDetailMain() {
  const params = useParams();
  const productId = params?.id as string;
  const router = useRouter();
  const { addToCart, currentUserId } = useCart(); // Get cart functions

  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [openSection, setOpenSection] = useState<string | null>("description");
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [colorsList, setColorsList] = useState<Color[]>([]);
  const [isAddingToCart, setIsAddingToCart] = useState(false); // Loading state for cart

  useEffect(() => {
    if (productId) {
      fetchColors();
      fetchProduct();
    }
  }, [productId]);

  const fetchColors = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/colors`);
      const data = await response.json();
      if (data.success) {
        setColorsList(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching colors:", error);
    }
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/products/${productId}`);
      const data = await response.json();

      if (data.success) {
        const productData = data.data;
        setProduct(productData);

        // Set default selections
        if (productData.colors && productData.colors.length > 0) {
          setSelectedColor(productData.colors[0]);
        }
        if (productData.sizes && productData.sizes.length > 0) {
          setSelectedSize(productData.sizes[0]);
        }
      } else {
        setError("Product not found");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      setError("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleQuantityIncrease = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && product && value <= product.stock) {
      setQuantity(value);
    }
  };

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const getGradientClass = (index: number): string => {
    const gradients = [
      "from-pink-50 to-orange-50",
      "from-green-50 to-emerald-50",
      "from-cyan-50 to-blue-50",
      "from-purple-50 to-pink-50",
      "from-pink-100 to-rose-50",
      "from-yellow-50 to-orange-50",
    ];
    return gradients[index % gradients.length];
  };

  const getStockPercentage = () => {
    if (!product) return 0;
    const maxStock = 100;
    return Math.min((product.stock / maxStock) * 100, 100);
  };

  // Helper function to get hex code for a color name
  const getHexCodeForColor = (colorName: string): string => {
    const colorObj = colorsList.find((c) => c.name === colorName);
    return colorObj ? colorObj.hexCode : "#CCCCCC";
  };

  // Function to handle Add to Cart using CartContext
  const handleAddToCart = async () => {
    if (!product) return;

    setIsAddingToCart(true);

    try {
      console.log("🛍️ Add to Cart clicked for product:", product.name);
      console.log("👤 Current user ID:", currentUserId);
      console.log("🎨 Selected color:", selectedColor);
      console.log("📦 Selected size:", selectedSize);
      console.log("🔢 Quantity:", quantity);

      // Get color hex code
      const colorHex = getHexCodeForColor(selectedColor);

      // Prepare cart item according to CartItem interface
      const cartItem = {
        id: product._id, // This is the product ID
        name: product.name,
        price: product.price,
        originalPrice: product.price, // Same as price since no discount
        image: product.images?.[0]
          ? `${API_BASE_URL.replace("/api/v1", "")}${product.images[0]}`
          : "https://via.placeholder.com/600x600?text=No+Image",
        selectedColor: {
          name: selectedColor,
          hex: colorHex,
        },
        selectedWeight: selectedSize, // Using size as weight in cart
        quantity: quantity,
        description:
          product.description || `${product.name} - ${product.brand}`,
        // Additional fields from CartItem interface
        color: selectedColor,
        weight: product.weight,
        deliveryMethod: "Standard",
        model: product.name,
        hsCode: "330499", // Default HS code for cosmetics
        addedAt: new Date().toISOString(),
      };

      console.log("📦 Prepared cart item:", cartItem);

      // Use the CartContext addToCart function
      await addToCart(cartItem);

      // If addToCart doesn't throw an error, it means it was successful
      // The CartContext will handle the alert/success message

      console.log("✅ Successfully added to cart via CartContext");
    } catch (error: any) {
      console.error("❌ Error in handleAddToCart:", error);

      // Only show alert if error is not about authentication
      if (
        error.message !== "User not authenticated" &&
        error.message !== "No user ID found"
      ) {
        alert("❌ Failed to add to cart. Please try again.");
      }
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Function to handle Buy it Now
  const handleBuyNow = async () => {
    if (!product) return;

    try {
      // First add to cart
      await handleAddToCart();

      // Check if user is authenticated (CartContext will redirect if not)
      const token = localStorage.getItem("accessToken");
      const user = localStorage.getItem("user");

      if (token && user) {
        // Then redirect to basket page
        router.push("/basket");
      }
    } catch (error) {
      console.error("❌ Error in Buy Now:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="inline-block w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-xl text-gray-600 mb-4">
          {error || "Product not found"}
        </p>
        <a
          href="/shop"
          className="text-emerald-600 hover:text-emerald-700 underline"
        >
          Back to Shop
        </a>
      </div>
    );
  }

  const productImages =
    product.images && product.images.length > 0
      ? product.images.map(
          (img) => `${API_BASE_URL.replace("/api/v1", "")}${img}`,
        )
      : ["https://via.placeholder.com/600x600?text=No+Image"];

  const mainImage = productImages[selectedImageIndex] || productImages[0];

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Image Gallery */}
        <div>
          <div className="w-full max-w-2xl mx-auto px-4 py-8">
            {/* Main Image */}
            <div className="w-full rounded-2xl mb-4 aspect-square flex items-center justify-center">
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://via.placeholder.com/600x600?text=No+Image";
                }}
              />
            </div>

            {/* Additional Images Grid */}
            {productImages.length > 1 && (
              <div className="grid grid-cols-2 gap-4">
                {productImages.slice(1).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index + 1)}
                    className={`aspect-square overflow-hidden flex items-center justify-center transition-all hover:scale-105 ${
                      selectedImageIndex === index + 1
                        ? "ring-4 ring-gray-900 ring-offset-1"
                        : "hover:ring-2 hover:ring-gray-400"
                    } bg-linear-to-br ${getGradientClass(index)}`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 2}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/300x300?text=No+Image";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Product Details */}
        <div>
          <div className="max-w-2xl mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
              <a href="/" className="hover:text-gray-900">
                Home
              </a>
              <span>/</span>
              <span className="text-gray-900">{product.name}</span>
            </div>

            {/* SKU */}
            <p className="text-gray-600 mb-4">
              <span className="font-semibold">Sku:</span>{" "}
              {product._id.slice(-6).toUpperCase()}
            </p>

            {/* Product Title */}
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <p className="text-4xl font-bold text-gray-900 mb-6">
              ${product.price.toFixed(2)}
            </p>

            {/* Vendor/Brand */}
            <p className="text-gray-700 mb-4">
              <span className="font-semibold">Vendor:</span> {product.brand}
            </p>

            {/* Stock Indicator */}
            {product.stock > 0 ? (
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Only {product.stock} items in stock!
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#0ba350] h-2 rounded-full transition-all"
                    style={{ width: `${getStockPercentage()}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="mb-6">
                <p className="text-sm font-medium text-red-600 mb-2">
                  Out of Stock
                </p>
              </div>
            )}

            {/* Color Selection - if colors array exists and has items */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Color
                </label>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((colorName, index) => {
                    const hexCode = getHexCodeForColor(colorName);
                    const isSelected = selectedColor === colorName;

                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedColor(colorName)}
                        className={`relative group px-4 py-2 rounded-full border-2 transition-all min-w-20 text-center ${
                          isSelected
                            ? "border-gray-900 ring-2 ring-offset-1 ring-gray-900"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                        style={{
                          backgroundColor: hexCode,
                          color: "#FFFFFF", // Always white text for simplicity
                        }}
                        title={`${colorName} (${hexCode})`}
                      >
                        <span className="font-medium text-sm">{colorName}</span>

                        {/* Color tooltip on hover */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                          <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                            {hexCode}
                          </div>
                          <div className="w-2 h-2 bg-gray-900 transform rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size Selection - if sizes array exists and has items */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Size
                </label>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all min-w-12 text-center ${
                        selectedSize === size
                          ? "border-gray-900 bg-gray-900 text-white"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Weight (if available) */}
            {product.weight && (
              <div className="mb-8">
                <p className="text-sm font-medium text-gray-700">
                  Weight:{" "}
                  <span className="text-gray-900">{product.weight} g</span>
                </p>
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-gray-300 rounded-lg">
                  <button
                    onClick={handleQuantityDecrease}
                    disabled={quantity <= 1}
                    className="p-4 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="w-16 text-center font-semibold focus:outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    min="1"
                    max={product.stock}
                  />
                  <button
                    onClick={handleQuantityIncrease}
                    disabled={quantity >= product.stock}
                    className="p-4 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                <button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0 || isAddingToCart}
                  className="flex-1 flex items-center justify-center gap-2 border-2 border-gray-900 text-gray-900 py-4 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAddingToCart ? (
                    <>
                      <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                      <span>Adding...</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      {product.stock > 0 ? "Add To Cart" : "Out of Stock"}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Buy It Now */}
            {product.stock > 0 && (
              <button
                onClick={handleBuyNow}
                className="w-full bg-[#0ba350] text-white py-4 rounded-lg font-semibold hover:bg-green-600 transition-colors mb-8 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isAddingToCart}
              >
                {isAddingToCart ? "Processing..." : "Buy it now"}
              </button>
            )}

            {/* Accordion Sections */}
            <div className="space-y-4 mb-8">
              {/* Description */}
              <div className="border-2 border-[#0ba350] rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection("description")}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded border-2 border-gray-400 flex items-center justify-center">
                      {openSection === "description" && (
                        <div className="w-3 h-3 bg-gray-900 rounded-sm" />
                      )}
                    </div>
                    <span className="font-bold text-lg">Description</span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${
                      openSection === "description" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openSection === "description" && (
                  <div className="p-4 pt-0 text-gray-700">
                    <p>
                      {product.description ||
                        "This is the product description. Add detailed information about the product here."}
                    </p>
                  </div>
                )}
              </div>

              {/* Reviews */}
              <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection("reviews")}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Heart className="w-6 h-6" />
                    <span className="font-bold text-lg">Reviews</span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${
                      openSection === "reviews" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openSection === "reviews" && (
                  <div className="p-4 pt-0 text-gray-700">
                    <p>Customer reviews will appear here.</p>
                  </div>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection("terms")}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 flex items-center justify-center">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                    <span className="font-bold text-lg">
                      Terms and conditions
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${
                      openSection === "terms" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openSection === "terms" && (
                  <div className="p-4 pt-0 text-gray-700">
                    <p>Terms and conditions content goes here.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Ask a Question */}
            <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-8">
              <div className="w-6 h-6 rounded-full border-2 border-gray-400 flex items-center justify-center">
                <span className="text-sm">?</span>
              </div>
              <span className="font-medium">Ask a question</span>
            </button>

            {/* Social Share */}
            <div className="flex items-center gap-6 pt-6 border-t border-gray-200">
              <button className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Facebook</span>
              </button>

              <button className="flex items-center gap-2 text-gray-700 hover:text-blue-400 transition-colors">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
                <span>Twitter</span>
              </button>

              <button className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                </svg>
                <span>Pin it</span>
              </button>

              <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors">
                <Share2 className="w-6 h-6" />
                <span>Share more</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
