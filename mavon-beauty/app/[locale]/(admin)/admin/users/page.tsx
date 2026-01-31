"use client";
import React, { useState, useEffect } from "react";
import { Edit2, Trash2, AlertCircle, Shield, User, Eye } from "lucide-react";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

const API_BASE_URL = "http://localhost:3001/api/v1";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("user");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<string>("");

  // Check current user's role on mount
  useEffect(() => {
    const checkCurrentUser = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/user`, {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setCurrentUserRole(data.user?.role || "user");
        }
      } catch (err) {
        console.error("Error fetching current user:", err);
      }
    };
    checkCurrentUser();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/auth/users`, {
        credentials: "include",
      });

      console.log("Response status:", response.status);

      if (response.status === 403) {
        throw new Error("Access denied. Admin privileges required.");
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Full API response:", data);

      if (data.userList) {
        setUsers(data.userList);
      } else if (data.data) {
        setUsers(data.data);
      } else if (Array.isArray(data)) {
        setUsers(data);
      } else {
        setError("Invalid response format from server");
      }
    } catch (err: any) {
      console.error("Error fetching users:", err);
      setError(err.message || "Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/users/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json();

      if (data.success) {
        setUsers(users.filter((u) => u._id !== id));
      } else {
        alert(data.message || "Failed to delete user");
      }
    } catch (err) {
      alert("Error deleting user");
      console.error("Error:", err);
    }
  };

  const openRoleModal = (user: User) => {
    setSelectedUser(user);
    setSelectedRole(user.role);
    setShowRoleModal(true);
  };

  const updateUserRole = async () => {
    if (!selectedUser || !selectedRole) return;

    setUpdateLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/users/${selectedUser._id}/role`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ role: selectedRole }),
        },
      );

      const data = await response.json();

      if (data.success) {
        // Update the user in the local state
        setUsers(
          users.map((user) =>
            user._id === selectedUser._id
              ? { ...user, role: selectedRole }
              : user,
          ),
        );
        setShowRoleModal(false);
        setSelectedUser(null);
      } else {
        alert(data.message || "Failed to update role");
      }
    } catch (err) {
      alert("Error updating role");
      console.error("Error:", err);
    } finally {
      setUpdateLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="w-3 h-3" />;
      case "editor":
        return <Edit2 className="w-3 h-3" />;
      default:
        return <User className="w-3 h-3" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "editor":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
    }
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrator";
      case "editor":
        return "Editor";
      default:
        return "User";
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Loading users...</p>
      </div>
    );
  }

  if (error?.includes("Access denied")) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <Shield className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Access Denied
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          You need administrator privileges to access this page.
        </p>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
          <p className="text-gray-600 mt-1">
            Manage user accounts and permissions
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full">
          <Shield className="w-4 h-4" />
          <span className="text-sm font-medium">
            Your role: {getRoleName(currentUserRole)}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-linear-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Name
                </th>
                <th className="px6 py-4 text-left text-sm font-medium text-gray-700">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Role
                </th>
                <th className="px-6 py-4 text-center text-sm font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user, idx) => (
                  <tr
                    key={user._id}
                    className={idx > 0 ? "border-t border-emerald-50" : ""}
                  >
                    <td className="px-6 py-4 text-gray-800">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-medium">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        {user.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 border rounded-full text-sm font-medium flex items-center gap-1 ${getRoleColor(
                            user.role,
                          )}`}
                        >
                          {getRoleIcon(user.role)}
                          {getRoleName(user.role)}
                        </span>
                        {user.role === "admin" && (
                          <span className="text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
                            Full Access
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openRoleModal(user)}
                          disabled={currentUserRole !== "admin"}
                          className={`p-2 rounded-lg transition-colors flex items-center gap-1 ${
                            currentUserRole === "admin"
                              ? "hover:bg-blue-50 text-blue-600"
                              : "opacity-50 cursor-not-allowed text-gray-400"
                          }`}
                          title={
                            currentUserRole === "admin"
                              ? "Edit role"
                              : "Admin only"
                          }
                        >
                          <Shield className="w-4 h-4" />
                          <span className="text-xs">Edit Role</span>
                        </button>
                        <button
                          onClick={() => deleteUser(user._id)}
                          disabled={
                            currentUserRole !== "admin" || user.role === "admin"
                          }
                          className={`p-2 rounded-lg transition-colors ${
                            currentUserRole === "admin" && user.role !== "admin"
                              ? "hover:bg-rose-50 text-rose-600"
                              : "opacity-50 cursor-not-allowed text-gray-400"
                          }`}
                          title={
                            user.role === "admin"
                              ? "Cannot delete admin"
                              : currentUserRole !== "admin"
                                ? "Admin only"
                                : "Delete user"
                          }
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Edit Modal */}
      {showRoleModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-lg font-bold">
                {selectedUser.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Edit User Role
                </h3>
                <p className="text-gray-600">{selectedUser.email}</p>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Role
              </label>
              <div className="space-y-2">
                {["user", "editor", "admin"].map((role) => (
                  <label
                    key={role}
                    className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedRole === role
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full border-2 ${
                          selectedRole === role
                            ? "border-purple-500 bg-purple-500"
                            : "border-gray-300"
                        }`}
                      />
                      <div className="flex items-center gap-2">
                        {getRoleIcon(role)}
                        <span className="font-medium">{getRoleName(role)}</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {role === "admin" && "Full access"}
                      {role === "editor" && "Edit access"}
                      {role === "user" && "Basic access"}
                    </div>
                    <input
                      type="radio"
                      name="role"
                      value={role}
                      checked={selectedRole === role}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="hidden"
                    />
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Role Permissions:
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                  <span>
                    <strong>Admin:</strong> Full system access
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                  <span>
                    <strong>Editor:</strong> Can edit content, no user
                    management
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                  <span>
                    <strong>User:</strong> Basic access only
                  </span>
                </li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRoleModal(false);
                  setSelectedUser(null);
                }}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={updateUserRole}
                disabled={updateLoading || selectedUser.role === selectedRole}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updateLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Updating...
                  </>
                ) : (
                  "Update Role"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
