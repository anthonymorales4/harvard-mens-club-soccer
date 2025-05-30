"use client";

import Image from "next/image";
import RoleBadge from "./RoleBadge";
import ProfileImageUpload from "./ProfileImageUpload";

export default function ProfileHeader({
  profile,
  isEditing,
  onEditClick,
  onProfileUpdate,
}) {
  if (!profile) return null;

  const { full_name, graduation_year, role, position, board_position } =
    profile;

  const isBoard = board_position;

  function handleImageUpdate(updatedProfile) {
    if (onProfileUpdate) {
      onProfileUpdate(updatedProfile);
    }
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <ProfileImageUpload
          profile={profile}
          onImageUpdate={handleImageUpdate}
        />
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{full_name}</h1>
              <h3 className="italic text-gray-800">
                Class of {graduation_year}
              </h3>
              <p className="text-gray-500">{position}</p>
              <div className="mt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
                <RoleBadge role={role} />
                {isBoard &&
                  board_position.split(", ").map((position, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800"
                    >
                      {role === "alumni" ? `Ex-${position}` : position}
                    </span>
                  ))}
              </div>
            </div>
            <button
              onClick={onEditClick}
              className={`mt-4 sm:mt-0 ${
                isEditing
                  ? "bg-gray-200 hover:bg-gray-300 text-gray-800"
                  : "bg-[#A51C30] hover:bg-[#8a1726] text-white"
              } px-4 py-2 rounded-md text-sm font-medium transition-colors`}
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
