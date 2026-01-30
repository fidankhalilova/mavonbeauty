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
  MessageSquare,
  Send,
  Edit,
  Trash2,
} from "lucide-react";
import { useCart } from "@/context/CardContext";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";

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

interface Comment {
  _id: string;
  product: string;
  user: {
    _id: string;
    name: string;
    email?: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

interface ReviewStats {
  averageRating: number;
  totalRatings: number;
  ratingDistribution: Array<{
    star: number;
    count: number;
  }>;
}

const API_BASE_URL = "http://localhost:3001/api/v1";

// Star Rating Component
const StarRating = ({
  rating,
  onRatingClick,
  interactive = false,
  size = 20,
  showNumber = false,
}: {
  rating: number;
  onRatingClick?: (rating: number) => void;
  interactive?: boolean;
  size?: number;
  showNumber?: boolean;
}) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (interactive && onRatingClick) {
      stars.push(
        <button
          key={i}
          onClick={() => onRatingClick(i)}
          className={`${i <= rating ? "text-yellow-400" : "text-gray-300"} hover:scale-110 transition-transform`}
          style={{ fontSize: `${size}px` }}
        >
          <FaStar />
        </button>,
      );
    } else {
      const fullStars = Math.floor(rating);
      const hasHalfStar = rating % 1 >= 0.5;

      if (i <= fullStars) {
        stars.push(
          <FaStar
            key={i}
            className="text-yellow-400"
            style={{ fontSize: `${size}px` }}
          />,
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <FaStarHalfAlt
            key={i}
            className="text-yellow-400"
            style={{ fontSize: `${size}px` }}
          />,
        );
      } else {
        stars.push(
          <FaRegStar
            key={i}
            className="text-gray-300"
            style={{ fontSize: `${size}px` }}
          />,
        );
      }
    }
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">{stars}</div>
      {showNumber && (
        <span className="text-sm font-medium text-gray-700">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default function ShopDetailMain() {
  const params = useParams();
  const productId = params?.id as string;
  const router = useRouter();
  const { addToCart, currentUserId } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [openSection, setOpenSection] = useState<string | null>("description");
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [colorsList, setColorsList] = useState<Color[]>([]);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Reviews & Comments state
  const [reviews, setReviews] = useState<Comment[]>([]);
  const [reviewStats, setReviewStats] = useState<ReviewStats>({
    averageRating: 0,
    totalRatings: 0,
    ratingDistribution: [],
  });
  const [userReview, setUserReview] = useState({
    rating: 0,
    comment: "",
    submitting: false,
    id: "",
  });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [userHasReviewed, setUserHasReviewed] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);

  useEffect(() => {
    if (productId) {
      fetchColors();
      fetchProduct();
    }
  }, [productId]);

  useEffect(() => {
    if (productId && openSection === "reviews") {
      fetchReviews();
      checkUserReview();
    }
  }, [productId, currentUserId, openSection]);

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

  const fetchReviews = async () => {
    try {
      setLoadingReviews(true);
      const response = await fetch(
        `${API_BASE_URL}/comments/product/${productId}`,
      );
      const data = await response.json();

      if (data.success) {
        setReviews(data.data || []);
        setReviewStats(
          data.stats || {
            averageRating: 0,
            totalRatings: 0,
            ratingDistribution: [],
          },
        );
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoadingReviews(false);
    }
  };

  const checkUserReview = async () => {
    if (!currentUserId) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/comments?userId=${currentUserId}&productId=${productId}`,
      );
      const data = await response.json();

      if (data.success && data.data.length > 0) {
        const userReviewData = data.data[0];
        setUserHasReviewed(true);
        setUserReview({
          rating: userReviewData.rating,
          comment: userReviewData.comment,
          submitting: false,
          id: userReviewData._id,
        });
      } else {
        setUserHasReviewed(false);
      }
    } catch (error) {
      console.error("Error checking user review:", error);
    }
  };

  const handleRatingClick = (rating: number) => {
    setUserReview((prev) => ({ ...prev, rating }));
  };

  const handleSubmitReview = async () => {
    if (!currentUserId) {
      alert("Please login to submit a review");
      return;
    }

    if (userReview.rating === 0) {
      alert("Please select a rating");
      return;
    }

    if (!userReview.comment.trim()) {
      alert("Please write a comment");
      return;
    }

    setUserReview((prev) => ({ ...prev, submitting: true }));

    try {
      const token = localStorage.getItem("accessToken");
      const method = userHasReviewed ? "PUT" : "POST";
      const url = userHasReviewed
        ? `${API_BASE_URL}/comments/${userReview.id}`
        : `${API_BASE_URL}/comments`;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
          rating: userReview.rating,
          comment: userReview.comment,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert(
          userHasReviewed
            ? "Review updated successfully!"
            : "Review submitted successfully!",
        );
        setUserReview({
          rating: 0,
          comment: "",
          submitting: false,
          id: "",
        });
        setShowReviewForm(false);
        setUserHasReviewed(true);
        fetchReviews();
      } else {
        alert(data.message || "Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Error submitting review");
    } finally {
      setUserReview((prev) => ({ ...prev, submitting: false }));
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete your review?")) return;

    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(`${API_BASE_URL}/comments/${reviewId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        alert("Review deleted successfully");
        setUserHasReviewed(false);
        setUserReview({
          rating: 0,
          comment: "",
          submitting: false,
          id: "",
        });
        fetchReviews();
      } else {
        alert(data.message || "Failed to delete review");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Error deleting review");
    }
  };

  const handleEditReview = (review: Comment) => {
    setUserReview({
      rating: review.rating,
      comment: review.comment,
      submitting: false,
      id: review._id,
    });
    setShowReviewForm(true);
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

  const getlinearClass = (index: number): string => {
    const linears = [
      "from-pink-50 to-orange-50",
      "from-green-50 to-emerald-50",
      "from-cyan-50 to-blue-50",
      "from-purple-50 to-pink-50",
      "from-pink-100 to-rose-50",
      "from-yellow-50 to-orange-50",
    ];
    return linears[index % linears.length];
  };

  const getStockPercentage = () => {
    if (!product) return 0;
    const maxStock = 100;
    return Math.min((product.stock / maxStock) * 100, 100);
  };

  const getHexCodeForColor = (colorName: string): string => {
    const colorObj = colorsList.find((c) => c.name === colorName);
    return colorObj ? colorObj.hexCode : "#CCCCCC";
  };

  const handleAddToCart = async () => {
    if (!product) return;

    setIsAddingToCart(true);

    try {
      const colorHex = getHexCodeForColor(selectedColor);

      const cartItem = {
        id: product._id,
        name: product.name,
        price: product.price,
        originalPrice: product.price,
        image: product.images?.[0]
          ? `${API_BASE_URL.replace("/api/v1", "")}${product.images[0]}`
          : "https://via.placeholder.com/600x600?text=No+Image",
        selectedColor: {
          name: selectedColor,
          hex: colorHex,
        },
        selectedWeight: selectedSize,
        quantity: quantity,
        description:
          product.description || `${product.name} - ${product.brand}`,
        color: selectedColor,
        weight: product.weight,
        deliveryMethod: "Standard",
        model: product.name,
        hsCode: "330499",
        addedAt: new Date().toISOString(),
      };

      await addToCart(cartItem);
    } catch (error: any) {
      console.error("❌ Error in handleAddToCart:", error);
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

  const handleBuyNow = async () => {
    if (!product) return;

    try {
      await handleAddToCart();
      const token = localStorage.getItem("accessToken");
      const user = localStorage.getItem("user");

      if (token && user) {
        router.push("/basket");
      }
    } catch (error) {
      console.error("❌ Error in Buy Now:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
                    } bg-linear-to-br ${getlinearClass(index)}`}
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

            {/* Color Selection */}
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
                          color: "#FFFFFF",
                        }}
                        title={`${colorName} (${hexCode})`}
                      >
                        <span className="font-medium text-sm">{colorName}</span>

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

            {/* Size Selection */}
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

            {/* Weight */}
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
                    {reviewStats.totalRatings > 0 && (
                      <span className="bg-emerald-100 text-emerald-700 text-sm font-medium px-2 py-1 rounded-full">
                        {reviewStats.totalRatings}
                      </span>
                    )}
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${
                      openSection === "reviews" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openSection === "reviews" && (
                  <div className="p-4 pt-0">
                    {/* Rating Summary */}
                    <div className="mb-8 p-6 bg-linear-to-r from-emerald-50 to-blue-50 rounded-xl border border-emerald-100">
                      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                        <div className="text-center">
                          <div className="text-5xl font-bold text-emerald-700 mb-2">
                            {reviewStats.averageRating.toFixed(1)}
                          </div>
                          <StarRating
                            rating={reviewStats.averageRating}
                            size={24}
                          />
                          <p className="text-gray-600 mt-2">
                            {reviewStats.totalRatings}{" "}
                            {reviewStats.totalRatings === 1
                              ? "review"
                              : "reviews"}
                          </p>
                        </div>

                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 mb-3">
                            Rating Distribution
                          </h4>
                          <div className="space-y-2">
                            {[5, 4, 3, 2, 1].map((star) => {
                              const starCount =
                                reviewStats.ratingDistribution.find(
                                  (r) => r.star === star,
                                )?.count || 0;
                              const percentage =
                                reviewStats.totalRatings > 0
                                  ? (starCount / reviewStats.totalRatings) * 100
                                  : 0;

                              return (
                                <div
                                  key={star}
                                  className="flex items-center gap-3"
                                >
                                  <span className="text-sm font-medium text-gray-600 w-8">
                                    {star} star
                                  </span>
                                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-yellow-400 rounded-full"
                                      style={{ width: `${percentage}%` }}
                                    />
                                  </div>
                                  <span className="text-sm text-gray-500 w-12 text-right">
                                    {starCount} ({percentage.toFixed(0)}%)
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Add Review Button */}
                    <div className="mb-8">
                      {currentUserId ? (
                        userHasReviewed ? (
                          <div className="p-6 bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div>
                                <h4 className="font-semibold text-gray-800 mb-2">
                                  Your Review
                                </h4>
                                <StarRating
                                  rating={userReview.rating}
                                  size={20}
                                />
                                <p className="text-gray-700 mt-2">
                                  {userReview.comment}
                                </p>
                                <p className="text-sm text-gray-500 mt-2">
                                  {formatDate(
                                    userReview.id
                                      ? reviews.find(
                                          (r) => r._id === userReview.id,
                                        )?.createdAt || new Date().toISOString()
                                      : new Date().toISOString(),
                                  )}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() =>
                                    setShowReviewForm(!showReviewForm)
                                  }
                                  className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors flex items-center gap-2"
                                >
                                  <Edit className="w-4 h-4" />
                                  Edit Review
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteReview(userReview.id)
                                  }
                                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setShowReviewForm(!showReviewForm)}
                            className="w-full py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                          >
                            <MessageSquare className="w-5 h-5" />
                            {showReviewForm
                              ? "Cancel Review"
                              : "Write a Review"}
                          </button>
                        )
                      ) : (
                        <div className="text-center p-6 bg-linear-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                          <p className="text-gray-700 mb-3">
                            Please login to write a review
                          </p>
                          <a
                            href="/login"
                            className="inline-block px-6 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                          >
                            Login Now
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Review Form */}
                    {showReviewForm && (
                      <div className="mb-8 p-6 bg-linear-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
                        <h4 className="font-semibold text-gray-800 mb-4">
                          {userHasReviewed
                            ? "Edit Your Review"
                            : "Write Your Review"}
                        </h4>

                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Your Rating
                          </label>
                          <div className="flex gap-1">
                            <StarRating
                              rating={userReview.rating}
                              onRatingClick={handleRatingClick}
                              interactive={true}
                              size={32}
                            />
                          </div>
                          <p className="text-sm text-gray-500 mt-2">
                            Selected: {userReview.rating} out of 5 stars
                          </p>
                        </div>

                        <div className="mb-6">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Your Comment
                          </label>
                          <textarea
                            value={userReview.comment}
                            onChange={(e) =>
                              setUserReview((prev) => ({
                                ...prev,
                                comment: e.target.value,
                              }))
                            }
                            placeholder="Share your experience with this product..."
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                            maxLength={500}
                          />
                          <p className="text-sm text-gray-500 mt-1 text-right">
                            {userReview.comment.length}/500 characters
                          </p>
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={() => {
                              setShowReviewForm(false);
                              if (!userHasReviewed) {
                                setUserReview({
                                  rating: 0,
                                  comment: "",
                                  submitting: false,
                                  id: "",
                                });
                              }
                            }}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSubmitReview}
                            disabled={
                              userReview.submitting ||
                              userReview.rating === 0 ||
                              !userReview.comment.trim()
                            }
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {userReview.submitting ? (
                              <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Submitting...
                              </>
                            ) : (
                              <>
                                <Send className="w-5 h-5" />
                                {userHasReviewed
                                  ? "Update Review"
                                  : "Submit Review"}
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Reviews List */}
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-4">
                        Customer Reviews ({reviews.length})
                      </h4>

                      {loadingReviews ? (
                        <div className="text-center py-12">
                          <div className="inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                          <p className="mt-4 text-gray-600">
                            Loading reviews...
                          </p>
                        </div>
                      ) : reviews.length === 0 ? (
                        <div className="text-center py-12">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MessageSquare className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="text-gray-500">
                            No reviews yet. Be the first to review this product!
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {reviews.map((review) => (
                            <div
                              key={review._id}
                              className="p-6 bg-white rounded-xl border border-gray-200"
                            >
                              <div className="flex items-start justify-between mb-4">
                                <div>
                                  <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 bg-linear-to-r from-emerald-400 to-teal-400 rounded-full flex items-center justify-center text-white font-semibold">
                                      {review.user?.name?.charAt(0) || "U"}
                                    </div>
                                    <div>
                                      <p className="font-semibold text-gray-800">
                                        {review.user?.name || "Anonymous"}
                                      </p>
                                      <p className="text-sm text-gray-500">
                                        {formatDate(review.createdAt)}
                                      </p>
                                    </div>
                                  </div>
                                  <StarRating
                                    rating={review.rating}
                                    size={18}
                                    showNumber={true}
                                  />
                                </div>

                                {currentUserId === review.user?._id && (
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handleEditReview(review)}
                                      className="p-2 text-gray-400 hover:text-emerald-500 transition-colors"
                                      title="Edit your review"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleDeleteReview(review._id)
                                      }
                                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                      title="Delete your review"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                )}
                              </div>

                              <p className="text-gray-700 leading-relaxed">
                                {review.comment}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
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
