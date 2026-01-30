"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { subscribeToAuthEvent, emitAuthEvent } from "@/utils/events";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  discountedPrice?: number;
  originalPrice?: number;
  image: string;
  selectedColor?: any;
  selectedSize?: any;
  selectedWeight?: string;
  quantity: number;
  addedAt?: string;
  model?: string;
  hsCode?: string;
  weight?: number;
  color?: string;
  deliveryMethod?: string;
  description?: string;
}

export interface CartContextType {
  cartItems: CartItem[];
  isCartOpen: boolean;
  currentUserId: string | null;
  setIsCartOpen: (isOpen: boolean) => void;
  addToCart: (product: CartItem) => Promise<void>;
  removeFromCart: (itemId: string, color?: any, weight?: string) => void;
  updateQuantity: (
    itemId: string,
    color: any,
    weight: string,
    newQuantity: number,
  ) => void;
  clearCart: () => void;
  clearUserCart: () => void;
  getCartItemCount: () => number;
  getSubtotal: () => number;
  getCheckoutData: () => any;
  redirectToCart: () => void;
  loadUserCart: (userId: string) => void;
  saveCartToStorage: () => void;
  // Add new method
  forceReloadCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [cartVersion, setCartVersion] = useState<number>(0);

  // Get current user ID from localStorage
  const getCurrentUserId = useCallback((): string | null => {
    if (typeof window === "undefined") return null;

    const userStr = localStorage.getItem("user");
    if (!userStr) return null;

    try {
      const userData = JSON.parse(userStr);
      return userData.id || userData._id || null;
    } catch {
      return null;
    }
  }, []);

  // Generate cart key for user
  const getCartKey = useCallback((userId: string): string => {
    return `mavon_cart_${userId}`;
  }, []);

  // Load cart for current user
  const loadCurrentUserCart = useCallback(() => {
    const userId = getCurrentUserId();
    console.log(`🔄 CartProvider: Loading cart for user:`, userId);

    setCurrentUserId(userId);

    if (userId) {
      const cartKey = getCartKey(userId);
      const savedCart = localStorage.getItem(cartKey);

      if (savedCart) {
        try {
          const parsedCart: CartItem[] = JSON.parse(savedCart);
          setCartItems(parsedCart);
          console.log(
            `✅ Cart loaded: ${parsedCart.length} items for user ${userId}`,
          );
        } catch (error) {
          console.error("❌ Error loading cart:", error);
          setCartItems([]);
        }
      } else {
        console.log(
          `ℹ️ No saved cart found for user ${userId}, starting fresh`,
        );
        setCartItems([]);
      }
    } else {
      console.log("ℹ️ No user logged in, cart is empty");
      setCartItems([]);
    }

    setIsInitialized(true);
    setCartVersion((v) => v + 1); // Force re-render
  }, [getCurrentUserId, getCartKey]);

  // Force reload cart (for manual refresh)
  const forceReloadCart = useCallback(() => {
    loadCurrentUserCart();
  }, [loadCurrentUserCart]);

  // Calculate total items in cart
  const getCartItemCount = useCallback((): number => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  // Save cart to user-specific localStorage
  const saveCartToStorage = useCallback(() => {
    if (isInitialized && currentUserId && cartItems.length >= 0) {
      const cartKey = getCartKey(currentUserId);
      localStorage.setItem(cartKey, JSON.stringify(cartItems));
      console.log(
        `💾 Saved ${cartItems.length} items to cart for user ${currentUserId}`,
      );

      // Notify other tabs/components
      emitAuthEvent("cart-updated", {
        userId: currentUserId,
        items: cartItems,
        count: getCartItemCount(),
        version: cartVersion,
      });
    }
  }, [
    cartItems,
    currentUserId,
    isInitialized,
    getCartKey,
    getCartItemCount,
    cartVersion,
  ]);

  // Initial load
  useEffect(() => {
    loadCurrentUserCart();
  }, [loadCurrentUserCart]);

  // Listen for user change events
  useEffect(() => {
    const unsubscribe = subscribeToAuthEvent("user-changed", (data) => {
      console.log("🔔 User changed event received:", data);
      // Small delay to ensure localStorage is updated
      setTimeout(() => {
        loadCurrentUserCart();
      }, 100);
    });

    return () => unsubscribe();
  }, [loadCurrentUserCart]);

  // Listen for cart update events from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (
        e.key?.startsWith("mavon_cart_") &&
        currentUserId &&
        e.key === getCartKey(currentUserId)
      ) {
        console.log("🔔 Storage cart change detected, reloading...");
        loadCurrentUserCart();
      }
      // Also check if user changed
      if (e.key === "user" || e.key === "accessToken") {
        console.log("🔔 User auth change detected, reloading cart...");
        setTimeout(() => loadCurrentUserCart(), 100);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [currentUserId, loadCurrentUserCart, getCartKey]);

  // Save cart when it changes
  useEffect(() => {
    if (isInitialized && currentUserId) {
      saveCartToStorage();
    }
  }, [cartItems, isInitialized, currentUserId, saveCartToStorage]);

  // Load cart for specific user (for switching accounts)
  const loadUserCart = useCallback(
    (userId: string): void => {
      console.log(`🔄 Switching to cart for user: ${userId}`);
      setCurrentUserId(userId);
      const cartKey = getCartKey(userId);
      const savedCart = localStorage.getItem(cartKey);

      if (savedCart) {
        try {
          const parsedCart: CartItem[] = JSON.parse(savedCart);
          setCartItems(parsedCart);
          console.log(
            `✅ Loaded ${parsedCart.length} items for user ${userId}`,
          );
        } catch (error) {
          console.error("❌ Error loading user cart:", error);
          setCartItems([]);
        }
      } else {
        console.log(`ℹ️ No cart found for user ${userId}`);
        setCartItems([]);
      }
    },
    [getCartKey],
  );

  // Clear cart for current user
  const clearUserCart = useCallback((): void => {
    if (currentUserId) {
      const cartKey = getCartKey(currentUserId);
      localStorage.removeItem(cartKey);
      console.log(`🧹 Cleared cart for user ${currentUserId}`);

      // Notify other tabs
      emitAuthEvent("cart-updated", {
        userId: currentUserId,
        items: [],
        action: "cleared",
      });
    }
    setCartItems([]);
  }, [currentUserId, getCartKey]);

  // Calculate subtotal
  const getSubtotal = useCallback((): number => {
    return cartItems.reduce((total, item) => {
      const price = item.discountedPrice || item.price;
      return total + price * item.quantity;
    }, 0);
  }, [cartItems]);

  // Check if user is authenticated
  const isAuthenticated = useCallback((): boolean => {
    const token = localStorage.getItem("accessToken");
    const user = localStorage.getItem("user");
    return !!(token && user);
  }, []);

  // Add item to cart with authentication check
  const addToCart = useCallback(
    async (product: CartItem): Promise<void> => {
      // Check authentication
      if (!isAuthenticated()) {
        console.log("🔒 User not authenticated, redirecting to login");
        router.push("/login");
        throw new Error("User not authenticated");
      }

      // Get current user
      const userId = getCurrentUserId();
      if (!userId) {
        console.log("❌ No user ID found");
        router.push("/login");
        throw new Error("No user ID found");
      }

      console.log(`➕ Adding to cart for user ${userId}:`, product.name);

      setCartItems((prevItems) => {
        const existingItemIndex = prevItems.findIndex(
          (item) =>
            item.id === product.id &&
            JSON.stringify(item.selectedColor) ===
              JSON.stringify(product.selectedColor) &&
            item.selectedWeight === product.selectedWeight,
        );

        if (existingItemIndex > -1) {
          const updatedItems = [...prevItems];
          updatedItems[existingItemIndex].quantity += product.quantity;
          return updatedItems;
        } else {
          return [
            ...prevItems,
            {
              ...product,
              addedAt: new Date().toISOString(),
              model: product.model || product.name,
              hsCode: product.hsCode || "330499",
              weight: product.weight || 0.05,
              color:
                product.color ||
                (typeof product.selectedColor === "object"
                  ? product.selectedColor?.name
                  : "Clear"),
              deliveryMethod: product.deliveryMethod || "Standard",
              description:
                product.description ||
                `${product.name} - Premium beauty product`,
            },
          ];
        }
      });
    },
    [isAuthenticated, router, getCurrentUserId],
  );

  // Remove item from cart
  const removeFromCart = useCallback(
    (itemId: string, color?: any, weight?: string): void => {
      console.log(`🗑️ Removing from cart for user ${currentUserId}:`, itemId);
      setCartItems((prevItems) =>
        prevItems.filter(
          (item) =>
            !(
              item.id === itemId &&
              JSON.stringify(item.selectedColor) === JSON.stringify(color) &&
              item.selectedWeight === weight
            ),
        ),
      );
    },
    [currentUserId],
  );

  // Update item quantity - FIXED VERSION
  const updateQuantity = useCallback(
    (itemId: string, color: any, weight: string, newQuantity: number): void => {
      console.log(
        `🔢 Updating quantity for user ${currentUserId}:`,
        itemId,
        "to",
        newQuantity,
      );

      if (newQuantity < 1) {
        removeFromCart(itemId, color, weight);
        return;
      }

      setCartItems((prevItems) => {
        const updatedItems = prevItems.map((item) =>
          item.id === itemId &&
          JSON.stringify(item.selectedColor) === JSON.stringify(color) &&
          item.selectedWeight === weight
            ? { ...item, quantity: newQuantity }
            : item,
        );

        // Save to localStorage immediately after state update
        if (currentUserId) {
          const cartKey = getCartKey(currentUserId);
          localStorage.setItem(cartKey, JSON.stringify(updatedItems));
          console.log(`💾 Immediate save: Updated quantity for ${itemId}`);
        }

        return updatedItems;
      });
    },
    [currentUserId, removeFromCart, getCartKey],
  );

  // Clear entire cart (for current user)
  const clearCart = useCallback((): void => {
    clearUserCart();
  }, [clearUserCart]);

  // Get cart data for checkout
  const getCheckoutData = useCallback(() => {
    return {
      items: cartItems,
      subtotal: getSubtotal(),
      itemCount: getCartItemCount(),
      timestamp: new Date().toISOString(),
      userId: currentUserId,
    };
  }, [cartItems, getSubtotal, getCartItemCount, currentUserId]);

  // Redirect to cart page
  const redirectToCart = useCallback((): void => {
    if (!isAuthenticated()) {
      console.log("🔒 User not authenticated, redirecting to login");
      router.push("/login");
      return;
    }

    console.log(
      `✅ User ${currentUserId} authenticated, redirecting to cart page`,
    );
    router.push("/basket");
  }, [isAuthenticated, router, currentUserId]);

  const value: CartContextType = {
    cartItems,
    isCartOpen,
    currentUserId,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    clearUserCart,
    getCartItemCount,
    getSubtotal,
    getCheckoutData,
    redirectToCart,
    loadUserCart,
    saveCartToStorage,
    forceReloadCart,
  };

  console.log(
    "🎯 CartProvider rendered for user:",
    currentUserId,
    "items:",
    cartItems.length,
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
