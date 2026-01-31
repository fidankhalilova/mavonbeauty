"use client";
import React, { useState, useEffect } from "react";
import {
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Truck,
  Package,
  Clock,
  Filter,
  Search,
  Download,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface OrderItem {
  _id?: string;
  productId: string;
  name: string;
  quantity: number;
  price: number;
  selectedColor?: any;
  selectedSize?: string;
  image?: string;
  description?: string;
  trackingNumber?: string; // Add this
}

interface Order {
  _id: string;
  orderNumber: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  userName: string;
  userEmail: string;
  total: number;
  status:
    | "pending"
    | "paid"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  orderedAt: string;
  shippingAddress: {
    city: string;
    country: string;
  };
  items: OrderItem[];
  trackingNumber?: string; // Add this for order-level tracking
}

const API_BASE_URL = "http://localhost:3001/api/v1";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [editingStatus, setEditingStatus] = useState<string>("");
  const [editingTracking, setEditingTracking] = useState<string>("");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("accessToken");
      if (!token) {
        router.push("/login");
        return;
      }

      const url = `${API_BASE_URL}/orders${statusFilter !== "all" ? `?status=${statusFilter}` : ""}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setOrders(data.data || []);
      } else {
        setError(data.message || "Failed to fetch orders");
      }
    } catch (error: any) {
      console.error("Error fetching orders:", error);
      setError("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string) => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: editingStatus,
          trackingNumber: editingTracking,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setOrders(
          orders.map((order) => (order._id === orderId ? data.data : order)),
        );
        setShowStatusModal(false);
        setEditingOrder(null);
        setEditingStatus("");
        setEditingTracking("");
      } else {
        alert(data.message || "Failed to update order");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Failed to update order status");
    }
  };

  const openStatusModal = (order: Order) => {
    setEditingOrder(order);
    setEditingStatus(order.status);
    setEditingTracking(order.items[0]?.trackingNumber || "");
    setShowStatusModal(true);
  };

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "paid":
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case "processing":
        return <Package className="w-4 h-4 text-orange-500" />;
      case "shipped":
        return <Truck className="w-4 h-4 text-purple-500" />;
      case "delivered":
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Package className="w-4 h-4 text-gray-500" />;
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
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userEmail.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const statusOptions = [
    { value: "pending", label: "Pending", color: "text-yellow-600" },
    { value: "paid", label: "Paid", color: "text-blue-600" },
    { value: "processing", label: "Processing", color: "text-orange-600" },
    { value: "shipped", label: "Shipped", color: "text-purple-600" },
    { value: "delivered", label: "Delivered", color: "text-emerald-600" },
    { value: "cancelled", label: "Cancelled", color: "text-red-600" },
  ];

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Loading orders...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Order Management
          </h2>
          <p className="text-gray-600 mt-1">Manage customer orders</p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-4 py-2 text-emerald-600 border border-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <XCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by order number, customer name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <label className="text-sm font-medium text-gray-700">
                Filter by status
              </label>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Orders</option>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-linear-to-r from-emerald-50 to-teal-50">
              <tr>
                <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">
                  Order #
                </th>
                <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">
                  Customer
                </th>
                <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">
                  Date
                </th>
                <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">
                  Items
                </th>
                <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">
                  Total
                </th>
                <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">
                  Status
                </th>
                <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">
                  Shipping
                </th>
                <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order._id}
                  className="border-t border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-800">
                      {order.orderNumber}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-medium text-gray-800">
                        {order.userName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.userEmail}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600">
                    {formatDate(order.orderedAt)}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">
                        {order.items.length} items
                      </span>
                      {order.items[0] && (
                        <span className="text-sm text-gray-500">
                          ({order.items[0].name} × {order.items[0].quantity})
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-bold text-emerald-600">
                      ${order.total.toFixed(2)}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600">
                    {order.shippingAddress.city},{" "}
                    {order.shippingAddress.country}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openStatusModal(order)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Update Status"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          router.push(`/admin/orders/${order._id}`)
                        }
                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No orders found</p>
            {searchTerm && (
              <p className="text-gray-400 text-sm mt-1">
                Try adjusting your search criteria
              </p>
            )}
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      {showStatusModal && editingOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4">Update Order Status</h3>
            <p className="text-gray-600 mb-2">
              Order #{editingOrder.orderNumber}
            </p>

            <div className="space-y-4 mb-6">
              {/* Status Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={editingStatus}
                  onChange={(e) => setEditingStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {statusOptions.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      className={option.color}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tracking Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tracking Number
                </label>
                <input
                  type="text"
                  value={editingTracking}
                  onChange={(e) => setEditingTracking(e.target.value)}
                  placeholder="Optional tracking number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setEditingOrder(null);
                  setEditingStatus("");
                  setEditingTracking("");
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => updateOrderStatus(editingOrder._id)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <CheckCircle className="w-5 h-5" />
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
