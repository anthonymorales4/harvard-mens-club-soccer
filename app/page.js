import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr_auto] font-[family-name:var(--font-geist-sans)]">
      {/* Hero Section */}
      <section className="relative w-full h-[85vh] flex flex-col items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/team-photos/HarvardBrown2023.JPG"
            alt="HarvardBrown2023.JPG"
            fill
            priority
            className="object-cover brightness-[0.65]"
          />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <div className="mb-6 flex justify-center">
            <Image
              src="/images/HarvardLogo.svg"
              alt="HarvardLogo"
              width={200}
              height={200}
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Harvard Men&apos;s Club Soccer
          </h1>
          <p className="text-xl md:text-2xl mb-8 font-medium">
            Tradition. Excellence. Brotherhood.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link
              href="/signin"
              className="bg-white text-black hover:bg-gray-100 py-3 px-8 rounded-full font-medium transition-colors text-base sm:text-lg"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="bg-white text-black hover:bg-gray-100 py-3 px-8 rounded-full font-medium transition-colors text-base sm:text-lg"
            >
              Join The Team
            </Link>
          </div>
        </div>
      </section>

      {/* Brief Overview / Value Proposition */}
      <section className="py-16 px-6 bg-white">
        <div className="max-4-wl mx-auto text-center">
          <h2 className="text-3xl md:text=4xl font-bold mb-6 text-gray-800">
            Your Digital Clubhouse
          </h2>
          <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
            A private platform exclusively for Harvard Men&apos;s Club Soccer
            players and alumni. Stay connected with the team, build
            relationships across generations, and continue the legacy of
            excellence both on and off the field.
          </p>
          <div className="w-24 h-2 bg-[#A51C30] mx-auto mt-8 mb-4"></div>
          <p className="italic text-gray-600">
            Sign in to access team updates, alumni networking, and more.
          </p>
        </div>
      </section>

      {/* Feature Preview Cards */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            What You&apos;ll Find Inside
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Team Updates Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
              <div className="h-3 bg-[#A51C30]"></div>
              <div className="p-6">
                <div className="w-12 h-12 bg-[#A51C30]/10 rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-[#A51C30]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  Team Updates
                </h3>
                <p className="text-gray-600">
                  Stay connected with the latest match results and important
                  announcements.
                </p>
              </div>
            </div>

            {/* Alumni Networking Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
              <div className="h-3 bg-[#A51C30]"></div>
              <div className="p-6">
                <div className="w-12 h-12 bg-[#A51C30]/10 rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-[#A51C30]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  Alumni Network
                </h3>
                <p className="text-gray-600">
                  Connect with former players across industries and generations
                  to build meaningful relationships.
                </p>
              </div>
            </div>

            {/* Team History Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
              <div className="h-3 bg-[#A51C30]"></div>
              <div className="p-6">
                <div className="w-12 h-12 bg-[#A51C30]/10 rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-[#A51C30]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  Team History
                </h3>
                <p className="text-gray-600">
                  Explore our legacy of excellence on and off the field through
                  photos, records, and stories.
                </p>
              </div>
            </div>

            {/* Events Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
              <div className="h-3 bg-[#A51C30]"></div>
              <div className="p-6">
                <div className="w-12 h-12 bg-[#A51C30]/10 rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-[#A51C30]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  Events
                </h3>
                <p className="text-gray-600">
                  Never miss a match, practice, or alumni gathering with our
                  integrated calendar and notifications.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials/Quotes Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            From Our Community
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Current Player Quote */}
            <div className="bg-gray-50 p-8 rounded-lg relative">
              <svg
                className="absolute text-[#A51C30] w-12 h-12 top-4 left-4 opacity-20"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>

              <div className="text-gray-700 text-lg italic mb-6 mt-4 pl-8">
                &quot;Being part of the Harvard Men&apos;s Club Soccer team has
                been the highlight of my college experience. The bonds
                we&apos;ve formed extend far beyond the pitch.&quot;
              </div>

              <div className="flex items-center">
                <div className="w-12 h-12 bg-[#A51C30] rounded-full flex items-center justify-center text-white font-bold">
                  JM
                </div>
                <div className="ml-4">
                  <p className="font-semibold text-gray-800">James Mitchell</p>
                  <p className="text-sm text-gray-600">Junior, Class of 2026</p>
                </div>
              </div>
            </div>

            {/* Alumni Quote */}
            <div className="bg-gray-50 p-8 rounded-lg relative">
              <svg
                className="absolute text-[#A51C30] w-12 h-12 top-4 left-4 opacity-20"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>

              <div className="text-gray-700 text-lg italic mb-6 mt-4 pl-8">
                &quot;The connections I made on this team have opened doors
                throughout my career. Ten years later, I still count my
                teammates among my closest friends and professional
                network.&quot;
              </div>

              <div className="flex items-center">
                <div className="w-12 h-12 bg-[#A51C30] rounded-full flex items-center justify-center text-white font-bold">
                  DR
                </div>
                <div className="ml-4">
                  <p className="font-semibold text-gray-800">David Rodriguez</p>
                  <p className="text-sm text-gray-600">Alumni, Class of 2015</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-6 bg-[#A51C30] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join Your Team&apos;s Digital Clubhouse
          </h2>

          <p className="text-lg md:text-xl mb-8 opacity-90">
            Connect with teammates past and present, stay updated on team
            activities, and be part of the Harvard Men&apos;s Club Soccer
            legacy.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link
              href="/signin"
              className="bg-white text-[#A51C30] hover:bg-gray-100 py-3 px-8 rounded-full font-medium transition-colors text-base sm:text-lg"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="bg-transparent text-white hover:bg-[#8a1726] border border-white py-3 px-8 rounded-full font-medium transition-colors text-base sm:text-lg"
            >
              Join the Team
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-5 px-4 text-center text-sm">
        <p>
          © {new Date().getFullYear()} Harvard Men&apos;s Club Soccer. All
          rights reserved.
        </p>
      </footer>
    </div>
  );
}
