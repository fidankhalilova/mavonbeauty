const API_URL = "http://localhost:3001/api/v1/auth";

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  surname?: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    _id: string;
    name: string;
    email: string;
  };
}

export const loginUser = async (data: LoginData): Promise<AuthResponse> => {
  try {
    console.log("🔵 Starting login request...");
    console.log("📍 URL:", `${API_URL}/login`);

    const response = await fetch(`${API_URL}/login`, {
      // Fixed URL
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    });

    console.log("✅ Response received:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Error response:", errorText);

      let errorMessage = "Login failed";
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorMessage;
      } catch (e) {
        // Not JSON
      }

      return {
        success: false,
        message: errorMessage,
      };
    }

    const result = await response.json();
    console.log("📄 Parsed result:", result);

    if (result.token) {
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));
      console.log("💾 Token saved to localStorage");
    }

    return {
      success: true,
      message: result.message || "Login successful",
      token: result.token,
      user: result.user,
    };
  } catch (error: any) {
    console.error("💥 Login error:", error);
    return {
      success: false,
      message: error.message || "Network error",
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
      token: result.token,
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

export const logoutUser = () => {
  // Clear localStorage
  localStorage.removeItem("token");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");

  // Clear sessionStorage
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("refreshToken");
  sessionStorage.removeItem("user");

  // Clear cookies (if you set them)
  document.cookie.split(";").forEach((cookie) => {
    const [name] = cookie.trim().split("=");
    if (name.includes("token") || name.includes("auth")) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
  });

  console.log("All tokens cleared from storage");
};

export const getCurrentUser = () => {
  const userStr =
    sessionStorage.getItem("user") || localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

export const isAuthenticated = () => {
  return !!getToken();
};

// Test connection function
export const testConnection = async () => {
  try {
    console.log("🔍 Testing connection to backend...");
    const testUrl = `http://localhost:3001/api/test`;
    console.log("📍 Test URL:", testUrl);

    const response = await fetch(testUrl, {
      method: "GET",
    });

    console.log("✅ Test response:", response.status);

    const result = await response.json();
    console.log("📄 Test result:", result);

    return {
      success: true,
      message: result.message || "Connection successful",
    };
  } catch (error: any) {
    console.error("💥 Connection test failed:", error);
    return {
      success: false,
      message: error.message || "Cannot connect to server",
    };
  }
};

export const handleGithubCallback = (token: any, userData: any) => {
  // Store token in both storage types
  localStorage.setItem("token", token);
  sessionStorage.setItem("token", token);

  // Store user data
  localStorage.setItem("user", JSON.stringify(userData));
  sessionStorage.setItem("user", JSON.stringify(userData));

  return { success: true, user: userData };
};

export const getToken = () => {
  // Try to get token from sessionStorage first, then localStorage
  return sessionStorage.getItem("token") || localStorage.getItem("token");
};

export const getRefreshToken = () => {
  return (
    sessionStorage.getItem("refreshToken") ||
    localStorage.getItem("refreshToken")
  );
};
