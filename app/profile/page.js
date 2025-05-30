"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/layout/Navbar";
import ProfileHeader from "../components/ui/profile/ProfileHeader";
import ProfileCompletionBar from "../components/ui/profile/ProfileCompletionBar";
import AboutMeCard from "../components/ui/profile/AboutMeCard";
import PersonalInfoCard from "../components/ui/profile/PersonalInfoCard";
import ContactInfoCard from "../components/ui/profile/ContactInfoCard";
import CareerInfoCard from "../components/ui/profile/CareerInfoCard";
import ProfileEditForm from "../components/ui/profile/ProfileEditForm";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const { user, loading, error } = useAuth();

  useEffect(() => {
    if (user?.profile) {
      setProfile(user.profile);
    }
  }, [user]);

  function calculateProfileCompletion() {
    if (!profile) return 0;

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
      "final_club",
      "linkedin_url",
      "instagram_url",
      "board_position",
      "phone_number",
    ];

    if (profile.role === "alumni") {
      fields.push("current_job", "current_company", "current_location");
    }

    const completedFields = fields.filter((field) => profile[field]);

    return Math.round((completedFields.length / fields.length) * 100);
  }

  function handleToggleEdit() {
    setIsEditing(!isEditing);
  }

  function handleProfileUpdate(updatedProfile) {
    setProfile(updatedProfile);
    setIsEditing(false);
  }

  function handleImageUpdate(updatedProfile) {
    setProfile(updatedProfile);
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A51C30]"></div>
        </div>
      </>
    );
  }

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
          <ProfileHeader
            profile={profile}
            isEditing={isEditing}
            onEditClick={handleToggleEdit}
            onProfileUpdate={handleImageUpdate}
          />
          {profile && (
            <div className="mt-6">
              <ProfileCompletionBar
                percentage={profileCompletionPercentage}
                profile={profile}
              />
            </div>
          )}
          {isEditing ? (
            <div>
              <ProfileEditForm
                profile={profile}
                onCancel={handleToggleEdit}
                onUpdate={handleProfileUpdate}
              />
            </div>
          ) : (
            profile && (
              <>
                <div className="mt-6">
                  <AboutMeCard profile={profile} />
                </div>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <PersonalInfoCard profile={profile} />
                  <ContactInfoCard profile={profile} />
                </div>
                {profile && profile.role === "alumni" && (
                  <div className="mt-6">
                    <CareerInfoCard profile={profile} />
                  </div>
                )}
              </>
            )
          )}
        </div>
      </div>
    </>
  );
}
