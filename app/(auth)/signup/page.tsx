"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/lib/authContext";
import Link from "next/link";

export default function SignupPage() {
  const { signup, isLoading, error, clearError, user } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: ""
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      window.location.href = "/dashboard";
    }
  }, [user]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    if (!formData.password) errors.password = "Password is required";
    if (!formData.confirmPassword) errors.confirmPassword = "Please confirm your password";
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email";
    }
    
    if (formData.password && formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setSuccessMessage("");
    
    if (!validateForm()) return;
    
    const result = await signup({
      email: formData.email,
      password: formData.password,
      name: formData.name
    });
    
    if (result.success) {
      setSuccessMessage("Account created successfully! Redirecting...");
      // Reset form
      setFormData({
        email: "",
        password: "",
        confirmPassword: "",
        name: ""
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className=" flex items-center justify-center px-4 bg-gray-800">
      <div className="max-w-md w-full">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-white">Ticz</h1>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-orange-200 rounded-2xl shadow-2xl p-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-white">Create Account</h2>
          </div>

          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg backdrop-blur-sm">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-6 bg-green-500/10 border border-green-500/50 text-green-200 px-4 py-3 rounded-lg backdrop-blur-sm">
              {successMessage}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-2">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white/10 border ${formErrors.name ? 'border-red-500/50' : 'border-white/20'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition`}
                placeholder="John Doe"
              />
              {formErrors.name && (
                <p className="mt-2 text-sm text-red-400">{formErrors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white/10 border ${formErrors.email ? 'border-red-500/50' : 'border-white/20'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition`}
                placeholder="you@example.com"
              />
              {formErrors.email && (
                <p className="mt-2 text-sm text-red-400">{formErrors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white/10 border ${formErrors.password ? 'border-red-500/50' : 'border-white/20'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition`}
                placeholder="••••••••"
              />
              {formErrors.password && (
                <p className="mt-2 text-sm text-red-400">{formErrors.password}</p>
              )}
              <p className="mt-2 text-xs text-gray-400">Must be at least 6 characters</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white/10 border ${formErrors.confirmPassword ? 'border-red-500/50' : 'border-white/20'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition`}
                placeholder="••••••••"
              />
              {formErrors.confirmPassword && (
                <p className="mt-2 text-sm text-red-400">{formErrors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-orange-300 text-white/50 font-semibold rounded-lg shadow-lg hover:from-orange-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02]"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </span>
              ) : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-300">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-orange-400 hover:text-orange-300 transition">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}