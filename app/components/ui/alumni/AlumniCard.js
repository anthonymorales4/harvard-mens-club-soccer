import Image from "next/image";

export default function AlumniCard({ alumni, onClick }) {
  const isProfileCreated = alumni.isProfileCreated;

  if (!isProfileCreated) {
    return (
      <div
        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
        onClick={() =>
          alert("Sorry, this alumni hasn't joined the platform yet.")
        }
      >
        <div className="h-48 bg-gray-200 flex iterms-center justify-center">
          <div className="w-20 h-20 bg-gray-400 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 text-center">
            {alumni.name}
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="h-48 relative">
        {alumni.profile_image_url ? (
          <Image
            src={alumni.profile_image_url}
            alt={alumni.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="h-full bg-gray-200 flex items-center justify-center">
            <div className="w-20 h-20 bg-gray-400 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900">{alumni.name}</h3>
        <p className="text-sm text-gray-600">
          Class of {alumni.graduation_year}
        </p>
        {alumni.position && (
          <p className="text-sm text-gray-500">{alumni.position}</p>
        )}
        {alumni.current_job && alumni.current_company && (
          <p className="text-sm text-[#A51C30] mt-2 font-medium">
            {alumni.current_job} at {alumni.current_company}
          </p>
        )}
      </div>
    </div>
  );
}
