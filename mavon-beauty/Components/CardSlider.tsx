// components/CartSlider.tsx
"use client";

import { X, ShoppingCart, Trash2, Minus, Plus, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CardContext";
import Link from "next/link";
import { useEffect } from "react";

const CartSlider: React.FC = () => {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    getSubtotal,
    getCartItemCount,
    clearCart,
  } = useCart();

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen]);

  // Calculate tax (10% for example)
  const subtotal = getSubtotal();
  const tax = subtotal * 0.1;
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + tax + shipping;

  const handleClose = (): void => {
    setIsCartOpen(false);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-9998 transition-opacity duration-500"
        onClick={handleBackdropClick}
      />

      {/* Cart Slider */}
      <div className="fixed inset-y-0 right-0 w-full sm:w-96 md:w-1/2 lg:w-1/3 bg-white z-9999 shadow-2xl transform transition-transform duration-500 ease-in-out translate-x-0">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-3">
              <ShoppingCart className="h-6 w-6" />
              <h2 className="text-xl font-bold">Your Cart</h2>
              <span className="bg-gray-900 text-white text-xs px-2 py-1 rounded-full">
                {getCartItemCount()} items
              </span>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
                <p className="text-gray-500 mb-2">Your cart is empty</p>
                <p className="text-gray-400 text-sm">
                  Add some products to get started
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={`${item.id}-${JSON.stringify(item.selectedColor)}-${item.selectedWeight}`}
                    className="flex gap-4 p-4 border rounded-lg"
                  >
                    {/* Product Image */}
                    <div className="w-20 h-20 shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {item.name}
                          </h3>
                          {item.selectedColor && (
                            <p className="text-sm text-gray-600">
                              Color:{" "}
                              <span className="font-medium">
                                {typeof item.selectedColor === "object"
                                  ? item.selectedColor.name
                                  : item.selectedColor}
                              </span>
                            </p>
                          )}
                          {item.selectedWeight && (
                            <p className="text-sm text-gray-600">
                              Size:{" "}
                              <span className="font-medium">
                                {item.selectedWeight}
                              </span>
                            </p>
                          )}
                          <p className="text-lg font-bold text-gray-900 mt-1">
                            ${(item.discountedPrice || item.price).toFixed(2)}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            removeFromCart(
                              item.id,
                              item.selectedColor,
                              item.selectedWeight,
                            )
                          }
                          className="p-1 hover:bg-red-50 text-red-500 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.selectedColor,
                                item.selectedWeight || "",
                                item.quantity - 1,
                              )
                            }
                            className="p-2 hover:bg-gray-100"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-3 font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.selectedColor,
                                item.selectedWeight || "",
                                item.quantity + 1,
                              )
                            }
                            className="p-2 hover:bg-gray-100"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <p className="font-bold text-gray-900">
                          $
                          {(
                            (item.discountedPrice || item.price) * item.quantity
                          ).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer with Totals and Checkout */}
          {cartItems.length > 0 && (
            <div className="border-t p-6 space-y-4">
              {/* Summary */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={clearCart}
                  className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Clear Cart
                </button>
                <Link
                  href="/checkout"
                  onClick={handleClose}
                  className="block w-full"
                >
                  <button className="w-full py-3 bg-[#0ba350] text-white rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2">
                    Proceed to Checkout
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
                <button
                  onClick={handleClose}
                  className="w-full py-3 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSlider;
