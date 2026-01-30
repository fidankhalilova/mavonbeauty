"use client";
import React, { useState, useEffect } from "react";
import {
  Trash2,
  Eye,
  Star,
  Filter,
  Download,
  Search,
  User,
  Package,
} from "lucide-react";

const API_BASE_URL = "http://localhost:3001/api/v1";

interface CommentUser {
  _id: string;
  name: string;
  email?: string;
}

interface CommentProduct {
  _id: string;
  name: string;
}

interface Comment {
  _id: string;
  product: CommentProduct;
  user: CommentUser;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

interface Stats {
  overall: {
    totalComments: number;
    averageRating: number;
    totalProducts: number;
    totalUsers: number;
  };
  ratingDistribution: Array<{
    star: number;
    count: number;
  }>;
}

export default function CommentsAdminPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [filter, setFilter] = useState({
    sortBy: "createdAt",
    order: "desc",
  });
  const [search, setSearch] = useState("");
  const [selectedComments, setSelectedComments] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch comments
  const fetchComments = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.append("sortBy", filter.sortBy);
      params.append("order", filter.order);

      const response = await fetch(
        `${API_BASE_URL}/comments?${params.toString()}`,
      );
      const data = await response.json();

      if (data.success) {
        setComments(data.data || []);
      } else {
        setError("Failed to fetch comments");
      }
    } catch (err) {
      setError("Error connecting to server");
      console.error("Error fetching comments:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/comments/stats/overall`);
      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  // Delete comment
  const handleDelete = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        alert("Comment deleted successfully");
        fetchComments();
        fetchStats();
      } else {
        alert(data.message || "Failed to delete comment");
      }
    } catch (err) {
      alert("Error deleting comment");
      console.error("Error:", err);
    }
  };

  // Bulk actions
  const handleBulkAction = async (action: string) => {
    if (selectedComments.length === 0) {
      alert("Please select comments first");
      return;
    }

    if (action === "delete") {
      if (!confirm(`Delete ${selectedComments.length} comment(s)?`)) return;

      try {
        const token = localStorage.getItem("accessToken");
        const promises = selectedComments.map((id) =>
          fetch(`${API_BASE_URL}/comments/${id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        );

        await Promise.all(promises);
        alert("Comments deleted successfully");
        setSelectedComments([]);
        fetchComments();
        fetchStats();
      } catch (err) {
        alert("Error deleting comments");
        console.error("Error:", err);
      }
    }
  };

  // Toggle comment selection
  const toggleCommentSelection = (commentId: string) => {
    setSelectedComments((prev) =>
      prev.includes(commentId)
        ? prev.filter((id) => id !== commentId)
        : [...prev, commentId],
    );
  };

  // Toggle all comments on current page
  const toggleAllSelection = () => {
    const currentPageComments = filteredComments
      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
      .map((comment) => comment._id);

    if (currentPageComments.every((id) => selectedComments.includes(id))) {
      // Deselect all on current page
      setSelectedComments((prev) =>
        prev.filter((id) => !currentPageComments.includes(id)),
      );
    } else {
      // Select all on current page
      setSelectedComments((prev) => [
        ...new Set([...prev, ...currentPageComments]),
      ]);
    }
  };

  // Filter and search comments
  const filteredComments = comments.filter((comment) => {
    if (!search) return true;

    const searchLower = search.toLowerCase();
    return (
      comment.comment?.toLowerCase().includes(searchLower) ||
      comment.user?.name?.toLowerCase().includes(searchLower) ||
      comment.product?.name?.toLowerCase().includes(searchLower)
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredComments.length / itemsPerPage);
  const paginatedComments = filteredComments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  useEffect(() => {
    fetchComments();
    fetchStats();
  }, [filter]);

  if (loading && comments.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Loading comments...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Comments Management
          </h2>
          <p className="text-gray-600 mt-1">
            Manage customer reviews and ratings
          </p>
        </div>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-lg font-bold text-gray-800">
                  {stats.overall.totalComments}
                </span>
              </div>
              <p className="text-sm text-gray-500">Total Comments</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Star className="w-5 h-5 text-yellow-600" />
                </div>
                <span className="text-lg font-bold text-gray-800">
                  {stats.overall.averageRating.toFixed(1)}
                </span>
              </div>
              <p className="text-sm text-gray-500">Avg. Rating</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Package className="w-5 h-5 text-emerald-600" />
                </div>
                <span className="text-lg font-bold text-gray-800">
                  {stats.overall.totalProducts}
                </span>
              </div>
              <p className="text-sm text-gray-500">Products</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <User className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-lg font-bold text-gray-800">
                  {stats.overall.totalUsers}
                </span>
              </div>
              <p className="text-sm text-gray-500">Users</p>
            </div>
          </div>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search comments, users, or products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <select
              value={filter.sortBy}
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, sortBy: e.target.value }))
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="createdAt">Date (Newest)</option>
              <option value="-createdAt">Date (Oldest)</option>
              <option value="rating">Rating (High to Low)</option>
              <option value="-rating">Rating (Low to High)</option>
            </select>

            <button
              onClick={() =>
                setFilter((prev) => ({
                  ...prev,
                  order: prev.order === "desc" ? "asc" : "desc",
                }))
              }
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {filter.order === "desc" ? "↓ Desc" : "↑ Asc"}
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedComments.length > 0 && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
            <span className="text-emerald-700 font-medium">
              {selectedComments.length} comment(s) selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction("delete")}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Selected
              </button>
              <button
                onClick={() => setSelectedComments([])}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear Selection
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Comments Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4">
                  <input
                    type="checkbox"
                    checked={
                      paginatedComments.length > 0 &&
                      paginatedComments.every((comment) =>
                        selectedComments.includes(comment._id),
                      )
                    }
                    onChange={toggleAllSelection}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500"
                  />
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">
                  Comment & Rating
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">
                  User
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">
                  Product
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">
                  Date
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedComments.map((comment) => (
                <tr
                  key={comment._id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedComments.includes(comment._id)}
                      onChange={() => toggleCommentSelection(comment._id)}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500"
                    />
                  </td>
                  <td className="p-4">
                    <div className="max-w-md">
                      <div className="flex items-center gap-2 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= comment.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className="text-sm font-medium text-gray-700">
                          {comment.rating}.0
                        </span>
                      </div>
                      <p className="text-gray-700 line-clamp-2">
                        {comment.comment}
                      </p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-linear-to-r from-emerald-400 to-teal-400 rounded-full flex items-center justify-center text-white font-semibold">
                        {comment.user?.name?.charAt(0) || "U"}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {comment.user?.name || "Anonymous"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {comment.user?.email || "No email"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Package className="w-4 h-4 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 line-clamp-1">
                          {comment.product?.name || "Unknown Product"}
                        </p>
                        <p className="text-sm text-gray-500">
                          ID: {comment.product?._id?.slice(-6) || "N/A"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-gray-700">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(comment.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDelete(comment._id)}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        title="Delete comment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <a
                        href={`/shop/${comment.product?._id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                        title="View Product"
                      >
                        <Eye className="w-4 h-4" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredComments.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>
            <p className="text-gray-500 mb-2">No comments found</p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredComments.length)} of{" "}
              {filteredComments.length} comments
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg ${
                      currentPage === pageNum
                        ? "bg-emerald-600 text-white"
                        : "border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
