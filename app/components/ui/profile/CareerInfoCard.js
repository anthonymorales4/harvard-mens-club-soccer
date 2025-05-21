"use client";

import ProfileSection from "./ProfileSection";

export default function CareerInfoCard({ profile }) {
  if (!profile || profile.role !== "alumni") return null;

  // Extract career information
  const { current_job, current_location } = profile;

  // Check if we have any career info to display
  const hasCareerInfo = current_job || current_location;

  // If no career info, display a message
  if (!hasCareerInfo) {
    return (
      <ProfileSection title="Career Information">
        <p className="text-gray-500 italic">No career information added yet.</p>
      </ProfileSection>
    );
  }

  return (
    <ProfileSection title="Career Information">
      <div className="space-y-4">
        {current_job && (
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                Current Position
              </p>
              <p className="text-sm text-gray-500">{current_job}</p>
            </div>
          </div>
        )}

        {current_location && (
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                Current Location
              </p>
              <p className="text-sm text-gray-500">{current_location}</p>
            </div>
          </div>
        )}
      </div>
    </ProfileSection>
  );
}
