// service/authService.ts - COMPLETE UPDATED VERSION
const API_URL = "http://localhost:3001/api/v1/auth";
import { emitAuthEvent } from "@/utils/events";

interface RegisterData {
  name: string;
  surname?: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  _id: string;
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  accessToken?: string;
  refreshToken?: string;
  user?: User;
}

// Clear user-specific cart
export const clearUserCart = (userId?: string): void => {
  if (!userId) {
    // Get userId from localStorage if not provided
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        userId = userData.id || userData._id;
      } catch {
        console.error("❌ Error parsing user data");
      }
    }
  }

  if (userId) {
    const cartKey = `mavon_cart_${userId}`;
    localStorage.removeItem(cartKey);
    console.log(`🧹 Cleared cart for user: ${userId}`);

    // Notify cart context
    emitAuthEvent("cart-updated", { userId, action: "cleared" });
  } else {
    console.log("ℹ️ No user ID found to clear cart");
  }
};

// Login user and handle cart
export const loginUser = async (data: LoginData): Promise<AuthResponse> => {
  try {
    console.log("🔵 LOGIN: Starting request...");

    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    });

    console.log("✅ LOGIN: Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ LOGIN Error:", errorText);
      return {
        success: false,
        message: "Login failed. Please check your credentials.",
      };
    }

    const result = await response.json();
    console.log("📄 LOGIN: API Response:", result);

    if (result.success) {
      const userId = result.user?.id || result.user?._id || "";

      // Store tokens in localStorage
      if (result.accessToken) {
        localStorage.setItem("accessToken", result.accessToken);
        console.log("💾 Access token stored in localStorage");
      }

      if (result.refreshToken) {
        localStorage.setItem("refreshToken", result.refreshToken);
        console.log("💾 Refresh token stored in localStorage");
      }

      // Store in sessionStorage too
      if (result.accessToken) {
        sessionStorage.setItem("accessToken", result.accessToken);
      }

      if (result.refreshToken) {
        sessionStorage.setItem("refreshToken", result.refreshToken);
      }

      // Store user data
      if (result.user) {
        // Ensure user has both id and _id for compatibility
        const userData: User = {
          ...result.user,
          id: userId,
          _id: userId,
        };

        const userString = JSON.stringify(userData);
        localStorage.setItem("user", userString);
        sessionStorage.setItem("user", userString);

        // Store role separately
        if (result.user.role) {
          localStorage.setItem("userRole", result.user.role);
          sessionStorage.setItem("userRole", result.user.role);
        }

        console.log(`👤 User data stored for ID: ${userId}`);

        // Load user's cart from localStorage
        const cartKey = `mavon_cart_${userId}`;
        const savedCart = localStorage.getItem(cartKey);
        if (savedCart) {
          console.log(`🛒 Loaded existing cart for user ${userId}`);
        } else {
          console.log(
            `🛒 No existing cart found for user ${userId}, starting fresh`,
          );
        }
      }

      // Trigger user change event for cart context
      emitAuthEvent("user-changed", { userId, action: "login" });
      emitAuthEvent("user-login", result.user);

      return {
        success: true,
        message: result.message || "Login successful",
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        user: result.user,
      };
    } else {
      return {
        success: false,
        message: result.message || "Login failed",
      };
    }
  } catch (error: any) {
    console.error("💥 LOGIN: Network error:", error);
    return {
      success: false,
      message: "Network error. Please check your connection.",
    };
  }
};

// Register user and set up new cart
export const registerUser = async (
  data: RegisterData,
): Promise<AuthResponse> => {
  try {
    const payload = {
      name: `${data.name} ${data.surname || ""}`.trim(),
      email: data.email,
      password: data.password,
    };

    console.log("🔵 REGISTER: Starting registration request...");

    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log(
      "✅ REGISTER: Response received:",
      response.status,
      response.statusText,
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ REGISTER Error:", errorText);

      let errorMessage = `Registration failed: ${response.status}`;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorMessage;
      } catch (e) {
        errorMessage = errorText || errorMessage;
      }

      return {
        success: false,
        message: errorMessage,
      };
    }

    const result = await response.json();
    console.log("📄 REGISTER: Parsed result:", result);

    if (result.success && result.user) {
      const userId = result.user.id || result.user._id || "";

      // Store tokens and user data
      if (result.accessToken) {
        localStorage.setItem("accessToken", result.accessToken);
        console.log("💾 Access token stored in localStorage");
      }

      if (result.refreshToken) {
        localStorage.setItem("refreshToken", result.refreshToken);
        console.log("💾 Refresh token stored in localStorage");
      }

      // Ensure user has both id and _id
      const userData: User = {
        ...result.user,
        id: userId,
        _id: userId,
      };

      const userString = JSON.stringify(userData);
      localStorage.setItem("user", userString);
      sessionStorage.setItem("user", userString);

      if (result.user.role) {
        localStorage.setItem("userRole", result.user.role);
        sessionStorage.setItem("userRole", result.user.role);
      }

      console.log(`👤 New user registered with ID: ${userId}`);

      // Initialize empty cart for new user
      const cartKey = `mavon_cart_${userId}`;
      localStorage.setItem(cartKey, JSON.stringify([]));
      console.log(`🛒 Created new empty cart for user ${userId}`);

      // Trigger user change event for cart context
      emitAuthEvent("user-changed", { userId, action: "register" });
      emitAuthEvent("user-login", result.user);

      return {
        success: true,
        message: result.message || "Registration successful",
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        user: result.user,
      };
    } else {
      return {
        success: false,
        message: result.message || "Registration failed",
      };
    }
  } catch (error: any) {
    console.error("💥 REGISTER: Network error:", error);

    let errorMessage = "Network error. Please try again.";
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      errorMessage =
        "Cannot connect to server. Please ensure the backend is running on http://localhost:3001";
    } else if (error.message) {
      errorMessage = error.message;
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
};

// Helper to check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem("accessToken");
  const user = localStorage.getItem("user");

  if (!token || !user) return false;

  try {
    const userData = JSON.parse(user);
    // Check if token exists and user data is valid
    return !!(token && userData && (userData.id || userData._id));
  } catch {
    return false;
  }
};

// Helper to get current user
export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;

  try {
    const userData = JSON.parse(userStr);
    const userId = userData.id || userData._id || "";

    if (!userId) return null;

    return {
      ...userData,
      id: userId,
      _id: userId,
    };
  } catch (error) {
    console.error("❌ Error parsing user data:", error);
    return null;
  }
};

// Helper to get current user ID
export const getCurrentUserId = (): string | null => {
  const user = getCurrentUser();
  return user ? user.id : null;
};

// Helper to get access token
export const getAccessToken = (): string | null => {
  return localStorage.getItem("accessToken");
};

// Helper to get refresh token
export const getRefreshToken = (): string | null => {
  return localStorage.getItem("refreshToken");
};

// Helper to logout and clear cart
export const logoutUser = (): void => {
  // Clear user-specific cart before clearing tokens
  const userStr = localStorage.getItem("user");
  let userId: string | null = null;

  if (userStr) {
    try {
      const userData = JSON.parse(userStr);
      userId = userData.id || userData._id;
    } catch {
      console.error("❌ Error parsing user data on logout");
    }
  }

  // Clear cart if user exists
  if (userId) {
    clearUserCart(userId);
  }

  // Clear all auth tokens and user data
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  localStorage.removeItem("userRole");

  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("refreshToken");
  sessionStorage.removeItem("user");
  sessionStorage.removeItem("userRole");

  // Trigger user change event for cart context
  emitAuthEvent("user-changed", { userId, action: "logout" });
  emitAuthEvent("user-logout");

  console.log("🗑️ All tokens, user data, and cart cleared");
};

// Check auth status with server
export const checkAuth = async (): Promise<boolean> => {
  try {
    const token = getAccessToken();
    if (!token) return false;

    const response = await fetch(`${API_URL}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.user) {
        // Update user data
        const userId = data.user.id || data.user._id || "";
        const userData: User = {
          ...data.user,
          id: userId,
          _id: userId,
        };

        localStorage.setItem("user", JSON.stringify(userData));
        console.log(`✅ Auth check passed for user: ${userId}`);

        // Trigger cart reload
        emitAuthEvent("user-changed", { userId, action: "auth-check" });

        return true;
      }
    }

    // If auth fails, clear invalid tokens
    console.log("❌ Auth check failed, clearing tokens");
    logoutUser();
    return false;
  } catch (error) {
    console.error("❌ Auth check error:", error);
    return false;
  }
};

// Refresh access token
export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      console.log("❌ No refresh token available");
      return null;
    }

    const response = await fetch(`${API_URL}/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        console.log("✅ Access token refreshed");
        return data.accessToken;
      }
    }

    console.log("❌ Token refresh failed");
    return null;
  } catch (error) {
    console.error("❌ Token refresh error:", error);
    return null;
  }
};

// Get user cart from localStorage
export const getUserCart = (userId?: string): any[] => {
  if (!userId) {
    userId = getCurrentUserId() ?? undefined;
  }

  if (!userId) {
    console.log("❌ No user ID available to get cart");
    return [];
  }

  const cartKey = `mavon_cart_${userId}`;
  const savedCart = localStorage.getItem(cartKey);

  if (savedCart) {
    try {
      return JSON.parse(savedCart);
    } catch (error) {
      console.error("❌ Error parsing user cart:", error);
      return [];
    }
  }

  return [];
};

// Save user cart to localStorage
export const saveUserCart = (cartItems: any[], userId?: string): boolean => {
  if (!userId) {
    userId = getCurrentUserId() || undefined;
  }

  if (!userId) {
    console.log("❌ No user ID available to save cart");
    return false;
  }

  try {
    const cartKey = `mavon_cart_${userId}`;
    localStorage.setItem(cartKey, JSON.stringify(cartItems));
    console.log(
      `💾 Saved ${cartItems.length} items to cart for user ${userId}`,
    );

    // Trigger cart updated event
    emitAuthEvent("cart-updated", { userId, items: cartItems });

    return true;
  } catch (error) {
    console.error("❌ Error saving user cart:", error);
    return false;
  }
};

// Switch user account (for admin or account switching)
export const switchUserAccount = async (userId: string): Promise<boolean> => {
  try {
    // First, save current user's cart if logged in
    const currentUserId = getCurrentUserId();
    if (currentUserId) {
      console.log(`🔄 Switching from user ${currentUserId} to ${userId}`);
    }

    // Clear current session
    logoutUser();

    // Load new user data (this would typically come from an API)
    // For now, we'll just set a flag that cart should be loaded
    console.log(`🔄 Ready to load cart for user ${userId}`);

    // Trigger user change for cart context
    emitAuthEvent("user-changed", { userId, action: "switch" });

    return true;
  } catch (error) {
    console.error("❌ Error switching user account:", error);
    return false;
  }
};

// Notify cart context that user has changed
export const notifyUserChanged = (): void => {
  const userId = getCurrentUserId();
  emitAuthEvent("user-changed", { userId });
};
