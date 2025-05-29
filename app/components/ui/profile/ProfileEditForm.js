"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import ProfileSection from "./ProfileSection";

export default function ProfileEditForm({ profile, onCancel, onUpdate }) {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    graduation_year: "",
    position: "",
    hometown: "",
    concentration: "",
    house: "",
    final_club: "",
    current_job: "",
    current_company: "",
    current_location: "",
    board_position: "",
    bio: "",
    linkedin_url: "",
    instagram_url: "",
    profile_image_url: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        email: profile.email || "",
        phone_number: profile.phone_number || "",
        graduation_year: profile.graduation_year || "",
        position: profile.position || "",
        hometown: profile.hometown || "",
        concentration: profile.concentration || "",
        house: profile.house || "",
        final_club: profile.final_club || "",
        current_job: profile.current_job || "",
        current_company: profile.current_company || "",
        current_location: profile.current_location || "",
        board_position: profile.board_position || "",
        bio: profile.bio || "",
        linkedin_url: profile.linkedin_url || "",
        instagram_url: profile.instagram_url || "",
        profile_image_url: profile.profile_image_url || "",
      });
    }
  }, [profile]);

  function validatePhoneNumber(phone) {
    if (!phone) return true;
    const digitsOnly = phone.replace(/\D/g, "");

    if (digitsOnly.length === 10) return true;
    return false;
  }

  function validateLinkedInUrl(url) {
    if (!url) return true;

    const linkedinRegex =
      /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9\-_.%]+\/?(\?.*)?$/;
    return linkedinRegex.test(url);
  }

  function validateInstagramUrl(url) {
    if (!url) return true;

    const instagramRegex =
      /^https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9._]+\/?(?:\?.*)?$/;
    return instagramRegex.test(url);
  }

  function validateField(name, value) {
    const errors = { ...validationErrors };

    switch (name) {
      case "phone_number":
        if (!validatePhoneNumber(value)) {
          errors.phone_number = "Please enter a valid phone number";
        } else {
          delete errors.phone_number;
        }
        break;

      case "linkedin_url":
        if (!validateLinkedInUrl(value)) {
          errors.linkedin_url = "Please enter a valid LinkedIn URL";
        } else {
          delete errors.linkedin_url;
        }
        break;

      case "instagram_url":
        if (!validateInstagramUrl(value)) {
          errors.instagram_url = "Please enter a valid Instagram URL";
        } else {
          delete errors.instagram_url;
        }
        break;

      default:
        break;
    }

    setValidationErrors(errors);
  }

  function formatPhoneNumber(phone) {
    if (!phone) return "";

    const digitsOnly = phone.replace(/\D/g, "");

    if (digitsOnly.length === 10) {
      return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(
        3,
        6
      )}-${digitsOnly.slice(6)}`;
    } else if (digitsOnly.length === 11 && digitsOnly[0] === "1") {
      return `+1 (${digitsOnly.slice(1, 4)}) ${digitsOnly.slice(
        4,
        7
      )}-${digitsOnly.slice(7)}`;
    }
    return phone;
  }

  function handleChange(event) {
    const name = event.target.name;
    let value = event.target.value;

    if (name === "phone_number") {
      value = formatPhoneNumber(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    validateField(name, value);
  }

  function handleBlur(event) {
    const name = event.target.name;
    const value = event.target.value;
    validateField(name, value);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    if (Object.keys(validationErrors).length > 0) {
      setError(
        "Please make sure all fields are formatted properly before submitting"
      );
      setIsLoading(false);
    }

    try {
      const savedData = {
        ...formData,
        graduation_year: formData.graduation_year
          ? parseInt(formData.graduation_year)
          : null,
      };

      const { error } = await supabase
        .from("profiles")
        .update(savedData)
        .eq("id", profile.id);

      if (error) throw error;

      const completedFields = Object.values(savedData).filter(Boolean).length;
      const totalNumFields = profile.role === "alumni" ? 9 : 6;

      if (completedFields === totalNumFields) {
        await supabase
          .from("profiles")
          .update({ profile_completed: true })
          .eq("id", profile.id);
      }

      setSuccess(true);
      setValidationErrors({});

      if (onUpdate) {
        onUpdate({
          ...profile,
          ...savedData,
        });
      }
    } catch (error) {
      console.error("Error updating profile: ", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  if (!profile) return null;

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-50 p-4 rounded-md text-red-700">
          <p>{error}</p>
        </div>
      )}
      {success && (
        <div className="bg-green-50 p-4 rounded-md text-green-700">
          <p>Profile updated successfully!</p>
        </div>
      )}
      <div className="mt-6">
        <ProfileSection title="About Me">
          <div>
            <textarea
              name="bio"
              id="bio"
              rows={4}
              value={formData.bio}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#A51C30] focus:ring-[#A51C30]"
              placeholder="Tell us about yourself..."
            />
          </div>
        </ProfileSection>
      </div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProfileSection title="Personal Information">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="position"
                className="block text-sm font-medium text-gray-700"
              >
                Position
              </label>
              <input
                type="text"
                name="position"
                id="position"
                value={formData.position}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#A51C30] focus:ring-[#A51C30] sm:text-sm"
                placeholder="e.g., Defender"
              />
            </div>
            <div>
              <label
                htmlFor="board_position"
                className="block text-sm font-medium text-gray-700"
              >
                Board Position
              </label>
              <input
                type="text"
                name="board_position"
                id="board_position"
                value={formData.board_position}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#A51C30] focus:ring-[#A51C30] sm:text-sm"
                placeholder="e.g., Captain"
              />
            </div>

            <div>
              <label
                htmlFor="house"
                className="block text-sm font-medium text-gray-700"
              >
                House
              </label>
              <input
                type="text"
                name="house"
                id="house"
                value={formData.house}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#A51C30] focus:ring-[#A51C30] sm:text-sm"
                placeholder="e.g., Kirkland House"
              />
            </div>
            <div>
              <label
                htmlFor="concentration"
                className="block text-sm font-medium text-gray-700"
              >
                Concentration
              </label>
              <input
                type="text"
                name="concentration"
                id="concentration"
                value={formData.concentration}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#A51C30] focus:ring-[#A51C30] sm:text-sm"
                placeholder="e.g., Computer Science"
              />
            </div>
            <div>
              <label
                htmlFor="hometown"
                className="block text-sm font-medium text-gray-700"
              >
                Hometown
              </label>
              <input
                type="text"
                name="hometown"
                id="hometown"
                value={formData.hometown}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#A51C30] focus:ring-[#A51C30] sm:text-sm"
                placeholder="e.g., Bay Shore, NY"
              />
            </div>
            <div>
              <label
                htmlFor="final_club"
                className="block text-sm font-medium text-gray-700"
              >
                Final Club
              </label>
              <input
                type="text"
                name="final_club"
                id="final_club"
                value={formData.final_club}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#A51C30] focus:ring-[#A51C30] sm:text-sm"
                placeholder="e.g., Sab Club"
              />
            </div>
          </div>
        </ProfileSection>
        <ProfileSection title="Contact Information">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#A51C30] focus:ring-[#A51C30] sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="phone_number"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <input
                type="tel"
                name="phone_number"
                id="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                onBlur={handleBlur}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#A51C30] focus:ring-[#A51C30] sm:text-sm"
                placeholder="e.g., (347) 891-6780"
              />
              {validationErrors.phone_number && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors.phone_number}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="instagram_url"
                className="block text-sm font-medium text-gray-700"
              >
                Instagram
              </label>
              <input
                type="url"
                name="instagram_url"
                id="instagram_url"
                value={formData.instagram_url}
                onChange={handleChange}
                onBlur={handleBlur}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#A51C30] focus:ring-[#A51C30] sm:text-sm"
                placeholder="e.g., https://www.instagram.com/anthonymorales._"
              />
              {validationErrors.instagram_url && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors.instagram_url}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="linkedin_url"
                className="block text-sm font-medium text-gray-700"
              >
                LinkedIn
              </label>
              <input
                type="url"
                name="linkedin_url"
                id="linkedin_url"
                value={formData.linkedin_url}
                onChange={handleChange}
                onBlur={handleBlur}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#A51C30] focus:ring-[#A51C30] sm:text-sm"
                placeholder="https://www.linkedin.com/in/anthony-morales/"
              />
              {validationErrors.linkedin_url && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors.linkedin_url}
                </p>
              )}
            </div>
          </div>
        </ProfileSection>
      </div>
      {profile.role === "alumni" && (
        <div className="mt-6">
          <ProfileSection title="Career Information">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="current_job"
                  className="block text-sm font-medium text-gray-700"
                >
                  Current Position
                </label>
                <input
                  type="text"
                  name="current_job"
                  id="current_job"
                  value={formData.current_job}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#A51C30] focus:ring-[#A51C30] sm:text-sm"
                  placeholder="e.g., Software Engineer"
                />
              </div>
              <div>
                <label
                  htmlFor="current_company"
                  className="block text-sm font-medium text-gray-700"
                >
                  Current Company
                </label>
                <input
                  type="text"
                  name="current_company"
                  id="current_company"
                  value={formData.current_company}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#A51C30] focus:ring-[#A51C30] sm:text-sm"
                  placeholder="e.g., Goldman Sachs"
                />
              </div>
              <div>
                <label
                  htmlFor="current_location"
                  className="block text-sm font-medium text-gray-700"
                >
                  Current Location
                </label>
                <input
                  type="text"
                  name="current_location"
                  id="current_location"
                  value={formData.current_location}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#A51C30] focus:ring-[#A51C30] sm:text-sm"
                  placeholder="e.g., New York, NY"
                />
              </div>
            </div>
          </ProfileSection>
        </div>
      )}
      <div className="mt-6 flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A51C30]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#A51C30] hover:bg-[#8a1726] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A51C30] disabled:opacity-50"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
