"use client";

import {
  Search,
  ShoppingCart,
  User,
  Users,
  ChevronDown,
  LogOut,
  Package,
  UserCircle,
  Shield,
  BarChart,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  getCurrentUser,
  isAuthenticated,
  logoutUser,
  notifyUserChanged,
} from "@/service/authService";
import { setAccessTokenCookie, clearAccessTokenCookie } from "@/utils/cookieUtils";
import { useCart } from "@/context/CardContext";

interface UserData {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  username?: string;
  displayName?: string;
  avatar?: string;
  profileUrl?: string;
}

interface Product {
  _id?: string;
  id?: string;
  documentId?: string;
  name: string;
  price: number;
  images?: string[];
  image?: string | { url: string };
  category?: string;
}

const getProductId = (product: Product): string => {
  return product._id || product.id || product.documentId || '';
};

const getProductImage = (product: Product): string | null => {
  if (product.images && product.images.length > 0) {
    const img = product.images[0];
    if (img.startsWith('http')) return img;
    if (img.startsWith('/')) return `http://localhost:3001${img}`;
    return img;
  }
  if (product.image) {
    if (typeof product.image === 'string') {
      const img = product.image;
      if (img.startsWith('http')) return img;
      if (img.startsWith('/')) return `http://localhost:3001${img}`;
      return img;
    } else if (product.image.url) {
      const img = product.image.url;
      if (img.startsWith('http')) return img;
      if (img.startsWith('/')) return `http://localhost:3001${img}`;
      return img;
    }
  }
  
  return null;
};

export default function Navbar() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const initRef = useRef<boolean>(false);

  const { getCartItemCount, redirectToCart, clearUserCart, currentUserId } =
    useCart();

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const initializeAuth = async (): Promise<void> => {
      try {
        console.log("=== AUTH INITIALIZATION START ===");
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get("accessToken");
        const refreshToken = urlParams.get("refreshToken");
        const userStr = urlParams.get("user");
        const source = urlParams.get("source");

        if (accessToken && refreshToken && userStr && source === "github") {
          console.log("GitHub OAuth tokens detected");
          try {
            const userData: UserData = JSON.parse(decodeURIComponent(userStr));

            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("user", JSON.stringify(userData));
            setAccessTokenCookie(accessToken);

            setUser(userData);
            setAuthenticated(true);
            setIsLoading(false);

            window.history.replaceState({}, "", "/");
            console.log("GitHub login successful");

            notifyUserChanged();

            return;
          } catch (error) {
            console.error(" Error processing GitHub tokens:", error);
          }
        }

        const token = localStorage.getItem("accessToken");

        if (!token) {
          console.log(" No token found - user not logged in");
          setAuthenticated(false);
          setUser(null);
          setIsLoading(false);
          return;
        }

        console.log("Token found, fetching user data...");
        console.log("Token preview:", token.substring(0, 30) + "...");
        const response = await fetch("http://localhost:3001/api/v1/auth/user", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        console.log("📡 Response status:", response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error(" Response error:", errorText);
          if (response.status === 401) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
            clearAccessTokenCookie();
            setAuthenticated(false);
            setUser(null);
          }

          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        console.log("User data received:", data);

        if (data.success && data.user) {
          setUser(data.user);
          setAuthenticated(true);
          localStorage.setItem("user", JSON.stringify(data.user));
          console.log("User authenticated:", data.user.email);
          notifyUserChanged();
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error: any) {
        console.error("Auth initialization error:", error);
        if (!error.message?.includes("Failed to fetch")) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          clearAccessTokenCookie();
          setAuthenticated(false);
          setUser(null);
        }
      } finally {
        setIsLoading(false);
        console.log("=== AUTH INITIALIZATION COMPLETE ===");
      }
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);
  useEffect(() => {
    const searchProducts = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      console.log("Searching for:", searchQuery);
      setIsSearching(true);
      try {
        let response;
        let data;
        console.log("Trying search endpoint...");
        response = await fetch(
          `http://localhost:3001/api/v1/products/search?q=${encodeURIComponent(searchQuery)}`
        );
        
        if (!response.ok) {
          console.log("Trying products endpoint with search param...");
          response = await fetch(
            `http://localhost:3001/api/v1/products?search=${encodeURIComponent(searchQuery)}`
          );
        }
        
        if (!response.ok) {
          console.log("Getting all products and filtering client-side...");
          response = await fetch('http://localhost:3001/api/v1/products');
        }
        
        if (response.ok) {
          data = await response.json();
          console.log("Response data:", data);
          let products = data.products || data.data || [];
          console.log("First product (if exists):", products[0]);
          if (Array.isArray(products) && !response.url.includes('search') && !response.url.includes('?search=')) {
            console.log("Filtering products client-side...");
            products = products.filter((product: Product) =>
              product.name?.toLowerCase().includes(searchQuery.toLowerCase())
            );
            console.log("Filtered products:", products.length);
          }
          
          setSearchResults(products.slice(0, 10)); 
          console.log("Found", products.length, "products");
        } else {
          console.log(" No successful response");
          setSearchResults([]);
        }
      } catch (error) {
        console.error(" Search error:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      if (searchQuery.trim()) {
        searchProducts();
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleLogout = (): void => {
    console.log("Clearing cart for user on logout");
    clearUserCart();
    logoutUser();
    setAuthenticated(false);
    setUser(null);
    setIsUserMenuOpen(false);
    window.location.href = "/";
  };

  const goToAdmin = (): void => {
    router.push("/admin");
    setIsUserMenuOpen(false);
  };

  const handleCartClick = (): void => {
    redirectToCart();
  };

  const handleSearchToggle = (): void => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  const handleProductClick = (productId: string): void => {
    router.push(`/shop/${productId}`);
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };
  const displayCartCount = (): string => {
    const count = getCartItemCount();
    if (authenticated && currentUserId) {
      return `${count} (User ${currentUserId.slice(-4)})`;
    }
    return count.toString();
  };

  if (isLoading) {
    return (
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50 h-19">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            <div className="h-6 w-32 bg-gray-200 animate-pulse rounded"></div>
            <div className="flex items-center">
              <div className="h-5 w-5 bg-gray-200 animate-pulse rounded mr-4"></div>
              <div className="h-5 w-5 bg-gray-200 animate-pulse rounded mr-4"></div>
              <div className="h-5 w-5 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav
      className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50"
      style={{ fontFamily: '"Montserrat", sans-serif' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-19">
          <div className="shrink-0">
            <Link href="/">
              <img
                src="https://mavon-beauty.myshopify.com/cdn/shop/files/mavon_140x.png?v=1691552606"
                alt="mavon"
                className="h-6"
              />
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-black hover:text-gray-600 font-semibold"
            >
              Home
            </Link>
            <div className="relative group">
              <Link
                href="/shop"
                className="text-black flex justify-center items-center hover:text-gray-600 font-semibold"
              >
                Shop
                <ChevronDown className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <Link
              href="/blog"
              className="text-black hover:text-gray-600 font-semibold"
            >
              Blog
            </Link>
            <Link
              href="/about-us"
              className="text-black hover:text-gray-600 font-semibold"
            >
              About Us
            </Link>
            <div className="relative group">
              <Link
                href="/faq"
                className="text-black flex justify-center items-center hover:text-gray-600 font-semibold"
              >
                Faq
                <ChevronDown className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="relative group">
              <Link
                href="/contact-us"
                className="text-black flex justify-center items-center hover:text-gray-600 font-semibold"
              >
                Contact Us
                <ChevronDown className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <div className="relative">
              <button 
                onClick={handleSearchToggle}
                className="text-black hover:text-gray-900 px-4"
              >
                <Search className="h-5.5 w-5.5" />
              </button>
            </div>

            <div className="h-6 w-px bg-black"></div>

            {/* Shopping Cart */}
            <button
              onClick={handleCartClick}
              className="relative text-black hover:text-gray-900 px-4"
            >
              <ShoppingCart className="h-5.5 w-5.5" />
              <span className="absolute bottom-3 right-2 bg-[#0AA360] text-white text-xs rounded-full h-4.5 w-4.5 flex items-center justify-center">
                {getCartItemCount()}
              </span>
            </button>

            <div className="h-6 w-px "></div>

            {/* User Menu */}
            <div className="relative pl-4" ref={menuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="text-black hover:text-gray-900 flex items-center gap-1"
              >
                <User className="h-5.5 w-5.5" />
                {authenticated && user && user.name && (
                  <span className="hidden lg:block text-sm font-medium ml-1">
                    {user.name.split(" ")[0]}
                    {currentUserId && (
                      <span className="text-xs text-gray-500 ml-1">
                        ({currentUserId.slice(-4)})
                      </span>
                    )}
                  </span>
                )}
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2">
                  {authenticated && user ? (
                    <>
                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">
                          {user.name || "User"}
                        </p>
                        {user.email && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            {user.email}
                          </p>
                        )}
                        {currentUserId && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            User ID: {currentUserId.slice(-8)}
                          </p>
                        )}
                      </div>

                      {/* Menu Items */}
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <UserCircle className="h-4 w-4" />
                        My Profile
                      </Link>

                      {user.role === "admin" && (
                        <button
                          onClick={goToAdmin}
                          className="w-full px-4 py-3 text-left hover:bg-emerald-50 flex items-center gap-3 text-emerald-700"
                        >
                          <Shield className="w-4 h-4" />
                          <span>Admin Panel</span>
                        </button>
                      )}

                      {/* Admin Quick Links */}
                      {user.role === "admin" && (
                        <>
                          <div className="px-4 pt-2 pb-1">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Quick Access
                            </p>
                          </div>
                          <Link
                            href="/admin/products"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="px-4 py-2 hover:bg-emerald-50 flex items-center gap-3 text-gray-700"
                          >
                            <Package className="w-4 h-4" />
                            <span>Products</span>
                          </Link>
                          <Link
                            href="/admin/users"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="px-4 py-2 hover:bg-emerald-50 flex items-center gap-3 text-gray-700"
                          >
                            <Users className="w-4 h-4" />
                            <span>Users</span>
                          </Link>
                          <Link
                            href="/admin/analytics"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="px-4 py-2 hover:bg-emerald-50 flex items-center gap-3 text-gray-700"
                          >
                            <BarChart className="w-4 h-4" />
                            <span>Analytics</span>
                          </Link>
                          <div className="border-t border-emerald-50 my-1"></div>
                        </>
                      )}

                      <Link
                        href="/orders"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Package className="h-4 w-4" />
                        My Orders
                      </Link>

                      <div className="border-t border-gray-100 my-1"></div>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Guest Menu */}
                      <Link
                        href="/login"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="h-4 w-4" />
                        Login
                      </Link>

                      <Link
                        href="/register"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <UserCircle className="h-4 w-4" />
                        Register
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black/20 bg-opacity-50 z-50 flex items-start justify-center pt-20">
          <div className="bg-white w-full max-w-3xl mx-4 rounded-lg shadow-2xl">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Məhsul axtar..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#0AA360] focus:outline-none text-lg"
                    autoFocus
                  />
                </div>
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery('');
                    setSearchResults([]);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Bağla"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {isSearching ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0AA360] mx-auto mb-3"></div>
                    <p>Axtarılır...</p>
                  </div>
                ) : searchQuery.trim().length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Search className="w-16 h-16 mx-auto mb-3 opacity-30" />
                    <p>Məhsul axtarmaq üçün yazmağa başlayın</p>
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="w-16 h-16 mx-auto mb-3 text-gray-300" />
                    <p className="font-medium">Məhsul tapılmadı</p>
                    <p className="text-sm mt-1">"{searchQuery}" üçün nəticə yoxdur</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {searchResults.map((product) => {
                      const productId = getProductId(product);
                      const imageUrl = getProductImage(product);
                      return (
                        <button
                          key={productId}
                          onClick={() => handleProductClick(productId)}
                          className="w-full flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                        >
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded"
                              onError={(e) => {
                                console.error("Image load error:", imageUrl);
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                          ) : null}
                          <div className={`w-16 h-16 bg-gray-200 rounded flex items-center justify-center ${imageUrl ? 'hidden' : ''}`}>
                            <Package className="h-8 w-8 text-gray-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 truncate">
                              {product.name}
                            </h3>
                            {product.category && (
                              <p className="text-sm text-gray-500">
                                {product.category}
                              </p>
                            )}
                          </div>
                          <div className="text-lg font-semibold text-[#0AA360]">
                            ${product.price.toFixed(2)}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}