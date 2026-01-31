"use client";
import React, { useState } from "react";
import { Lock, Mail, Eye, EyeOff, Shield, Sparkles, User } from "lucide-react";
import { registerUser } from "@/service/authService";
import { useRouter } from "next/navigation";

interface FormData {
  name: string;
  surname: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface Errors {
  [key: string]: string;
}

export default function BeautyRegister() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    surname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});
  const [apiError, setApiError] = useState<string>("");
  const router = useRouter();

  const handleChange = (field: keyof FormData, value: string): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
    if (apiError) setApiError("");
  };

  const handleSubmit = async (): Promise<void> => {
    const newErrors: Errors = {};

    // Frontend validation
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.surname.trim()) newErrors.surname = "Surname is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setApiError("");

    try {
      const result = await registerUser(formData);

      if (result.success) {
        // Redirect to login page or dashboard
        alert("Registration successful! Please login.");
        router.push("/login");
      } else {
        setApiError(result.message || "Registration failed. Please try again.");
      }
    } catch (err: any) {
      setApiError(err.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  //   const handleGitHubLogin = () => {
  //     const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
  //     const redirectUri = `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/github/callback`;
  //     const scope = "user:email";

  //     const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;

  //     // Redirect to GitHub OAuth
  //     window.location.href = githubAuthUrl;
  //   };

  const handleGitHubLogin = () => {
    window.location.href = "http://localhost:3001/api/v1/auth/github";
  };
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-emerald-100">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-linear-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-light text-gray-800">Beauty Store</h1>
          </div>

          <div className="mb-8 text-center">
            <h2 className="text-2xl font-medium text-gray-800 mb-2">
              Create Account
            </h2>
            <p className="text-gray-500">Sign up to get started</p>
          </div>

          {/* API Error Message */}
          {apiError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {apiError}
            </div>
          )}

          <div className="space-y-5">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Enter your name"
                  className={`w-full pl-12 pr-4 py-3 border ${errors.name ? "border-rose-300" : "border-emerald-200"} rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-300 transition-all`}
                />
              </div>
              {errors.name && (
                <p className="text-xs text-rose-500 mt-1 ml-4">{errors.name}</p>
              )}
            </div>

            {/* Surname Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Surname
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.surname}
                  onChange={(e) => handleChange("surname", e.target.value)}
                  placeholder="Enter your surname"
                  className={`w-full pl-12 pr-4 py-3 border ${errors.surname ? "border-rose-300" : "border-emerald-200"} rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-300 transition-all`}
                />
              </div>
              {errors.surname && (
                <p className="text-xs text-rose-500 mt-1 ml-4">
                  {errors.surname}
                </p>
              )}
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="you@example.com"
                  className={`w-full pl-12 pr-4 py-3 border ${errors.email ? "border-rose-300" : "border-emerald-200"} rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-300 transition-all`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-rose-500 mt-1 ml-4">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  placeholder="Create a password (min 8 characters)"
                  className={`w-full pl-12 pr-12 py-3 border ${errors.password ? "border-rose-300" : "border-emerald-200"} rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-300 transition-all`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-rose-500 mt-1 ml-4">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleChange("confirmPassword", e.target.value)
                  }
                  placeholder="Confirm your password"
                  className={`w-full pl-12 pr-12 py-3 border ${errors.confirmPassword ? "border-rose-300" : "border-emerald-200"} rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-300 transition-all`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-rose-500 mt-1 ml-4">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-linear-to-r from-emerald-500 to-teal-500 text-white py-3 rounded-full font-medium hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 mt-6"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating account...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Create Account
                </>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-emerald-100"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">
                Or sign up with
              </span>
            </div>
          </div>

          {/* Social Login (optional) */}
          <button
            onClick={handleGitHubLogin}
            className="flex items-center w-full justify-center gap-2 border border-emerald-100 rounded-full py-3 hover:bg-emerald-50 transition-colors"
          >
            <svg
              aria-hidden="true"
              className="octicon octicon-mark-github"
              height="24"
              version="1.1"
              viewBox="0 0 16 16"
              width="24"
            >
              <path
                fillRule="evenodd"
                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"
              ></path>
            </svg>
            <span className="text-sm font-medium text-gray-700">
              Continue with GitHub
            </span>
          </button>

          {/* Sign In Link */}
          <p className="text-center text-gray-600 mt-6">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Sign in
            </a>
          </p>

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 mt-6 text-sm text-gray-500">
            <Shield className="w-4 h-4" />
            <span>Secure & encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
}
