"use client";
import React, { useState, useEffect } from "react";
import { Lock, MapPin, User, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CardContext";

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
    const tax = subtotal * 0.075; // 7.5% tax
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
        // Store the new access token
        localStorage.setItem("accessToken", data.accessToken);

        // If new refresh token is provided, store it too
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

  // Function to check if token is expired (simple check)
  const isTokenExpired = (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const expirationTime = payload.exp * 1000; // Convert to milliseconds
      return Date.now() >= expirationTime;
    } catch {
      return false; // If we can't parse, assume it's not expired
    }
  };

  // Function to make authenticated request with token refresh
  const makeAuthenticatedRequest = async (
    url: string,
    options: RequestInit,
  ) => {
    let token = localStorage.getItem("accessToken");

    // Check if token is expired
    if (token && isTokenExpired(token)) {
      console.log("Token expired, attempting to refresh...");
      const newToken = await refreshAccessToken();
      if (newToken) {
        token = newToken;
      } else {
        // If refresh fails, clear tokens and redirect to login
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        alert("Session expired. Please login again.");
        router.push("/login");
        throw new Error("Session expired");
      }
    }

    // Add authorization header
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(url, { ...options, headers });

    // If response is 401 (Unauthorized), try to refresh token and retry
    if (response.status === 401) {
      console.log("Received 401, attempting token refresh...");
      const newToken = await refreshAccessToken();

      if (newToken) {
        // Update token and retry the request
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
        // If refresh fails, clear tokens and redirect to login
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        alert("Session expired. Please login again.");
        router.push("/login");
        throw new Error("Session expired");
      }
    }

    return response;
  };

  const onSubmit = async (data: FormData) => {
    if (cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }

    setIsProcessing(true);

    try {
      // Get user info from localStorage
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

      // Generate order number
      const orderNumber = generateOrderNumber();

      // Prepare order data - EXACTLY matching your Order model
      const orderData = {
        // REQUIRED: Include orderNumber
        orderNumber: orderNumber,

        // REQUIRED: User information
        userId: userId,
        userEmail: userEmail || data.email,
        userName: userName || `${data.firstName} ${data.lastName}`,

        // REQUIRED: Order items
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

        // Shipping address
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

        // Payment information
        paymentInfo: {
          method: "card",
          cardLast4: data.cardNumber.replace(/\s/g, "").slice(-4),
        },

        // REQUIRED: Order totals
        subtotal: orderSummary.subtotal,
        shippingCost: orderSummary.shipping,
        tax: orderSummary.tax,
        discount: orderSummary.discount,
        total: orderSummary.total,

        // Order details
        status: "pending",
        shippingMethod: "standard",
        notes: data.saveInfo ? "Saved info for next time" : "",

        // Timestamp (will be overridden by default but include it)
        orderedAt: new Date().toISOString(),
      };

      console.log("Creating order with data:", orderData);

      // Get token from localStorage
      const token = localStorage.getItem("accessToken");

      if (!token) {
        alert("Please login to continue");
        router.push("/login");
        return;
      }

      // Create order using the authenticated request function
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
        // Clear cart after successful order
        clearCart();

        // Redirect to orders page with success message
        const orderId = result.data?._id || result.data?.orderId || orderNumber;
        router.push(`/orders?success=true&orderId=${orderId}`);
      } else {
        throw new Error(
          result.message || result.error || "Failed to create order",
        );
      }
    } catch (error: any) {
      console.error("Order creation error:", error);

      // Don't show alert if it's a session expired error (already handled)
      if (error.message !== "Session expired") {
        alert(`Order failed: ${error.message}`);
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
            Back to Cart
          </button>
          <h1 className="text-3xl md:text-4xl font-light text-gray-800 tracking-wide">
            Checkout
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
                  Contact Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    {...register("firstName")}
                    className={`w-full border ${errors.firstName ? "border-rose-400" : "border-emerald-200"} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-300`}
                    placeholder="John"
                  />
                  {errors.firstName && (
                    <p className="text-rose-500 text-sm mt-1">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    {...register("lastName")}
                    className={`w-full border ${errors.lastName ? "border-rose-400" : "border-emerald-200"} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-300`}
                    placeholder="Doe"
                  />
                  {errors.lastName && (
                    <p className="text-rose-500 text-sm mt-1">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    className={`w-full border ${errors.email ? "border-rose-400" : "border-emerald-200"} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-300`}
                    placeholder="john.doe@example.com"
                  />
                  {errors.email && (
                    <p className="text-rose-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    {...register("phone")}
                    className={`w-full border ${errors.phone ? "border-rose-400" : "border-emerald-200"} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-300`}
                    placeholder="+994 XX XXX XX XX"
                  />
                  {errors.phone && (
                    <p className="text-rose-500 text-sm mt-1">
                      {errors.phone.message}
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
                  Shipping Address
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    {...register("address")}
                    className={`w-full border ${errors.address ? "border-rose-400" : "border-emerald-200"} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-300`}
                    placeholder="123 Main Street, Apt 4B"
                  />
                  {errors.address && (
                    <p className="text-rose-500 text-sm mt-1">
                      {errors.address.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      {...register("city")}
                      className={`w-full border ${errors.city ? "border-rose-400" : "border-emerald-200"} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-300`}
                      placeholder="Baku"
                    />
                    {errors.city && (
                      <p className="text-rose-500 text-sm mt-1">
                        {errors.city.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State / Province
                    </label>
                    <input
                      type="text"
                      {...register("state")}
                      className="w-full border border-emerald-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                      placeholder="Optional"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP / Postal Code *
                    </label>
                    <input
                      type="text"
                      {...register("zipCode")}
                      className={`w-full border ${errors.zipCode ? "border-rose-400" : "border-emerald-200"} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-300`}
                      placeholder="AZ1000"
                    />
                    {errors.zipCode && (
                      <p className="text-rose-500 text-sm mt-1">
                        {errors.zipCode.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country *
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
                  Payment Information
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number *
                  </label>
                  <input
                    type="text"
                    value={watch("cardNumber")}
                    onChange={handleCardNumberChange}
                    className={`w-full border ${errors.cardNumber ? "border-rose-400" : "border-emerald-200"} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-300`}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />
                  {errors.cardNumber && (
                    <p className="text-rose-500 text-sm mt-1">
                      {errors.cardNumber.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cardholder Name *
                  </label>
                  <input
                    type="text"
                    {...register("cardName")}
                    className={`w-full border ${errors.cardName ? "border-rose-400" : "border-emerald-200"} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-300`}
                    placeholder="JOHN DOE"
                  />
                  {errors.cardName && (
                    <p className="text-rose-500 text-sm mt-1">
                      {errors.cardName.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date *
                    </label>
                    <input
                      type="text"
                      value={watch("expiryDate")}
                      onChange={handleExpiryChange}
                      className={`w-full border ${errors.expiryDate ? "border-rose-400" : "border-emerald-200"} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-300`}
                      placeholder="MM/YY"
                    />
                    {errors.expiryDate && (
                      <p className="text-rose-500 text-sm mt-1">
                        {errors.expiryDate.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV *
                    </label>
                    <input
                      type="text"
                      value={watch("cvv")}
                      onChange={handleCvvChange}
                      className={`w-full border ${errors.cvv ? "border-rose-400" : "border-emerald-200"} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-300`}
                      placeholder="123"
                      maxLength={4}
                    />
                    {errors.cvv && (
                      <p className="text-rose-500 text-sm mt-1">
                        {errors.cvv.message}
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
                  <span className="ml-3 text-gray-700">
                    Save this information for next time
                  </span>
                </label>

                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("newsletter")}
                    className="w-5 h-5 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="ml-3 text-gray-700">
                    Subscribe to our newsletter for exclusive offers
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-emerald-100 sticky top-6">
              <h2 className="text-xl font-medium text-gray-800 mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium">
                    ${orderSummary.subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium">
                    ${orderSummary.shipping.toFixed(2)}
                  </span>
                </div>
                {orderSummary.discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount</span>
                    <span className="font-medium">
                      -${orderSummary.discount.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Tax (7.5%)</span>
                  <span className="font-medium">
                    ${orderSummary.tax.toFixed(2)}
                  </span>
                </div>

                <div className="border-t border-emerald-100 pt-4 mt-4">
                  <div className="flex justify-between font-semibold text-lg">
                    <span className="text-gray-800">Total</span>
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
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Complete Order
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Lock className="w-4 h-4" />
                <span>Secure SSL encrypted checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
