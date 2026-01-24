"use client";
import React, { useState } from "react";
import { Lock, MapPin, User, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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

  const orderSummary = {
    subtotal: 339.97,
    shipping: 15.0,
    tax: 24.37,
    discount: 0,
    total: 379.34,
  };

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

  const onSubmit = async (data: FormData) => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);
    alert("Order placed successfully! 🎉");
    console.log(data);
  };

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button className="flex items-center text-emerald-600 hover:text-emerald-700 font-medium mb-4">
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
                  <span>Tax</span>
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
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 rounded-full font-medium hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md flex items-center justify-center gap-2 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
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
