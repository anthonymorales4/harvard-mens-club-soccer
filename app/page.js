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
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Harvard Men's Club Soccer
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
            A private platform exclusively for Harvard Men's Club Soccer players
            and alumni. Stay connected with the team, build relationships across
            generations, and continue the legacy of excellence both on and off
            the field.
          </p>
          <div className="w-24 h-2 bg-[#A51C30] mx-auto mt-8 mb-4"></div>
          <p className="italic text-gray-600">
            Sign in to access team updates, alumni networking, and more.
          </p>
        </div>
      </section>

      {/* Remaining Sections */}
      <footer className="py-5 px-4 text-center text-sm">
        <p>
          © {new Date().getFullYear()} Harvard Men's Club Soccer. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}
