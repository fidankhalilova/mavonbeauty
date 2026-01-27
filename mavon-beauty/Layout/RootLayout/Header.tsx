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

export default function Navbar() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const menuRef = useRef<HTMLDivElement>(null);
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

        // 1. Check for GitHub OAuth callback
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get("accessToken");
        const refreshToken = urlParams.get("refreshToken");
        const userStr = urlParams.get("user");
        const source = urlParams.get("source");

        if (accessToken && refreshToken && userStr && source === "github") {
          console.log("✅ GitHub OAuth tokens detected");
          try {
            const userData: UserData = JSON.parse(decodeURIComponent(userStr));

            // Save tokens
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("user", JSON.stringify(userData));

            setUser(userData);
            setAuthenticated(true);
            setIsLoading(false);

            // Clean URL
            window.history.replaceState({}, "", "/");
            console.log("✅ GitHub login successful");

            // Notify cart context
            notifyUserChanged();

            return;
          } catch (error) {
            console.error("❌ Error processing GitHub tokens:", error);
          }
        }

        // 2. Get token from localStorage
        const token = localStorage.getItem("accessToken");

        if (!token) {
          console.log("ℹ️ No token found - user not logged in");
          setAuthenticated(false);
          setUser(null);
          setIsLoading(false);
          return;
        }

        console.log("🔑 Token found, fetching user data...");
        console.log("Token preview:", token.substring(0, 30) + "...");

        // 3. Fetch user data from API
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
          console.error("❌ Response error:", errorText);

          // Clear invalid token
          if (response.status === 401) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
            setAuthenticated(false);
            setUser(null);
          }

          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        console.log("✅ User data received:", data);

        if (data.success && data.user) {
          setUser(data.user);
          setAuthenticated(true);
          localStorage.setItem("user", JSON.stringify(data.user));
          console.log("✅ User authenticated:", data.user.email);

          // Notify cart context
          notifyUserChanged();
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error: any) {
        console.error("❌ Auth initialization error:", error);

        // Don't clear tokens on network errors
        if (!error.message?.includes("Failed to fetch")) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
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

  const handleLogout = (): void => {
    // Clear user-specific cart before logging out
    console.log("🧹 Clearing cart for user on logout");
    clearUserCart();

    // Clear auth tokens and trigger events
    logoutUser();

    // Clear local state
    setAuthenticated(false);
    setUser(null);
    setIsUserMenuOpen(false);

    // Redirect to home
    window.location.href = "/";
  };

  const goToAdmin = (): void => {
    router.push("/admin");
    setIsUserMenuOpen(false);
  };

  const handleCartClick = (): void => {
    redirectToCart();
  };

  // Display current user info in cart badge
  const displayCartCount = (): string => {
    const count = getCartItemCount();
    if (authenticated && currentUserId) {
      return `${count} (User ${currentUserId.slice(-4)})`;
    }
    return count.toString();
  };

  // Loading state
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
          {/* Logo */}
          <div className="shrink-0">
            <Link href="/">
              <img
                src="https://mavon-beauty.myshopify.com/cdn/shop/files/mavon_140x.png?v=1691552606"
                alt="mavon"
                className="h-6"
              />
            </Link>
          </div>

          {/* Navigation Links */}
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

          {/* Right Side Icons */}
          <div className="flex items-center">
            {/* Search */}
            <button className="text-black hover:text-gray-900 px-4">
              <Search className="h-5.5 w-5.5" />
            </button>

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

            <div className="h-6 w-px bg-black"></div>

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
    </nav>
  );
}
