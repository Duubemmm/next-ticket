"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/lib/authContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login, isLoading, error, clearError, user } = useAuth();
  const router = useRouter();

  const [credentials, setCredentials] = useState(() => {
    if (typeof window !== "undefined") {
      const savedEmail = localStorage.getItem("remembered_email");
      return {
        email: savedEmail || "",
        password: "",
      };
    }
    return { email: "", password: "" };
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [rememberMe, setRememberMe] = useState(() => {
    if (typeof window !== "undefined") {
      return !!localStorage.getItem("remembered_email");
    }
    return false;
  });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!credentials.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!credentials.password) {
      errors.password = "Password is required";
    } else if (credentials.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) return;

    // Save email to localStorage if "remember me" is checked
    if (typeof window !== "undefined") {
      if (rememberMe) {
        localStorage.setItem("remembered_email", credentials.email);
      } else {
        localStorage.removeItem("remembered_email");
      }
    }

    await login(credentials);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Clear general error when user starts typing
    if (error) {
      clearError();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-800">
      <div className="max-w-md w-full">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-white">Consartz</h1>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-white">Welcome Back!</h2>
           
          </div>

          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg backdrop-blur-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-200 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={credentials.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white/10 border ${
                  formErrors.email ? "border-red-500/50" : "border-white/20"
                } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition`}
                placeholder="you@example.com"
              />
              {formErrors.email && (
                <p className="mt-2 text-sm text-red-400">{formErrors.email}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-200"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-sm text-orange-400 hover:text-orange-300 transition"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={credentials.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white/10 border ${
                  formErrors.password ? "border-red-500/50" : "border-white/20"
                } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition`}
                placeholder="••••••••"
              />
              {formErrors.password && (
                <p className="mt-2 text-sm text-red-400">
                  {formErrors.password}
                </p>
              )}
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-orange-500 focus:ring-orange-500 bg-white/10 border-white/20 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-300"
              >
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-orange-500 text-white font-semibold rounded-lg shadow-lg hover:from-orange-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02]"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-300">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-medium text-orange-400 hover:text-orange-300 transition"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
