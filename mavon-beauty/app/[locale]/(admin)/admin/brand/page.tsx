"use client";
import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
  Check,
  X,
  Award,
  Search,
} from "lucide-react";

interface Brand {
  _id: string;
  name: string;
  description?: string;
  logo?: string;
  website?: string;
  createdAt?: string;
}

const API_BASE_URL = "http://localhost:3001/api/v1";

export default function BrandPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logo: "",
    website: "",
  });
  const fetchBrands = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/brands`);
      const data = await response.json();

      if (data.success) {
        setBrands(data.data || []);
      } else {
        setError("Failed to fetch brands");
      }
    } catch (err) {
      setError("Error connecting to server");
      console.error("Error fetching brands:", err);
    } finally {
      setLoading(false);
    }
  };

  // Create brand
  const handleCreate = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/brands`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (data.success) {
        fetchBrands();
        setShowModal(false);
        setFormData({ name: "", description: "", logo: "", website: "" });
      } else {
        setError(data.message || "Failed to create brand");
      }
    } catch (err) {
      setError("Error creating brand");
      console.error("Error:", err);
    }
  };

  // Update brand
  const handleUpdate = async () => {
    if (!editingBrand) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/brands/${editingBrand._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );
      const data = await response.json();

      if (data.success) {
        fetchBrands();
        setShowModal(false);
        setEditingBrand(null);
        setFormData({ name: "", description: "", logo: "", website: "" });
      } else {
        setError(data.message || "Failed to update brand");
      }
    } catch (err) {
      setError("Error updating brand");
      console.error("Error:", err);
    }
  };

  // Delete brand
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this brand?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/brands/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (data.success) {
        fetchBrands();
      } else {
        setError(data.message || "Failed to delete brand");
      }
    } catch (err) {
      setError("Error deleting brand");
      console.error("Error:", err);
    }
  };

  // Open modal for create
  const openCreateModal = () => {
    setEditingBrand(null);
    setFormData({ name: "", description: "", logo: "", website: "" });
    setShowModal(true);
  };

  // Open modal for edit
  const openEditModal = (brand: Brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      description: brand.description || "",
      logo: brand.logo || "",
      website: brand.website || "",
    });
    setShowModal(true);
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  // Filter brands by search
  const filteredBrands = brands.filter(
    (brand) =>
      brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brand.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading && brands.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Loading brands...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Brand Management
          </h2>
          <p className="text-gray-600 mt-1">Manage product brands</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Brand
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700">{error}</span>
          <button onClick={() => setError(null)} className="ml-auto">
            <X className="w-5 h-5 text-red-500" />
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search brands..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBrands.map((brand) => (
          <div
            key={brand._id}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
          >
            {/* Logo or Placeholder */}
            <div className="flex items-start gap-4 mb-4">
              {brand.logo ? (
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="w-16 h-16 object-contain rounded-lg border border-gray-200"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.nextElementSibling?.classList.remove(
                      "hidden",
                    );
                  }}
                />
              ) : null}
              <div
                className={`w-16 h-16 bg-linear-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center ${brand.logo ? "hidden" : ""}`}
              >
                <Award className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-800">
                  {brand.name}
                </h3>
                {brand.website && (
                  <a
                    href={brand.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline"
                  >
                    Visit website
                  </a>
                )}
              </div>
            </div>

            {/* Description */}
            {brand.description && (
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {brand.description}
              </p>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t border-gray-100">
              <button
                onClick={() => openEditModal(brand)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(brand._id)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredBrands.length === 0 && !loading && (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            {searchTerm ? "No brands found" : "No brands yet"}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm
              ? "Try a different search term"
              : "Get started by adding your first brand"}
          </p>
          {!searchTerm && (
            <button
              onClick={openCreateModal}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Add Brand
            </button>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">
              {editingBrand ? "Edit Brand" : "Add New Brand"}
            </h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., MAC, Maybelline, L'Oréal"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Brief description about the brand"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo URL
                </label>
                <input
                  type="url"
                  value={formData.logo}
                  onChange={(e) =>
                    setFormData({ ...formData, logo: e.target.value })
                  }
                  placeholder="https://example.com/logo.png"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website URL
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData({ ...formData, website: e.target.value })
                  }
                  placeholder="https://brand-website.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Preview */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-3">Preview:</p>
                <div className="flex items-start gap-4">
                  {formData.logo ? (
                    <img
                      src={formData.logo}
                      alt="Preview"
                      className="w-16 h-16 object-contain rounded-lg border border-gray-200"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-16 h-16 bg-linear-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                      <Award className="w-8 h-8 text-white" />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-800">
                      {formData.name || "Brand Name"}
                    </p>
                    {formData.description && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {formData.description}
                      </p>
                    )}
                    {formData.website && (
                      <p className="text-sm text-emerald-600 mt-1">
                        {formData.website}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingBrand(null);
                  setFormData({
                    name: "",
                    description: "",
                    logo: "",
                    website: "",
                  });
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={editingBrand ? handleUpdate : handleCreate}
                disabled={!formData.name}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="w-5 h-5" />
                {editingBrand ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
