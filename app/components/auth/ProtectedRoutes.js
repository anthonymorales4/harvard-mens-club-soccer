"use client";

import { useAuth } from "@/app/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }) {
  const { user, loading, initialized } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    const isProtectedRoute =
      pathname.startsWith("/team") ||
      pathname.startsWith("/alumni") ||
      pathname.startsWith("/announcements") ||
      pathname.startsWith("/profile");

    const isAuthRoute = pathname === "/signin" || pathname === "/signup";

    if (!user && isProtectedRoute) {
      console.log("Redirecting user to sign in. Access prohibited");
      router.push("/signin");
      return;
    }

    if (user && isAuthRoute) {
      console.log("Redirecting user to team page. User already authenticated");
      router.push("/team");
      return;
    }
  }, [user, loading, pathname, router]);

  if (!initialized || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A51C30]"></div>
      </div>
    );
  }

  return children;
}
