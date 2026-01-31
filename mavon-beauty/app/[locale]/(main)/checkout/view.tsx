"use client";
import React, { useState, useEffect } from "react";
import { Lock, MapPin, User, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CardContext";
import {
  setAccessTokenCookie,
  clearAccessTokenCookie,
} from "@/utils/cookieUtils";
import { useTranslations } from "next-intl";

const checkoutSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().optional(),
  zipCode: z.string().min(1, "ZIP code is required"),
  country: z.string().min(1, "Country is required"),
  cardNumber: z.string().min(19, "Valid 16-digit card number is required"),
  cardName: z.string().min(1, "Cardholder name is required"),
  expiryDate: z
    .string()
    .regex(/^\d{2}\/\d{2}$/, "Valid expiry date is required (MM/YY)"),
  cvv: z.string().min(3, "Valid CVV is required (3-4 digits)").max(4),
  saveInfo: z.boolean().optional(),
  newsletter: z.boolean().optional(),
});

type FormData = z.infer<typeof checkoutSchema>;

export default function CheckoutForm() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    shipping: 0,
    tax: 0,
    discount: 0,
    total: 0,
  });
  const router = useRouter();
  const { cartItems, getSubtotal, clearCart } = useCart();
  const t = useTranslations("Checkout");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "Azerbaijan",
      cardNumber: "",
      cardName: "",
      expiryDate: "",
      cvv: "",
      saveInfo: false,
      newsletter: false,
    },
  });

  // Calculate order summary from cart
  useEffect(() => {
    const subtotal = getSubtotal();
    const shipping = 15.0;
    const tax = subtotal * 0.075;
    const total = subtotal + shipping + tax;

    setOrderSummary({
      subtotal,
      shipping,
      tax,
      discount: 0,
      total,
    });

    // Load user info if available
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setValue("email", userData.email || "");
        setValue("firstName", userData.name?.split(" ")[0] || "");
        setValue(
          "lastName",
          userData.name?.split(" ").slice(1).join(" ") || "",
        );
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, [cartItems, getSubtotal, setValue]);

  const formatCardNumber = (value: string): string => {
    const cleaned = value.replace(/\s/g, "");
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(" ") : cleaned;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, "");
    if (value.length <= 16 && /^\d*$/.test(value)) {
      setValue("cardNumber", formatCardNumber(value));
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length >= 2) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4);
    }
    if (value.length <= 5) {
      setValue("expiryDate", value);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 4) {
      setValue("cvv", value);
    }
  };

  const generateOrderNumber = (): string => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    return `ORD-${year}${month}${day}-${random}`;
  };

  // Function to refresh access token
  const refreshAccessToken = async (): Promise<string | null> => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        console.log("No refresh token available");
        return null;
      }

      console.log("Attempting to refresh access token...");

      const response = await fetch(
        "http://localhost:3001/api/v1/auth/refresh-token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        },
      );

      const data = await response.json();
      console.log("Refresh token response:", data);

      if (data.success && data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        setAccessTokenCookie(data.accessToken);

        if (data.refreshToken) {
          localStorage.setItem("refreshToken", data.refreshToken);
        }

        console.log("Access token refreshed successfully");
        return data.accessToken;
      } else {
        console.log("Failed to refresh token:", data.message);
        return null;
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      return null;
    }
  };

  // Function to check if token is expired
  const isTokenExpired = (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const expirationTime = payload.exp * 1000;
      return Date.now() >= expirationTime;
    } catch {
      return false;
    }
  };

  // Function to make authenticated request with token refresh
  const makeAuthenticatedRequest = async (
    url: string,
    options: RequestInit,
  ) => {
    let token = localStorage.getItem("accessToken");

    if (token && isTokenExpired(token)) {
      console.log("Token expired, attempting to refresh...");
      const newToken = await refreshAccessToken();
      if (newToken) {
        token = newToken;
      } else {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        clearAccessTokenCookie();
        alert(t("alerts.sessionExpired"));
        router.push("/login");
        throw new Error("Session expired");
      }
    }

    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
      console.log("Received 401, attempting token refresh...");
      const newToken = await refreshAccessToken();

      if (newToken) {
        token = newToken;
        const retryHeaders = {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        };

        const retryResponse = await fetch(url, {
          ...options,
          headers: retryHeaders,
        });
        return retryResponse;
      } else {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        clearAccessTokenCookie();
        alert(t("alerts.sessionExpired"));
        router.push("/login");
        throw new Error("Session expired");
      }
    }

    return response;
  };

  const onSubmit = async (data: FormData) => {
    if (cartItems.length === 0) {
      alert(t("alerts.cartEmpty"));
      return;
    }

    setIsProcessing(true);

    try {
      const userStr = localStorage.getItem("user");
      let userId = null;
      let userEmail = "";
      let userName = "";

      if (userStr) {
        try {
          const userData = JSON.parse(userStr);
          userId = userData.id || userData._id;
          userEmail = userData.email || "";
          userName = userData.name || "";
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }

      if (!userId) {
        throw new Error("User not found. Please login again.");
      }

      const orderNumber = generateOrderNumber();

      const orderData = {
        orderNumber: orderNumber,
        userId: userId,
        userEmail: userEmail || data.email,
        userName: userName || `${data.firstName} ${data.lastName}`,
        items: cartItems.map((item) => ({
          productId: item.id,
          name: item.name,
          price: item.discountedPrice || item.price,
          quantity: item.quantity,
          selectedColor: item.selectedColor || undefined,
          selectedSize: item.selectedWeight || item.selectedSize || undefined,
          image: item.image || "",
          description: item.description || "",
        })),
        shippingAddress: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          address: data.address,
          city: data.city,
          state: data.state || "",
          zipCode: data.zipCode,
          country: data.country,
        },
        paymentInfo: {
          method: "card",
          cardLast4: data.cardNumber.replace(/\s/g, "").slice(-4),
        },
        subtotal: orderSummary.subtotal,
        shippingCost: orderSummary.shipping,
        tax: orderSummary.tax,
        discount: orderSummary.discount,
        total: orderSummary.total,
        status: "pending",
        shippingMethod: "standard",
        notes: data.saveInfo ? "Saved info for next time" : "",
        orderedAt: new Date().toISOString(),
      };

      console.log("Creating order with data:", orderData);

      const token = localStorage.getItem("accessToken");

      if (!token) {
        alert("Please login to continue");
        router.push("/login");
        return;
      }

      const response = await makeAuthenticatedRequest(
        "http://localhost:3001/api/v1/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        },
      );

      const result = await response.json();
      console.log("Order creation response:", result);

      if (result.success) {
        clearCart();
        const orderId = result.data?._id || result.data?.orderId || orderNumber;
        router.push(`/orders?success=true&orderId=${orderId}`);
      } else {
        throw new Error(
          result.message || result.error || "Failed to create order",
        );
      }
    } catch (error: any) {
      console.error("Order creation error:", error);
      if (error.message !== "Session expired") {
        alert(t("alerts.orderFailed", { error: error.message }));
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={() => router.push("/basket")}
            className="flex items-center text-emerald-600 hover:text-emerald-700 font-medium mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("backToCart")}
          </button>
          <h1 className="text-3xl md:text-4xl font-light text-gray-800 tracking-wide">
            {t("checkout")}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-emerald-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-emerald-100 p-2 rounded-lg">
                  <User className="w-5 h-5 text-emerald-600" />
                </div>
                <h2 className="text-xl font-medium text-gray-800">
                  {t("contactInformation")}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("firstName")}
                  </label>
                  <input
                    type="text"
                    {...register("firstName")}
                    className={`w-full border ${errors.firstName ? "border-rose-400" : "border-emerald-200"} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-300`}
                    placeholder={t("placeholders.firstName")}
                  />
                  {errors.firstName && (
                    <p className="text-rose-500 text-sm mt-1">
                      {t("errors.firstNameRequired")}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("lastName")}
                  </label>
                  <input
                    type="text"
                    {...register("lastName")}
                    className={`w-full border ${errors.lastName ? "border-rose-400" : "border-emerald-200"} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-300`}
                    placeholder={t("placeholders.lastName")}
                  />
                  {errors.lastName && (
                    <p className="text-rose-500 text-sm mt-1">
                      {t("errors.lastNameRequired")}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("email")}
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    className={`w-full border ${errors.email ? "border-rose-400" : "border-emerald-200"} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-300`}
                    placeholder={t("placeholders.email")}
                  />
                  {errors.email && (
                    <p className="text-rose-500 text-sm mt-1">
                      {t("errors.emailRequired")}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("phone")}
                  </label>
                  <input
                    type="tel"
                    {...register("phone")}
                    className={`w-full border ${errors.phone ? "border-rose-400" : "border-emerald-200"} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-300`}
                    placeholder={t("placeholders.phone")}
                  />
                  {errors.phone && (
                    <p className="text-rose-500 text-sm mt-1">
                      {t("errors.phoneRequired")}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-emerald-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-emerald-100 p-2 rounded-lg">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                </div>
                <h2 className="text-xl font-medium text-gray-800">
                  {t("shippingAddress")}
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("streetAddress")}
                  </label>
                  <input
                    type="text"
                    {...register("address")}
                    className={`w-full border ${errors.address ? "border-rose-400" : "border-emerald-200"} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-300`}
                    placeholder={t("placeholders.address")}
                  />
                  {errors.address && (
                    <p className="text-rose-500 text-sm mt-1">
                      {t("errors.addressRequired")}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("city")}
                    </label>
                    <input
                      type="text"
                      {...register("city")}
                      className={`w-full border ${errors.city ? "border-rose-400" : "border-emerald-200"} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-300`}
                      placeholder={t("placeholders.city")}
                    />
                    {errors.city && (
                      <p className="text-rose-500 text-sm mt-1">
                        {t("errors.cityRequired")}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("stateProvince")}
                    </label>
                    <input
                      type="text"
                      {...register("state")}
                      className="w-full border border-emerald-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                      placeholder={t("placeholders.state")}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("zipPostalCode")}
                    </label>
                    <input
                      type="text"
                      {...register("zipCode")}
                      className={`w-full border ${errors.zipCode ? "border-rose-400" : "border-emerald-200"} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-300`}
                      placeholder={t("placeholders.zipCode")}
                    />
                    {errors.zipCode && (
                      <p className="text-rose-500 text-sm mt-1">
                        {t("errors.zipCodeRequired")}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("country")}
                    </label>
                    <select
                      {...register("country")}
                      className="w-full border border-emerald-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                    >
                      <option value="Azerbaijan">Azerbaijan</option>
                      <option value="Turkey">Turkey</option>
                      <option value="Georgia">Georgia</option>
                      <option value="Russia">Russia</option>
                      <option value="USA">United States</option>
                      <option value="UK">United Kingdom</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-emerald-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-emerald-100 p-2 rounded-lg">
                  <Lock className="w-5 h-5 text-emerald-600" />
                </div>
                <h2 className="text-xl font-medium text-gray-800">
                  {t("paymentInformation")}
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("cardNumber")}
                  </label>
                  <input
                    type="text"
                    value={watch("cardNumber")}
                    onChange={handleCardNumberChange}
                    className={`w-full border ${errors.cardNumber ? "border-rose-400" : "border-emerald-200"} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-300`}
                    placeholder={t("placeholders.cardNumber")}
                    maxLength={19}
                  />
                  {errors.cardNumber && (
                    <p className="text-rose-500 text-sm mt-1">
                      {t("errors.cardNumberRequired")}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("cardholderName")}
                  </label>
                  <input
                    type="text"
                    {...register("cardName")}
                    className={`w-full border ${errors.cardName ? "border-rose-400" : "border-emerald-200"} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-300`}
                    placeholder={t("placeholders.cardName")}
                  />
                  {errors.cardName && (
                    <p className="text-rose-500 text-sm mt-1">
                      {t("errors.cardNameRequired")}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("expiryDate")}
                    </label>
                    <input
                      type="text"
                      value={watch("expiryDate")}
                      onChange={handleExpiryChange}
                      className={`w-full border ${errors.expiryDate ? "border-rose-400" : "border-emerald-200"} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-300`}
                      placeholder={t("placeholders.expiryDate")}
                    />
                    {errors.expiryDate && (
                      <p className="text-rose-500 text-sm mt-1">
                        {t("errors.expiryDateRequired")}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("cvv")}
                    </label>
                    <input
                      type="text"
                      value={watch("cvv")}
                      onChange={handleCvvChange}
                      className={`w-full border ${errors.cvv ? "border-rose-400" : "border-emerald-200"} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-300`}
                      placeholder={t("placeholders.cvv")}
                      maxLength={4}
                    />
                    {errors.cvv && (
                      <p className="text-rose-500 text-sm mt-1">
                        {t("errors.cvvRequired")}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"
                    alt="Visa"
                    className="h-8"
                  />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                    alt="Mastercard"
                    className="h-8"
                  />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg"
                    alt="American Express"
                    className="h-8"
                  />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Paypal_2014_logo.png"
                    alt="PayPal"
                    className="h-8"
                  />
                </div>
              </div>
            </div>

            {/* Additional Options */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-emerald-100">
              <div className="space-y-3">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("saveInfo")}
                    className="w-5 h-5 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="ml-3 text-gray-700">{t("saveInfo")}</span>
                </label>

                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("newsletter")}
                    className="w-5 h-5 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="ml-3 text-gray-700">
                    {t("subscribeNewsletter")}
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-emerald-100 sticky top-6">
              <h2 className="text-xl font-medium text-gray-800 mb-6">
                {t("orderSummary")}
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>{t("Basket.subtotal")}</span>
                  <span className="font-medium">
                    ${orderSummary.subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>{t("Basket.shipping")}</span>
                  <span className="font-medium">
                    ${orderSummary.shipping.toFixed(2)}
                  </span>
                </div>
                {orderSummary.discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>{t("Basket.discount")}</span>
                    <span className="font-medium">
                      -${orderSummary.discount.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>{t("Basket.tax")}</span>
                  <span className="font-medium">
                    ${orderSummary.tax.toFixed(2)}
                  </span>
                </div>

                <div className="border-t border-emerald-100 pt-4 mt-4">
                  <div className="flex justify-between font-semibold text-lg">
                    <span className="text-gray-800">{t("Basket.total")}</span>
                    <span className="text-emerald-600">
                      ${orderSummary.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSubmit(onSubmit)}
                disabled={isProcessing || cartItems.length === 0}
                className="w-full bg-linear-to-r from-emerald-500 to-teal-500 text-white py-4 rounded-full font-medium hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md flex items-center justify-center gap-2 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    {t("processing")}
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    {t("completeOrder")}
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Lock className="w-4 h-4" />
                <span>{t("secureSSL")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
