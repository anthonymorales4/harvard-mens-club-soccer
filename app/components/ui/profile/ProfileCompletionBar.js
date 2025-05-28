"use client";

export default function ProfileCompletionBar({ percentage, profile }) {
  function getTip() {
    if (!profile.profile_image_url) return "Add a profile photo";
    if (!profile.bio) return "Add your bio";
    if (!profile.house) return "Add your house";
    if (!profile.concentration) return "Add your concentration";
    if (!profile.hometown) return "Add your hometown";
    if (!profile.phone_number) return "Add your phone number";

    if (profile.role === "alumni") {
      if (!profile.current_job) return "Add your current job";
      if (!profile.current_location) return "Add your current location";
    }

    if (!profile.linkedin_url) return "Add your LinkedIn profile";
    if (!profile.instagram_url) return "Add your Instagram profile";

    return "Your profile is looking great!";
  }

  function getColor() {
    if (percentage < 30) return "bg-red-500";
    if (percentage < 70) return "bg-yellow-500";
    return "bg-green-500";
  }

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
        <h2 className="text-lg font-medium text-gray-900">
          Profile Completion
        </h2>
        <span className="text-sm font-medium text-gray-500">
          {percentage}% Complete
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
        <div
          className={`${getColor()} h-2.5 rounded-full transition-all duration-500 ease-in-out`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <p className="text-sm text-gray-600">
        <span className="font-medium">Tip:</span> {getTip()}
      </p>
    </div>
  );
}
