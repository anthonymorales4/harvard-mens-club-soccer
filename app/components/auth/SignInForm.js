"use client";

import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignInForm() {
  const router = useRouter();
  // Stores email and password
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  // Captures any error messages
  const [error, setError] = useState(null);
  // Tracks form submission state
  const [loading, setLoading] = useState(false);

  function handleRememberMeChange(event) {
    setRememberMe(event.target.checked);
  }

  // Updates form data as user types
  function handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // Processes form submission
  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error: signInError } =
        // Authenticates the user
        await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
          options: {
            persistSession: rememberMe,
          },
        });

      if (signInError) throw signInError;

      console.log("Signed in successfully", data);

      // Redirect to dashboard on successful sign-in
      router.push("/dashboard");
    } catch (error) {
      console.error("Error signing in", error);
      // Show error message on failure
      setError(error.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-md">
          <p>{error}</p>
        </div>
      )}

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email Address
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:border-[#A51C30]"
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <div className="mt-1">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={formData.password}
            onChange={handleChange}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:border-[#A51C30]"
          />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            checked={rememberMe}
            onChange={handleRememberMeChange}
            className="h-4 w-4 text-[#A51C30] focus:ring-[#A51C30] border-gray-300 rounded"
          />
          <label
            htmlFor="remember-me"
            className="ml-2 block text-sm text-gray-700"
          >
            Remember me
          </label>
        </div>

        <div className="text-sm">
          <a
            href="#"
            className="font-medium text-[#A51C30] hover:text-[#8a1726]"
          >
            Forgot your password?
          </a>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#A51C30] hover:bg-[#A51C30] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A51C30] ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </div>

      <div className="text-sm text-center text-gray-400">
        Don't have an account?{" "}
        <Link
          href="/signup"
          className="font-medium text-[#A51C30] hover:text-[#8a1726]"
        >
          Sign Up
        </Link>
      </div>
    </form>
  );
}
