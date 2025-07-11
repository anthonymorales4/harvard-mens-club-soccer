import { X } from "lucide-react";
import { useEffect } from "react";
import AboutMeCard from "../profile/AboutMeCard";
import PersonalInfoCard from "../profile/PersonalInfoCard";
import ContactInfoCard from "../profile/ContactInfoCard";
import CareerInfoCard from "../profile/CareerInfoCard";
import AlumniProfileHeader from "./AlumniProfileHeader";

export default function AlumniModal({ alumni, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  if (!alumni.isProfileCreated) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Alumni Profile
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          <AlumniProfileHeader profile={alumni} />

          <div className="mt-6">
            <AboutMeCard profile={alumni} />
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <PersonalInfoCard profile={alumni} />
            <ContactInfoCard profile={alumni} />
          </div>

          {alumni && alumni.role === "alumni" && (
            <div className="mt-6">
              <CareerInfoCard profile={alumni} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
