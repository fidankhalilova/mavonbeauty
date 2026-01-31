"use client";
import React, { useState, useEffect } from "react";
import {
  Package,
  CheckCircle,
  Clock,
  Truck,
  Home,
  AlertCircle,
  ExternalLink,
  Filter,
  RefreshCw,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
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
}

interface Order {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
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
    address: string;
    city: string;
    country: string;
  };
  orderedAt: string;
  deliveredAt?: string;
  trackingNumber?: string;
}

const API_BASE_URL = "http://localhost:3001/api/v1";

export default function OrdersView() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("Orders");
  const tNavbar = useTranslations("Navbar");

  useEffect(() => {
    fetchOrders();

    // Check for success message from checkout
    const success = searchParams.get("success");
    const orderId = searchParams.get("orderId");

    if (success === "true" && orderId) {
      alert(t("alertOrderSuccess", { orderId }));
      // Remove query params from URL
      router.replace("/orders");
    }
  }, [filter, router, searchParams, t]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("accessToken");
      if (!token) {
        router.push("/login");
        return;
      }

      const url = `${API_BASE_URL}/orders/my-orders${filter !== "all" ? `?status=${filter}` : ""}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setOrders(data.data || []);
      } else {
        setError(data.message || t("errorLoadingOrders"));
      }
    } catch (error: any) {
      console.error("Error fetching orders:", error);
      setError(t("errorLoadingOrders"));
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "paid":
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case "processing":
        return <Package className="w-5 h-5 text-orange-500" />;
      case "shipped":
        return <Truck className="w-5 h-5 text-purple-500" />;
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case "cancelled":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
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
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusTranslation = (status: string) => {
    return t(status as keyof typeof t);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">{t("loadingOrders")}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-light text-gray-800 tracking-wide">
                {t("pageTitle")}
              </h1>
              <p className="text-gray-600 mt-2">{t("trackManage")}</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={fetchOrders}
                className="text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                {t("refresh")}
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

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700">{error}</span>
            <button
              onClick={fetchOrders}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              {t("refresh")}
            </button>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">
              {t("filterByStatus")}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              "all",
              "pending",
              "paid",
              "processing",
              "shipped",
              "delivered",
              "cancelled",
            ].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === status
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {getStatusTranslation(status)}
                {status !== "all" && (
                  <span className="ml-1">
                    ({orders.filter((o) => o.status === status).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-2xl">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">{t("noOrdersFound")}</p>
            <p className="text-gray-400 mb-6">{t("whenPlaceOrders")}</p>
            <Link href="/shop">
              <button className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                {t("startShopping")}
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Order Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusIcon(order.status)}
                        <h3 className="text-lg font-semibold text-gray-800">
                          {t("orderNumber", { number: order.orderNumber })}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-500">
                        {t("placedOn", { date: formatDate(order.orderedAt) })}
                      </p>
                      {order.deliveredAt && (
                        <p className="text-sm text-gray-500 mt-1">
                          {t("deliveredOn", {
                            date: formatDate(order.deliveredAt),
                          })}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col sm:items-end gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                      >
                        {getStatusTranslation(order.status)}
                      </span>
                      <p className="text-lg font-bold text-emerald-600">
                        ${order.total.toFixed(2)}
                      </p>
                      <Link href={`/orders/${order._id}`}>
                        <button className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700">
                          {t("viewDetails")}
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4">
                    {order.items.slice(0, 3).map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">
                            {item.name}
                          </h4>
                          <div className="flex items-center gap-4 mt-1">
                            {item.selectedColor && (
                              <div className="flex items-center gap-1">
                                <div
                                  className="w-4 h-4 rounded-full border border-gray-300"
                                  style={{
                                    backgroundColor: item.selectedColor.hex,
                                  }}
                                  title={item.selectedColor.name}
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
                              Qty: {item.quantity}
                            </span>
                            <span className="text-sm font-medium text-gray-800">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}

                    {order.items.length > 3 && (
                      <div className="text-center text-gray-500">
                        +{order.items.length - 3} more items
                      </div>
                    )}
                  </div>

                  {/* Shipping Info */}
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">
                          {t("shippingAddress")}
                        </h4>
                        <p className="text-gray-600">
                          {order.shippingAddress.firstName}{" "}
                          {order.shippingAddress.lastName}
                          <br />
                          {order.shippingAddress.address}
                          <br />
                          {order.shippingAddress.city},{" "}
                          {order.shippingAddress.country}
                        </p>
                      </div>
                      {order.trackingNumber && (
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">
                            {t("tracking")}
                          </h4>
                          <div className="flex items-center gap-2">
                            <Truck className="w-5 h-5 text-gray-400" />
                            <code className="bg-gray-100 px-3 py-1 rounded text-sm">
                              {order.trackingNumber}
                            </code>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Summary Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      {t("items", { count: order.items.length })}
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-4">
                        <div className="text-sm">
                          <span className="text-gray-600">{t("subtotal")}</span>
                          <span className="ml-2 font-medium">
                            ${order.subtotal.toFixed(2)}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-600">{t("shipping")}</span>
                          <span className="ml-2 font-medium">
                            ${order.shippingCost.toFixed(2)}
                          </span>
                        </div>
                        <div className="text-lg font-bold text-emerald-600">
                          ${order.total.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
