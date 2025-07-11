"use client";

import Image from "next/image";

// Alumni Grid Component with embedded AlumniCard logic
export default function AlumniGrid({ alumni, onAlumniClick }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {alumni.map((person, index) => {
        const isProfileCreated = person.isProfileCreated;

        if (!isProfileCreated) {
          return (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() =>
                alert("Sorry, this alumni hasn't joined the platform yet")
              }
            >
              <div className="h-48 bg-gray-200 relative">
                <Image
                  src={person.profile_image_url}
                  alt={person.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-gray-900 text-center">{person.name}</h3>
              </div>
            </div>
          );
        }

        return (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onAlumniClick(person)}
          >
            <div className="h-48 relative">
              <Image
                src={person.profile_image_url}
                alt={person.name}
                fill
                className="object-cover"
                style={{ objectPosition: "center 20%" }}
              />
            </div>
            <div className="p-4">
              <h3 className="text-gray-900">{person.name}</h3>
              <p className="text-sm text-gray-600">
                Class of {person.graduation_year}
              </p>
              {person.position && (
                <p className="text-sm text-gray-500">{person.position}</p>
              )}
              {person.current_job && person.current_company && (
                <p className="text-sm text-[#A51C30] mt-2 font-medium">
                  {person.current_job} at {person.current_company}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
