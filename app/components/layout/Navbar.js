"use client";

import { useAuth } from "@/app/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();

  // Extract user information
  let userDisplay = "";
  if (user?.profile?.full_name) {
    const nameParts = user.profile.full_name.split(" ");
    const firstName = nameParts[0];
    const lastInital = nameParts[nameParts.length - 1].charAt(0);
    const gradYear = `'${String(user.profile.graduation_year).slice(-2)}`;

    userDisplay = `${firstName} ${lastInital}. ${gradYear}`;
  }

  // Navigation items with their paths and icons
  const navItems = [
    {
      name: "Team",
      path: "/team",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
    {
      name: "Announcements",
      path: "/announcements",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
          />
        </svg>
      ),
    },
    {
      name: "Alumni",
      path: "/alumni",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
    },
    {
      name: "Profile",
      path: "/profile",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
  ];

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/team">
                <Image
                  src="/images/HarvardLogo.svg"
                  alt="Harvard Logo"
                  width={36}
                  height={36}
                  className="h-9 w-auto"
                />
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="hidden sm:ml-6 sm:flex space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`
                    ${
                      pathname === item.path
                        ? "border-[#A51C30] text-[#A51C30]"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    } 
                    inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors
                  `}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* User Information and Sign Out */}
          <div className="flex items-center">
            {user && (
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-700 mr-4">
                  {userDisplay}
                </span>
                <button
                  onClick={signOut}
                  className="text-sm font-medium text-[#A51C30] hover:text-[#8A1726] transition-colors"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
