"use client";
import React, { useState, useEffect } from "react";
import { Users, Package, Sparkles, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/service/authService";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface Stats {
  totalProducts: number;
  totalStock: number;
}

const API_BASE_URL = "http://localhost:3001/api/v1";

export default function DashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalStock: 0,
  });
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const accessToken =
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("accessToken");
      if (!accessToken) {
        setError("No access token found");
        return;
      }
      const response = await fetch(`${API_BASE_URL}/auth/users`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await response.json();

      if (data.success) {
        setUsers(data.data || []);
      } else {
        setError("Failed to fetch users");
      }
    } catch (err) {
      setError("Error connecting to server");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/stats`);
      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  // app/admin/page.tsx - Updated useEffect
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        // First check localStorage/sessionStorage
        const userStr =
          localStorage.getItem("user") || sessionStorage.getItem("user");
        const accessToken =
          localStorage.getItem("accessToken") ||
          sessionStorage.getItem("accessToken");

        if (!userStr || !accessToken) {
          console.log("❌ No user or token found");
          router.push("/login");
          return;
        }

        const localUser = JSON.parse(userStr);
        console.log("👑 Local user role:", localUser.role);

        if (localUser.role !== "admin") {
          console.log("❌ User is not admin");
          router.push("/");
          return;
        }

        // Verify with backend
        console.log("🔐 Verifying token with backend...");
        const response = await fetch("http://localhost:3001/api/v1/auth/user", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        console.log("✅ Response status:", response.status);

        if (response.ok) {
          const data = await response.json();
          console.log("✅ Backend response:", data);

          if (data.success && data.user) {
            // Update local storage with fresh data
            localStorage.setItem("user", JSON.stringify(data.user));
            sessionStorage.setItem("user", JSON.stringify(data.user));
            setUser(data.user);
          } else {
            setUser(localUser);
          }
        } else {
          console.log("❌ Token verification failed");

          // Try to refresh token
          const refreshToken =
            localStorage.getItem("refreshToken") ||
            sessionStorage.getItem("refreshToken");

          if (refreshToken) {
            console.log("🔄 Attempting token refresh...");
            const refreshResponse = await fetch(
              "http://localhost:3001/api/v1/auth/refresh-token",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ refreshToken }),
              },
            );

            if (refreshResponse.ok) {
              const refreshData = await refreshResponse.json();
              console.log("🔄 Token refresh successful");

              // Store new tokens
              localStorage.setItem("accessToken", refreshData.accessToken);
              sessionStorage.setItem("accessToken", refreshData.accessToken);

              if (refreshData.user) {
                localStorage.setItem("user", JSON.stringify(refreshData.user));
                sessionStorage.setItem(
                  "user",
                  JSON.stringify(refreshData.user),
                );
                setUser(refreshData.user);
              } else {
                setUser(localUser);
              }
            } else {
              console.log("❌ Token refresh failed");
              router.push("/login");
            }
          } else {
            console.log("❌ No refresh token available");
            router.push("/login");
          }
        }
      } catch (error) {
        console.error("Admin check error:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [router]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Users</p>
              <p className="text-3xl font-semibold text-gray-800 mt-2">
                {users.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-linear-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Products</p>
              <p className="text-3xl font-semibold text-gray-800 mt-2">
                {stats.totalProducts}
              </p>
            </div>
            <div className="w-12 h-12 bg-linear-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Stock</p>
              <p className="text-3xl font-semibold text-gray-800 mt-2">
                {stats.totalStock}
              </p>
            </div>
            <div className="w-12 h-12 bg-linear-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
