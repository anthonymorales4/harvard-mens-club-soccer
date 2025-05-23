"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "@/lib/supabase";
import Navbar from "../components/layout/Navbar";
import ProfileHeader from "../components/ui/profile/ProfileHeader";
import ProfileCompletionBar from "../components/ui/profile/ProfileCompletionBar";
import AboutMeCard from "../components/ui/profile/AboutMeCard";
import PersonalInfoCard from "../components/ui/profile/PersonalInfoCard";
import ContactInfoCard from "../components/ui/profile/ContactInfoCard";
import CareerInfoCard from "../components/ui/profile/CareerInfoCard";
import ProfileEditForm from "../components/ui/profile/ProfileEditForm";

export default function ProfilePage() {
  // State for profile data and edit mode
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);

  // Get user from AuthContext
  const { user } = useAuth();

  // Fetch profile data on component mount
  useEffect(() => {
    async function fetchProfileData() {
      if (!user?.id) return;

      try {
        setIsLoading(true);
        setError(null);

        // Query the profiles table for the current user
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        // Update state with profile data
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to load profile data. Please try again");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfileData();
  }, [user]);

  // Calculate profile completion percentage
  function calculateProfileCompletion() {
    if (!profile) return 0;

    // Define fields that count towards completion
    const fields = [
      "full_name",
      "email",
      "graduation_year",
      "profile_image_url",
      "position",
      "bio",
      "house",
      "concentration",
      "hometown",
      "phone_number",
    ];

    // Add career fields for alumni
    if (profile.role === "alumni") {
      fields.push("current_job, current_location");
    }

    // Count completed fields
    const completedFields = fields.filter((field) => profile[field]);

    return Math.round((completedFields.length / fields.length) * 100);
  }

  // Toggle edit mode
  function handleToggleEdit() {
    setIsEditing(!isEditing);
  }

  // Handle profile update
  function handleProfileUpdate(updatedProfile) {
    setProfile(updatedProfile);
    setIsEditing(false);
  }

  // Render loading state
  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A51C30]"></div>
        </div>
      </>
    );
  }

  // Render error state
  if (error) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
          <div className="bg-red-50 p-4 rounded-md text-red-700">
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 bg-red-100 px-4 py-2 rounded-md hover:bg-red-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  const profileCompletionPercentage = calculateProfileCompletion();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Header */}
          <ProfileHeader
            profile={profile}
            isEditing={isEditing}
            onEditClick={handleToggleEdit}
          />

          {/* Profile Completion */}
          <div className="mt-6">
            <ProfileCompletionBar
              percentage={profileCompletionPercentage}
              profile={profile}
            />
          </div>

          {isEditing ? (
            // Edit mode
            <div>
              <ProfileEditForm
                profile={profile}
                onCancel={handleToggleEdit}
                onUpdate={handleProfileUpdate}
              />
            </div>
          ) : (
            // View Mode
            <>
              {/* About Me */}
              <div className="mt-6">
                <AboutMeCard profile={profile} />
              </div>

              {/* Profile Information */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <PersonalInfoCard profile={profile} />
                <ContactInfoCard profile={profile} />
              </div>

              {/* Career Information */}
              {profile && profile.role === "alumni" && (
                <div className="mt-6">
                  <CareerInfoCard profile={profile} />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
