"use client";
import { useState, useEffect } from "react";
import { Lock, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function ResetPasswordView() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [verifyingToken, setVerifyingToken] = useState(true);

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const t = useTranslations("Auth");

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setTokenValid(false);
        setVerifyingToken(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:3001/api/v1/auth/verify-reset-token?token=${token}`,
        );

        if (!response.ok) {
          throw new Error("Token verification failed");
        }

        const data = await response.json();
        setTokenValid(data.success);
      } catch (err) {
        console.error("Token verification error:", err);
        setTokenValid(false);
      } finally {
        setVerifyingToken(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!token) {
      setError(t("errors.invalidLink"));
      return;
    }

    if (password !== confirmPassword) {
      setError(t("errors.passwordsMatch"));
      return;
    }

    if (password.length < 8) {
      setError(t("errors.passwordRequired"));
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        "http://localhost:3001/api/v1/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, password }),
        },
      );

      const data = await response.json();

      if (data.success) {
        setMessage(t("messages.passwordResetSuccess"));
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        setError(data.message || t("errors.networkError"));
      }
    } catch (err) {
      setError(t("errors.networkError"));
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while verifying token
  if (verifyingToken) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-emerald-100 text-center">
            <Loader2 className="w-16 h-16 text-emerald-500 mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl font-medium text-gray-800 mb-2">
              {t("verifyingLink")}
            </h2>
            <p className="text-gray-600 mb-6">{t("verifyingLinkDesc")}</p>
          </div>
        </div>
      </div>
    );
  }

  // Token invalid or expired
  if (tokenValid === false) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-red-100 text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-medium text-gray-800 mb-2">
              {t("invalidLink")}
            </h2>
            <p className="text-gray-600 mb-6">{t("invalidLinkDesc")}</p>
            <Link
              href="/forgot-password"
              className="inline-block bg-emerald-500 text-white px-6 py-3 rounded-full font-medium hover:bg-emerald-600 transition-colors"
            >
              {t("requestNewLink")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Show the reset form if token is valid
  if (tokenValid === true) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-emerald-100">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-medium text-gray-800 mb-2">
                {t("resetPassword")}
              </h2>
              <p className="text-gray-500">{t("resetPasswordDesc")}</p>
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
                  {t("newPassword")}
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t("enterPasswordPlaceholder")}
                    className="w-full pl-12 pr-4 py-3 border border-emerald-200 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-300 transition-all"
                    required
                    minLength={8}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1 ml-4">
                  {t("min8Chars")}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("confirmNewPassword")}
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={t("confirmPasswordPlaceholder")}
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
                    {t("resetting")}
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    {t("resetPassword")}
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {t("rememberPassword")}{" "}
                <Link
                  href="/login"
                  className="text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  {t("signIn")}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback
  return null;
}
