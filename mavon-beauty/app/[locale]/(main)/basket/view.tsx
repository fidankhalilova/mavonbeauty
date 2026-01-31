"use client";

import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Lock,
  Shield,
  ChevronDown,
  ChevronUp,
  Edit2,
  Check,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import { useCart } from "@/context/CardContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { isAuthenticated, getCurrentUserId } from "@/service/authService";
import { useTranslations } from "next-intl";

interface BasketCartItem {
  id: string;
  name: string;
  model: string;
  hsCode: string;
  quantity: number;
  weight: number;
  perPieceRate: number;
  totalPrice: number;
  color: string;
  deliveryMethod: string;
  description: string;
  isEditingDescription: boolean;
  originalDescription: string;
  showDescription: boolean;
  image: string;
  selectedColor?: any;
  selectedWeight?: string;
}

export default function BasketPage() {
  const {
    cartItems: contextCartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    getSubtotal,
    forceReloadCart,
    currentUserId,
  } = useCart();

  const router = useRouter();
  const t = useTranslations("Basket");

  const [shippingMethod, setShippingMethod] = useState<string>("standard");
  const [promoCode, setPromoCode] = useState<string>("");
  const [promoMessage, setPromoMessage] = useState<string>("");
  const [promoValid, setPromoValid] = useState<boolean>(false);
  const [discount, setDiscount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [localCartItems, setLocalCartItems] = useState<BasketCartItem[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  // Check authentication and load cart
  useEffect(() => {
    const checkAuthAndLoad = () => {
      if (!isAuthenticated()) {
        console.log("🔒 Not authenticated, redirecting to login");
        router.push("/login");
        return false;
      }

      const userId = getCurrentUserId();
      console.log("✅ User authenticated, ID:", userId);
      console.log("📦 Cart items from context:", contextCartItems.length);

      return true;
    };

    if (checkAuthAndLoad()) {
      setIsLoading(false);
    }
  }, [router, contextCartItems, refreshTrigger]);

  // Convert context cart items to local format
  useEffect(() => {
    console.log("🔄 Converting cart items...", contextCartItems);

    if (contextCartItems.length > 0) {
      const convertedItems: BasketCartItem[] = contextCartItems.map(
        (item, index) => ({
          id: item.id,
          name: item.name,
          model: item.model || item.name,
          hsCode: item.hsCode || "330499",
          quantity: item.quantity,
          weight: item.weight || 0.05,
          perPieceRate: item.discountedPrice || item.price,
          totalPrice: (item.discountedPrice || item.price) * item.quantity,
          color:
            item.color ||
            (typeof item.selectedColor === "object"
              ? item.selectedColor?.name
              : item.selectedColor || "Clear"),
          deliveryMethod: item.deliveryMethod || "Standard",
          description:
            item.description || `${item.name} - Premium beauty product`,
          isEditingDescription: false,
          originalDescription: "",
          showDescription: false,
          image:
            item.image ||
            "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=150&h=150&fit=crop",
          selectedColor: item.selectedColor,
          selectedWeight: item.selectedWeight,
        }),
      );
      console.log("✅ Converted items:", convertedItems);
      setLocalCartItems(convertedItems);
    } else {
      console.log("🛒 Cart is empty");
      setLocalCartItems([]);
    }
  }, [contextCartItems]);

  const handleRemoveItem = (id: string, color?: any, weight?: string): void => {
    if (confirm(t("removeItemConfirm"))) {
      console.log(`🗑️ Removing item ${id}`, { color, weight });
      removeFromCart(id, color, weight);
      setRefreshTrigger((prev) => prev + 1);
    }
  };

  const handleClearCart = (): void => {
    if (confirm(t("clearCartConfirm"))) {
      clearCart();
      setLocalCartItems([]);
      setRefreshTrigger((prev) => prev + 1);
    }
  };

  const handleIncrementQuantity = (id: string): void => {
    const item = contextCartItems.find((item) => item.id === id);
    if (item) {
      const newQuantity = item.quantity + 1;
      console.log(`➕ Incrementing item ${id} to ${newQuantity}`);

      const color = item.selectedColor || item.color || "Clear";
      const weight = item.selectedWeight || item.deliveryMethod || "Standard";

      updateQuantity(id, color, weight, newQuantity);
      setRefreshTrigger((prev) => prev + 1);
    }
  };

  const handleDecrementQuantity = (id: string): void => {
    const item = contextCartItems.find((item) => item.id === id);
    if (item) {
      const newQuantity = item.quantity - 1;
      console.log(`➖ Decrementing item ${id} to ${newQuantity}`);

      const color = item.selectedColor || item.color || "Clear";
      const weight = item.selectedWeight || item.deliveryMethod || "Standard";

      updateQuantity(id, color, weight, newQuantity);
      setRefreshTrigger((prev) => prev + 1);
    }
  };

  const handleUpdateQuantity = (id: string, value: string): void => {
    const quantity = parseInt(value, 10);
    const item = contextCartItems.find((item) => item.id === id);
    if (item && !isNaN(quantity) && quantity >= 0) {
      console.log(`✏️ Updating item ${id} quantity to ${quantity}`);

      const color = item.selectedColor || item.color || "Clear";
      const weight = item.selectedWeight || item.deliveryMethod || "Standard";

      updateQuantity(id, color, weight, quantity === 0 ? 0 : quantity);
      setRefreshTrigger((prev) => prev + 1);
    }
  };

  const toggleDescription = (id: string) => {
    setLocalCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, showDescription: !item.showDescription }
          : item,
      ),
    );
  };

  const startEditingDescription = (id: string) => {
    setLocalCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? {
              ...item,
              originalDescription: item.description,
              isEditingDescription: true,
            }
          : item,
      ),
    );
  };

  const saveDescription = (id: string) => {
    setLocalCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, isEditingDescription: false } : item,
      ),
    );
  };

  const cancelEditingDescription = (id: string) => {
    setLocalCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? {
              ...item,
              description: item.originalDescription,
              isEditingDescription: false,
            }
          : item,
      ),
    );
  };

  const handleDescriptionChange = (id: string, value: string) => {
    setLocalCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, description: value } : item,
      ),
    );
  };

  const getColorDot = (color: string) => {
    const colorMap: Record<string, string> = {
      clear: "bg-blue-100 border-2 border-blue-200",
      white: "bg-white border-2 border-gray-300",
      pink: "bg-pink-200",
      beige: "bg-amber-100",
      black: "bg-gray-900",
      red: "bg-red-500",
      blue: "bg-blue-500",
      green: "bg-green-500",
      yellow: "bg-yellow-500",
      purple: "bg-purple-500",
    };
    return colorMap[color] || "bg-gray-200";
  };

  const applyPromoCode = () => {
    const promoCodes: Record<
      string,
      { discount: number; message: string; freeShipping?: boolean }
    > = {
      GLOW20: { discount: 0.2, message: "20% discount applied!" },
      NEWBEAUTY: { discount: 0.15, message: "15% off your order!" },
      FREESHIP: {
        discount: 0,
        message: "Free shipping unlocked!",
        freeShipping: true,
      },
    };

    if (promoCode.trim() === "") {
      setPromoMessage("Please enter a promo code");
      setPromoValid(false);
      return;
    }

    const promo = promoCodes[promoCode.toUpperCase()];
    if (promo) {
      setPromoValid(true);
      setPromoMessage(promo.message);
      if (promo.discount) {
        const subtotal = getSubtotal();
        setDiscount(subtotal * promo.discount);
      }
      if (promo.freeShipping) {
        setShippingMethod("standard");
      }
    } else {
      setPromoValid(false);
      setPromoMessage("Invalid promo code");
      setDiscount(0);
    }
  };

  const handleManualRefresh = () => {
    console.log("🔄 Manually refreshing cart...");
    forceReloadCart();
    setRefreshTrigger((prev) => prev + 1);
  };

  const subtotal = getSubtotal();
  const shippingCost =
    {
      standard: 5,
      express: 15,
      overnight: 25,
    }[shippingMethod] || 5;

  const calculateTax = () => (subtotal - discount) * 0.075;
  const total = subtotal + shippingCost + calculateTax() - discount;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white mt-10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white mt-10">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl md:text-4xl font-light text-gray-800 tracking-wide">
              {t("shoppingCart")}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleManualRefresh}
              className="text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-2 text-sm"
              title={t("refresh")}
            >
              <RefreshCw className="w-4 h-4" />
              {t("refresh")}
            </button>
            <div className="bg-white shadow-sm px-4 py-2 rounded-full flex items-center gap-2 border border-emerald-100">
              <ShoppingCart className="w-5 h-5 text-emerald-500" />
              <span className="font-medium text-gray-700">
                {localCartItems.length}
              </span>
              <span className="hidden sm:inline text-gray-600">
                {t("items")}
              </span>
            </div>
          </div>
        </div>

        {localCartItems.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-emerald-100">
            <ShoppingCart className="w-16 h-16 text-emerald-200 mx-auto mb-4" />
            <p className="text-xl text-gray-500 mb-6">{t("cartEmpty")}</p>
            <Link href="/shop">
              <button className="bg-linear-to-r from-emerald-500 to-teal-500 text-white px-8 py-3 rounded-full hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md">
                {t("discoverProducts")}
              </button>
            </Link>
          </div>
        ) : (
          <>
            {/* Mobile View */}
            <div className="sm:hidden space-y-4">
              {localCartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-sm p-4 border border-emerald-100"
                >
                  <div className="flex gap-3 mb-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-xl"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.model}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        HS: {item.hsCode}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        handleRemoveItem(
                          item.id,
                          item.selectedColor,
                          item.selectedWeight,
                        )
                      }
                      className="text-rose-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">{t("color")}:</span>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-full ${getColorDot(item.color)}`}
                        ></div>
                        <span className="text-gray-700">{item.color}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">{t("quantity")}:</span>
                      <div className="flex items-center gap-2 border border-emerald-200 rounded-full overflow-hidden">
                        <button
                          onClick={() => handleDecrementQuantity(item.id)}
                          className="px-3 py-1 hover:bg-emerald-50"
                        >
                          <Minus className="w-4 h-4 text-gray-600" />
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            handleUpdateQuantity(item.id, e.target.value)
                          }
                          className="w-12 text-center border-none focus:outline-none"
                          min="1"
                        />
                        <button
                          onClick={() => handleIncrementQuantity(item.id)}
                          className="px-3 py-1 hover:bg-emerald-50"
                        >
                          <Plus className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-emerald-100">
                      <button
                        onClick={() => toggleDescription(item.id)}
                        className="flex items-center justify-between w-full text-gray-600 hover:text-gray-800"
                      >
                        <span>{t("description")}</span>
                        {item.showDescription ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>

                      {item.showDescription && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          {item.isEditingDescription ? (
                            <div className="space-y-2">
                              <textarea
                                value={item.description}
                                onChange={(e) =>
                                  handleDescriptionChange(
                                    item.id,
                                    e.target.value,
                                  )
                                }
                                className="w-full p-2 border rounded text-sm"
                                rows={3}
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => saveDescription(item.id)}
                                  className="px-3 py-1 bg-emerald-500 text-white rounded text-sm flex items-center gap-1"
                                >
                                  <Check className="w-3 h-3" /> {t("save")}
                                </button>
                                <button
                                  onClick={() =>
                                    cancelEditingDescription(item.id)
                                  }
                                  className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm"
                                >
                                  {t("cancel")}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex justify-between items-start">
                              <p className="text-sm text-gray-700">
                                {item.description}
                              </p>
                              <button
                                onClick={() => startEditingDescription(item.id)}
                                className="text-gray-400 hover:text-emerald-500 ml-2"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between pt-3 border-t border-emerald-100">
                      <span className="text-gray-600">{t("price")}:</span>
                      <span className="font-medium text-gray-800">
                        ${item.perPieceRate.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between font-semibold">
                      <span>{t("total")}:</span>
                      <span className="text-emerald-600">
                        ${item.totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View */}
            <div className="hidden sm:block">
              {localCartItems.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-emerald-100 mb-6">
                  <table className="w-full">
                    <thead className="bg-linear-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
                      <tr>
                        <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">
                          Product
                        </th>
                        <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">
                          Details
                        </th>
                        <th className="py-4 px-6 text-center text-sm font-medium text-gray-700">
                          {t("quantity")}
                        </th>
                        <th className="py-4 px-6 text-right text-sm font-medium text-gray-700">
                          {t("price")}
                        </th>
                        <th className="py-4 px-6 text-right text-sm font-medium text-gray-700">
                          {t("total")}
                        </th>
                        <th className="py-4 px-6 text-center text-sm font-medium text-gray-700"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {localCartItems.map((item, idx) => (
                        <React.Fragment key={item.id}>
                          <tr
                            className={
                              idx > 0 ? "border-t border-emerald-100" : ""
                            }
                          >
                            <td className="py-6 px-6">
                              <div className="flex items-center gap-4">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-20 h-20 object-cover rounded-xl"
                                />
                                <div>
                                  <h3 className="font-medium text-gray-800">
                                    {item.name}
                                  </h3>
                                  <p className="text-sm text-gray-500">
                                    {item.model}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    HS: {item.hsCode}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="py-6 px-6">
                              <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`w-4 h-4 rounded-full ${getColorDot(item.color)}`}
                                  ></div>
                                  <span className="text-gray-700">
                                    {item.color}
                                  </span>
                                </div>
                                <div className="text-gray-600">
                                  {item.weight} kg
                                </div>
                                <div className="text-gray-600">
                                  {item.deliveryMethod}
                                </div>

                                {/* Description Toggle */}
                                <div className="pt-2">
                                  <button
                                    onClick={() => toggleDescription(item.id)}
                                    className="flex items-center gap-1 text-gray-600 hover:text-gray-800 text-sm"
                                  >
                                    {t("description")}
                                    {item.showDescription ? (
                                      <ChevronUp className="w-3 h-3" />
                                    ) : (
                                      <ChevronDown className="w-3 h-3" />
                                    )}
                                  </button>

                                  {item.showDescription && (
                                    <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                                      {item.isEditingDescription ? (
                                        <div className="space-y-2">
                                          <textarea
                                            value={item.description}
                                            onChange={(e) =>
                                              handleDescriptionChange(
                                                item.id,
                                                e.target.value,
                                              )
                                            }
                                            className="w-full p-2 border rounded text-sm"
                                            rows={3}
                                          />
                                          <div className="flex gap-2">
                                            <button
                                              onClick={() =>
                                                saveDescription(item.id)
                                              }
                                              className="px-3 py-1 bg-emerald-500 text-white rounded text-sm flex items-center gap-1"
                                            >
                                              <Check className="w-3 h-3" />{" "}
                                              {t("save")}
                                            </button>
                                            <button
                                              onClick={() =>
                                                cancelEditingDescription(
                                                  item.id,
                                                )
                                              }
                                              className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm"
                                            >
                                              {t("cancel")}
                                            </button>
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="flex justify-between items-start">
                                          <p className="text-sm text-gray-700">
                                            {item.description}
                                          </p>
                                          <button
                                            onClick={() =>
                                              startEditingDescription(item.id)
                                            }
                                            className="text-gray-400 hover:text-emerald-500 ml-2"
                                          >
                                            <Edit2 className="w-4 h-4" />
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-6 px-6">
                              <div className="flex items-center justify-center gap-2 border border-emerald-200 rounded-full overflow-hidden w-fit mx-auto">
                                <button
                                  onClick={() =>
                                    handleDecrementQuantity(item.id)
                                  }
                                  className="px-3 py-2 hover:bg-emerald-50"
                                >
                                  <Minus className="w-4 h-4 text-gray-600" />
                                </button>
                                <input
                                  type="text"
                                  value={item.quantity}
                                  onChange={(e) =>
                                    handleUpdateQuantity(
                                      item.id,
                                      e.target.value,
                                    )
                                  }
                                  className="w-12 text-center border-none focus:outline-none"
                                  min="1"
                                />
                                <button
                                  onClick={() =>
                                    handleIncrementQuantity(item.id)
                                  }
                                  className="px-3 py-2 hover:bg-emerald-50"
                                >
                                  <Plus className="w-4 h-4 text-gray-600" />
                                </button>
                              </div>
                            </td>
                            <td className="py-6 px-6 text-right">
                              <span className="font-medium text-gray-800">
                                ${item.perPieceRate.toFixed(2)}
                              </span>
                            </td>
                            <td className="py-6 px-6 text-right">
                              <span className="font-semibold text-emerald-600">
                                ${item.totalPrice.toFixed(2)}
                              </span>
                            </td>
                            <td className="py-6 px-6 text-center">
                              <button
                                onClick={() =>
                                  handleRemoveItem(
                                    item.id,
                                    item.selectedColor,
                                    item.selectedWeight,
                                  )
                                }
                                className="text-rose-400 hover:text-rose-600 p-2"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </td>
                          </tr>
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Order Summary Section */}
            {localCartItems.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Shipping Options */}
                  <div className="bg-white rounded-2xl shadow-sm p-6 border border-emerald-100">
                    <h2 className="text-lg font-medium text-gray-800 mb-4">
                      {t("shippingOptions")}
                    </h2>
                    <div className="space-y-3">
                      {[
                        {
                          value: "standard",
                          name: t("standardShipping"),
                          time: `5-7 ${t("businessDays")}`,
                          price: 5,
                        },
                        {
                          value: "express",
                          name: t("expressShipping"),
                          time: `2-3 ${t("businessDays")}`,
                          price: 15,
                        },
                        {
                          value: "overnight",
                          name: t("overnightShipping"),
                          time: t("nextDayDelivery"),
                          price: 25,
                        },
                      ].map((option) => (
                        <label
                          key={option.value}
                          className="flex items-center p-4 border border-emerald-100 rounded-xl cursor-pointer hover:bg-emerald-50 transition-colors"
                        >
                          <input
                            type="radio"
                            name="shipping"
                            value={option.value}
                            checked={shippingMethod === option.value}
                            onChange={(e) => setShippingMethod(e.target.value)}
                            className="mr-4 accent-emerald-500"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-gray-800">
                              {option.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {option.time}
                            </div>
                          </div>
                          <div className="font-semibold text-gray-800">
                            ${option.price.toFixed(2)}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Promo Code */}
                  <div className="bg-white rounded-2xl shadow-sm p-6 border border-emerald-100">
                    <h2 className="text-lg font-medium text-gray-800 mb-4">
                      {t("promoCode")}
                    </h2>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder={t("enterCode")}
                        className="flex-1 border border-emerald-200 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                      />
                      <button
                        onClick={applyPromoCode}
                        className="bg-linear-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-full hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md"
                      >
                        {t("apply")}
                      </button>
                    </div>
                    {promoMessage && (
                      <p
                        className={`mt-3 text-sm ${promoValid ? "text-emerald-600" : "text-rose-500"}`}
                      >
                        {promoMessage}
                      </p>
                    )}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-2xl shadow-sm p-6 border border-emerald-100 sticky top-6">
                    <h2 className="text-xl font-medium text-gray-800 mb-6">
                      {t("orderSummary")}
                    </h2>
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-gray-600">
                        <span>{t("subtotal")}</span>
                        <span className="font-medium">
                          ${subtotal.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>{t("shipping")}</span>
                        <span className="font-medium">
                          ${shippingCost.toFixed(2)}
                        </span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-emerald-600">
                          <span>{t("discount")}</span>
                          <span className="font-medium">
                            -${discount.toFixed(2)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between text-gray-600">
                        <span>{t("tax")}</span>
                        <span className="font-medium">
                          ${calculateTax().toFixed(2)}
                        </span>
                      </div>
                      <div className="border-t border-emerald-100 pt-4 mt-4">
                        <div className="flex justify-between font-semibold text-lg">
                          <span className="text-gray-800">{t("total")}</span>
                          <span className="text-emerald-600">
                            ${total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => router.push("/checkout")}
                      className="w-full bg-linear-to-r from-emerald-500 to-teal-500 text-white py-4 rounded-full font-medium hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md flex items-center justify-center gap-2 mb-4"
                    >
                      <Lock className="w-5 h-5" />
                      {t("secureCheckout")}
                    </button>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                      <Shield className="w-4 h-4" />
                      <span>{t("secureEncrypted")}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Footer Buttons */}
            {localCartItems.length > 0 && (
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
                <Link href="/shop">
                  <button className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    {t("continueShopping")}
                  </button>
                </Link>
                <div className="flex gap-4">
                  <button
                    onClick={handleClearCart}
                    className="text-gray-400 hover:text-rose-500 transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    {t("clearCart")}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
