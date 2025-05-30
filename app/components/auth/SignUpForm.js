"use client";

import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUpForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    graduation_year: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  function handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.full_name,
          },
        },
      });

      if (error) throw error;

      if (data?.user) {
        const { error } = await supabase.from("profiles").insert({
          id: data.user.id,
          full_name: formData.full_name,
          graduation_year: parseInt(formData.graduation_year),
          email: formData.email,
          role:
            parseInt(formData.graduation_year) >= new Date().getFullYear() &&
            parseInt(formData.graduation_year) <= new Date().getFullYear() + 4
              ? "current_player"
              : "alumni",
        });

        if (error) throw error;
      }

      setSuccessMessage(
        "Account created successfully! Please check your email to confirm your account."
      );
      setTimeout(() => {
        router.push("/signin");
      }, 5000);
    } catch (error) {
      console.error("Error signing up: ", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div>
          <p>{error}</p>
        </div>
      )}
      {successMessage && (
        <div>
          <p>{successMessage}</p>
        </div>
      )}
      <div>
        <label
          htmlFor="full_name"
          className="block text-sm font-medium text-gray-700"
        >
          Full Name
        </label>
        <div className="mt-1">
          <input
            id="full_name"
            name="full_name"
            type="text"
            required
            value={formData.full_name}
            onChange={handleChange}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:border-[#A51C30] text-gray-900"
          />
        </div>
      </div>
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
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:border-[#A51C30] text-gray-900"
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
            autoComplete="new-password"
            required
            value={formData.password}
            onChange={handleChange}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:border-[#A51C30] text-gray-900"
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="graduation_year"
          className="block text-sm font-medium text-gray-700"
        >
          Graduation Year
        </label>
        <div className="mt-1">
          <input
            id="graduation_year"
            name="graduation_year"
            type="number"
            min="1950"
            max="2100"
            value={formData.graduation_year}
            onChange={handleChange}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:border-[#A51C30] text-gray-900"
          />
        </div>
      </div>
      <div className="mt-5">
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#A51C30] hover:bg-[#8a1726] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A51C30] ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>
      </div>
      <div className="mt-2 text-sm text-center text-gray-400">
        Already have an account?{" "}
        <Link
          href="/signin"
          className="font-medium text-[#A51C30] hover:text-[#A51C30]"
        >
          Sign in
        </Link>
      </div>
    </form>
  );
}
