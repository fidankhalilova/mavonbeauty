"use client";
import { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordView() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        "http://localhost:3001/api/v1/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        },
      );

      const data = await response.json();

      if (data.success) {
        setMessage(data.message);
        setEmail("");
      } else {
        setError(data.message || "Failed to send reset link");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-emerald-100">
          {/* Back Button */}
          <Link
            href="/login"
            className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Login</span>
          </Link>

          <div className="mb-8 text-center">
            <h2 className="text-2xl font-medium text-gray-800 mb-2">
              Forgot Password
            </h2>
            <p className="text-gray-500">
              Enter your email to receive a password reset link
            </p>
          </div>

          {/* Success Message */}
          {message && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-sm">
              {message}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3 border border-emerald-200 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-300 transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-linear-to-r from-emerald-500 to-teal-500 text-white py-3 rounded-full font-medium hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  Send Reset Link
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Remember your password?{" "}
              <Link
                href="/login"
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
