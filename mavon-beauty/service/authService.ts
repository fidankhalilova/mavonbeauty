// service/authService.ts - ORIGINAL WORKING VERSION
const API_URL = "http://localhost:3001/api/v1/auth";

interface RegisterData {
  name: string;
  surname?: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  accessToken?: string;
  refreshToken?: string;
  user?: User;
}

// export const loginUser = async (data: LoginData): Promise<AuthResponse> => {
//   try {
//     console.log("🔵 Starting login request...");
//     console.log("📍 URL:", `${API_URL}/login`);

//     const response = await fetch(`${API_URL}/login`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         email: data.email,
//         password: data.password,
//       }),
//     });

//     console.log("✅ Response received:", response.status);

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error("❌ Error response:", errorText);

//       let errorMessage = "Login failed";
//       try {
//         const errorJson = JSON.parse(errorText);
//         errorMessage = errorJson.message || errorMessage;
//       } catch (e) {
//         // Not JSON
//       }

//       return {
//         success: false,
//         message: errorMessage,
//       };
//     }

//     const result = await response.json();
//     console.log("📄 Parsed result:", result);

//     if (result.token) {
//       localStorage.setItem("token", result.token);
//       localStorage.setItem("user", JSON.stringify(result.user));
//       console.log("💾 Token saved to localStorage");
//     }

//     return {
//       success: true,
//       message: result.message || "Login successful",
//       token: result.token,
//       user: result.user,
//     };
//   } catch (error: any) {
//     console.error("💥 Login error:", error);
//     return {
//       success: false,
//       message: error.message || "Network error",
//     };
//   }
// };

export const loginUser = async (data: LoginData): Promise<AuthResponse> => {
  try {
    console.log("🔵 LOGIN: Starting request...");

    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    });

    console.log("✅ LOGIN: Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        message: "Login failed. Please check your credentials.",
      };
    }

    const result = await response.json();
    console.log("📄 LOGIN: API Response:", result);

    if (result.success) {
      // Store tokens in localStorage
      if (result.accessToken) {
        localStorage.setItem("accessToken", result.accessToken);
        console.log("💾 Access token stored in localStorage");
      }

      if (result.refreshToken) {
        localStorage.setItem("refreshToken", result.refreshToken);
        console.log("💾 Refresh token stored in localStorage");
      }

      // Store in sessionStorage too
      if (result.accessToken) {
        sessionStorage.setItem("accessToken", result.accessToken);
      }

      if (result.refreshToken) {
        sessionStorage.setItem("refreshToken", result.refreshToken);
      }

      // Store user data
      if (result.user) {
        const userString = JSON.stringify(result.user);
        localStorage.setItem("user", userString);
        sessionStorage.setItem("user", userString);

        // Store role separately
        if (result.user.role) {
          localStorage.setItem("userRole", result.user.role);
          sessionStorage.setItem("userRole", result.user.role);
        }
      }

      return {
        success: true,
        message: result.message || "Login successful",
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        user: result.user,
      };
    } else {
      return {
        success: false,
        message: result.message || "Login failed",
      };
    }
  } catch (error: any) {
    console.error("💥 LOGIN: Network error:", error);
    return {
      success: false,
      message: "Network error. Please check your connection.",
    };
  }
};

export const registerUser = async (
  data: RegisterData,
): Promise<AuthResponse> => {
  try {
    const payload = {
      name: `${data.name} ${data.surname || ""}`.trim(),
      email: data.email,
      password: data.password,
    };

    console.log("🔵 Starting registration request...");
    console.log("📍 URL:", `${API_URL}/register`);
    console.log("📦 Payload:", { ...payload, password: "***" });

    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log("✅ Response received:", response.status, response.statusText);
    console.log(
      "📋 Response headers:",
      Object.fromEntries(response.headers.entries()),
    );

    // Check if response is ok before parsing
    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Error response:", errorText);

      let errorMessage = `Registration failed: ${response.status}`;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorMessage;
      } catch (e) {
        // Not JSON, use text
        errorMessage = errorText || errorMessage;
      }

      return {
        success: false,
        message: errorMessage,
      };
    }

    const result = await response.json();
    console.log("📄 Parsed result:", result);

    return {
      success: true,
      message: result.message || "Registration successful",
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: result.user,
    };
  } catch (error: any) {
    console.error("💥 Registration error:", error);
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);

    // More specific error messages
    let errorMessage = "Network error. Please try again.";

    if (error.name === "TypeError" && error.message.includes("fetch")) {
      errorMessage =
        "Cannot connect to server. Please ensure the backend is running on http://localhost:3001";
    } else if (error.message) {
      errorMessage = error.message;
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
};

// Helper to check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  return !!(token && user);
};

// Helper to get current user
export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};

// Helper to get token
export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

// Helper to logout
export const logoutUser = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  console.log("🗑️ All tokens and user data cleared");
};

// Simple auth check
export const checkAuth = async (): Promise<boolean> => {
  try {
    const token = getToken();
    if (!token) return false;

    const response = await fetch(`${API_URL}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error("Auth check error:", error);
    return false;
  }
};
