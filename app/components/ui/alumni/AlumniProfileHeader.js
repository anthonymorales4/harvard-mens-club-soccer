import Image from "next/image";

export default function AlumniProfileHeader({ profile }) {
  if (!profile) return null;

  const { name, graduation_year, position, board_position, profile_image_url } =
    profile;

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-[#A51C30]">
          <Image
            src={profile_image_url}
            alt={name}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex-1 text-center sm:text-left">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
            <h3 className="italic text-gray-800">Class of {graduation_year}</h3>
            <p className="text-gray-500">{position}</p>

            {board_position && (
              <div className="mt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
                {board_position.split(", ").map((position, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800"
                  >
                    {profile.role === "alumni" ? `Ex-${position}` : position}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
