// types/cart.ts
export interface CartItem {
  id: string;
  name: string;
  price: number;
  discountedPrice?: number;
  originalPrice?: number;
  image: string;
  selectedColor?:
    | {
        name: string;
        hex: string;
      }
    | string;
  selectedWeight?: string;
  quantity: number;
  addedAt?: string;
}

export interface CartContextType {
  cartItems: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  addToCart: (product: CartItem) => void;
  removeFromCart: (
    itemId: string,
    color?: CartItem["selectedColor"],
    weight?: string,
  ) => void;
  updateQuantity: (
    itemId: string,
    color: CartItem["selectedColor"],
    weight: string,
    newQuantity: number,
  ) => void;
  clearCart: () => void;
  getCartItemCount: () => number;
  getSubtotal: () => number;
  getCheckoutData: () => {
    items: CartItem[];
    subtotal: number;
    itemCount: number;
    timestamp: string;
  };
}

// types/cart.ts
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  description?: string;
  colors?: string[]; // hex colors for display
  moreColors?: number;
  showWishlist?: boolean;
  colorOptions?: { name: string; hex: string }[]; // for modal
  weightOptions?: string[]; // for modal
  badge?: string;
  rating?: number;
  reviews?: number;
}

export interface OrderData {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
  timestamp: string;
  customer: CheckoutFormData;
  orderId: string;
  status: "pending" | "processing" | "completed" | "cancelled";
  createdAt: string;
}

export interface CheckoutFormData {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  country: string;
  zipCode: string;
  phone: string;
  saveInfo: boolean;
  shippingMethod: "standard" | "express";
  paymentMethod: "card" | "paypal";
}
