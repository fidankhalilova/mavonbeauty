"use client";
import React, { useState, useEffect } from "react";
import {
  Package,
  CheckCircle,
  Clock,
  Truck,
  Home,
  ArrowLeft,
  MapPin,
  CreditCard,
  Printer,
  Mail,
  Phone,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface OrderItem {
  _id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  selectedColor?: {
    name: string;
    hex: string;
  };
  selectedSize?: string;
  image: string;
  description?: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  total: number;
  status:
    | "pending"
    | "paid"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state?: string;
    zipCode: string;
    country: string;
  };
  paymentInfo: {
    method: string;
    cardLast4?: string;
    transactionId: string;
    paidAt: string;
  };
  shippingMethod: string;
  trackingNumber?: string;
  notes?: string;
  orderedAt: string;
  deliveredAt?: string;
  cancelledAt?: string;
}

const API_BASE_URL = "http://localhost:3001/api/v1";

export default function OrderDetailsPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const t = useTranslations("Orders");

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("accessToken");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setOrder(data.data);
      } else {
        setError(data.message || t("errorLoadingOrder"));
      }
    } catch (error: any) {
      console.error("Error fetching order:", error);
      setError(t("errorLoadingOrder"));
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="w-6 h-6 text-yellow-500" />;
      case "paid":
        return <CheckCircle className="w-6 h-6 text-blue-500" />;
      case "processing":
        return <Package className="w-6 h-6 text-orange-500" />;
      case "shipped":
        return <Truck className="w-6 h-6 text-purple-500" />;
      case "delivered":
        return <CheckCircle className="w-6 h-6 text-emerald-500" />;
      case "cancelled":
        return <Package className="w-6 h-6 text-red-500" />;
      default:
        return <Package className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "paid":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-orange-100 text-orange-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-emerald-100 text-emerald-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">{t("loadingOrderDetails")}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">
              {error || t("orderNotFound")}
            </p>
            <Link href="/orders">
              <button className="mt-4 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                {t("backToOrders")}
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8 print:py-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 print:hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/orders">
                <button className="flex items-center text-emerald-600 hover:text-emerald-700">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  {t("backToOrders")}
                </button>
              </Link>
              <div>
                <h1 className="text-3xl md:text-4xl font-light text-gray-800 tracking-wide">
                  {t("orderDetails")}
                </h1>
                <p className="text-gray-600 mt-1">
                  #{order.orderNumber} • {formatDate(order.orderedAt)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrintInvoice}
                className="flex items-center gap-2 px-4 py-2 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
              >
                <Printer className="w-5 h-5" />
                {t("printInvoice")}
              </button>
              <Link href="/shop">
                <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                  <Home className="w-5 h-5" />
                  {t("shopMore")}
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Order Status Banner */}
        <div className="mb-8 print:mb-4">
          <div
            className={`p-6 rounded-2xl ${getStatusColor(order.status)} flex items-center justify-between`}
          >
            <div className="flex items-center gap-4">
              {getStatusIcon(order.status)}
              <div>
                <h3 className="text-xl font-semibold">
                  {t("orderNumber", { number: order.orderNumber })} -{" "}
                  {t(order.status)}
                </h3>
                <p className="opacity-90">
                  {order.status === "delivered"
                    ? t("statusMessages.delivered", {
                        date: formatDate(order.deliveredAt!),
                      })
                    : order.status === "shipped"
                      ? t("statusMessages.shipped", {
                          trackingInfo: order.trackingNumber
                            ? `with tracking #${order.trackingNumber}`
                            : "",
                        })
                      : t("statusMessages.processing")}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">${order.total.toFixed(2)}</p>
              <p className="text-sm opacity-90">{t("total")}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Order Items */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 print:shadow-none print:border-0">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                {t("orderItems")}
              </h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-800">
                            {item.name}
                          </h4>
                          <p className="text-sm text-gray-500 mt-1">
                            {item.description}
                          </p>
                          <div className="flex items-center gap-4 mt-2">
                            {item.selectedColor && (
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-4 h-4 rounded-full border border-gray-300"
                                  style={{
                                    backgroundColor: item.selectedColor.hex,
                                  }}
                                />
                                <span className="text-sm text-gray-600">
                                  {item.selectedColor.name}
                                </span>
                              </div>
                            )}
                            {item.selectedSize && (
                              <span className="text-sm text-gray-600">
                                Size: {item.selectedSize}
                              </span>
                            )}
                            <span className="text-sm text-gray-600">
                              Quantity: {item.quantity}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-800">
                            ${item.price.toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500">each</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping & Payment Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2">
              {/* Shipping Address */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 print:shadow-none print:border-0">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="w-6 h-6 text-emerald-600" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    {t("shippingInfo")}
                  </h3>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-gray-800">
                    {order.shippingAddress.firstName}{" "}
                    {order.shippingAddress.lastName}
                  </p>
                  <p className="text-gray-600">
                    {order.shippingAddress.address}
                  </p>
                  <p className="text-gray-600">
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    {order.shippingAddress.zipCode}
                  </p>
                  <p className="text-gray-600">
                    {order.shippingAddress.country}
                  </p>
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{order.shippingAddress.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 mt-2">
                      <Phone className="w-4 h-4" />
                      <span>{order.shippingAddress.phone}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 print:shadow-none print:border-0">
                <div className="flex items-center gap-3 mb-4">
                  <CreditCard className="w-6 h-6 text-emerald-600" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    {t("paymentInfo")}
                  </h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">
                      {t("paymentMethod")}
                    </p>
                    <p className="font-medium text-gray-800 capitalize">
                      {order.paymentInfo.method}
                    </p>
                  </div>
                  {order.paymentInfo.cardLast4 && (
                    <div>
                      <p className="text-sm text-gray-500">{t("cardNumber")}</p>
                      <p className="font-medium text-gray-800">
                        **** **** **** {order.paymentInfo.cardLast4}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500">
                      {t("transactionId")}
                    </p>
                    <p className="font-medium text-gray-800">
                      {order.paymentInfo.transactionId}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t("paymentDate")}</p>
                    <p className="font-medium text-gray-800">
                      {formatDate(order.paymentInfo.paidAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-6 print:static print:shadow-none print:border-0">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                {t("orderSummary")}
              </h2>

              <div className="space-y-4 mb-6">
                {/* Order Info */}
                <div className="pb-4 border-b border-gray-100">
                  <div className="flex justify-between text-gray-600 mb-2">
                    <span>
                      {t("orderNumber", { number: "" }).replace(":", "")}
                    </span>
                    <span className="font-medium">{order.orderNumber}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 mb-2">
                    <span>{t("orderDate")}</span>
                    <span className="font-medium">
                      {formatDate(order.orderedAt)}
                    </span>
                  </div>
                  {order.deliveredAt && (
                    <div className="flex justify-between text-gray-600">
                      <span>
                        {t("deliveredOn", { date: "" }).replace(":", "")}
                      </span>
                      <span className="font-medium">
                        {formatDate(order.deliveredAt)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Shipping Method */}
                <div className="pb-4 border-b border-gray-100">
                  <p className="text-sm text-gray-500 mb-2">
                    {t("shippingMethod")}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-800 capitalize">
                      {order.shippingMethod}
                    </span>
                    <span className="text-emerald-600 font-medium">
                      ${order.shippingCost.toFixed(2)}
                    </span>
                  </div>
                  {order.trackingNumber && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">
                        {t("tracking")}
                      </p>
                      <code className="font-mono text-sm">
                        {order.trackingNumber}
                      </code>
                    </div>
                  )}
                </div>

                {/* Cost Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>{t("subtotal")}</span>
                    <span className="font-medium">
                      ${order.subtotal.toFixed(2)}
                    </span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>{t("discount")}</span>
                      <span className="font-medium">
                        -${order.discount.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>{t("shipping")}</span>
                    <span className="font-medium">
                      ${order.shippingCost.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>{t("tax")}</span>
                    <span className="font-medium">${order.tax.toFixed(2)}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex justify-between font-bold text-lg">
                    <span className="text-gray-800">{t("total")}</span>
                    <span className="text-emerald-600">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Notes */}
              {order.notes && (
                <div className="mt-6 p-4 bg-emerald-50 rounded-lg">
                  <p className="text-sm font-medium text-emerald-800 mb-1">
                    {t("orderNotes")}
                  </p>
                  <p className="text-sm text-emerald-700">{order.notes}</p>
                </div>
              )}

              {/* Help Section */}
              <div className="mt-8 pt-6 border-t border-gray-100 print:hidden">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  {t("needHelp")}
                </h3>
                <div className="space-y-2">
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors">
                    {t("contactSupport")}
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors">
                    {t("requestReturn")}
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors">
                    {t("viewReturnPolicy")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
