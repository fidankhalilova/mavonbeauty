// utils/api.ts
const API_URL = "http://localhost:3001/api/v1";

export const authFetch = async (
  endpoint: string,
  options: RequestInit = {},
) => {
  const accessToken =
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("No access token found");
  }

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
    ...options.headers,
  };

  return fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include", // Include cookies if using them
  });
};

// Specific function to get current user
export const getCurrentUser = async () => {
  try {
    const response = await authFetch("/auth/user");

    if (response.status === 401) {
      // Token might be expired, try to refresh
      const refreshToken =
        localStorage.getItem("refreshToken") ||
        sessionStorage.getItem("refreshToken");

      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      // Try to refresh token
      const refreshResponse = await fetch(`${API_URL}/auth/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();

        if (refreshData.accessToken) {
          // Store new token
          localStorage.setItem("accessToken", refreshData.accessToken);
          sessionStorage.setItem("accessToken", refreshData.accessToken);

          // Retry the user request with new token
          const newResponse = await fetch(`${API_URL}/auth/user`, {
            headers: {
              Authorization: `Bearer ${refreshData.accessToken}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
          });

          if (newResponse.ok) {
            return await newResponse.json();
          }
        }
      }

      throw new Error("Authentication failed");
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to get current user:", error);
    throw error;
  }
};
