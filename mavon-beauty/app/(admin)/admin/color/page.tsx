"use client";
import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, AlertCircle, Check, X } from "lucide-react";

interface Color {
  _id: string;
  name: string;
  hexCode: string;
  createdAt?: string;
}
const API_BASE_URL = "http://localhost:3001/api/v1";
export default function ColorPage() {
  const [colors, setColors] = useState<Color[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingColor, setEditingColor] = useState<Color | null>(null);
  const [formData, setFormData] = useState({ name: "", hexCode: "#000000" });

  const fetchColors = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/colors`);
      const data = await response.json();

      if (data.success) {
        setColors(data.data || []);
      } else {
        setError("Failed to fetch colors");
      }
    } catch (err) {
      setError("Error connecting to server");
      console.error("Error fetching colors:", err);
    } finally {
      setLoading(false);
    }
  };

  // Create color
  const handleCreate = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/colors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (data.success) {
        fetchColors();
        setShowModal(false);
        setFormData({ name: "", hexCode: "#000000" });
      } else {
        setError(data.message || "Failed to create color");
      }
    } catch (err) {
      setError("Error creating color");
      console.error("Error:", err);
    }
  };

  // Update color
  const handleUpdate = async () => {
    if (!editingColor) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/colors/${editingColor._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );
      const data = await response.json();

      if (data.success) {
        fetchColors();
        setShowModal(false);
        setEditingColor(null);
        setFormData({ name: "", hexCode: "#000000" });
      } else {
        setError(data.message || "Failed to update color");
      }
    } catch (err) {
      setError("Error updating color");
      console.error("Error:", err);
    }
  };

  // Delete color
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this color?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/colors/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (data.success) {
        fetchColors();
      } else {
        setError(data.message || "Failed to delete color");
      }
    } catch (err) {
      setError("Error deleting color");
      console.error("Error:", err);
    }
  };

  // Open modal for create
  const openCreateModal = () => {
    setEditingColor(null);
    setFormData({ name: "", hexCode: "#000000" });
    setShowModal(true);
  };

  // Open modal for edit
  const openEditModal = (color: Color) => {
    setEditingColor(color);
    setFormData({ name: color.name, hexCode: color.hexCode });
    setShowModal(true);
  };

  useEffect(() => {
    fetchColors();
  }, []);

  if (loading && colors.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Loading colors...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Color Management
          </h2>
          <p className="text-gray-600 mt-1">Manage product colors</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Color
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

      {/* Colors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {colors.map((color) => (
          <div
            key={color._id}
            className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-12 h-12 rounded-lg border-2 border-gray-300 shadow-sm"
                style={{ backgroundColor: color.hexCode }}
              ></div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{color.name}</h3>
                <p className="text-sm text-gray-500 font-mono">
                  {color.hexCode}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => openEditModal(color)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(color._id)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {colors.length === 0 && !loading && (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            No colors yet
          </h3>
          <p className="text-gray-600 mb-4">
            Get started by adding your first color
          </p>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Add Color
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4">
              {editingColor ? "Edit Color" : "Add New Color"}
            </h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Red, Blue, Green"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hex Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.hexCode}
                    onChange={(e) =>
                      setFormData({ ...formData, hexCode: e.target.value })
                    }
                    className="w-16 h-10 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.hexCode}
                    onChange={(e) =>
                      setFormData({ ...formData, hexCode: e.target.value })
                    }
                    placeholder="#000000"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>

              {/* Preview */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">Preview:</p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-16 h-16 rounded-lg border-2 border-gray-300 shadow-sm"
                    style={{ backgroundColor: formData.hexCode }}
                  ></div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {formData.name || "Color Name"}
                    </p>
                    <p className="text-sm text-gray-500 font-mono">
                      {formData.hexCode}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingColor(null);
                  setFormData({ name: "", hexCode: "#000000" });
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={editingColor ? handleUpdate : handleCreate}
                disabled={!formData.name || !formData.hexCode}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="w-5 h-5" />
                {editingColor ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
