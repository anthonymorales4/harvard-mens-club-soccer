"use client";

import { useAuth } from "@/app/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const isProtectedRoute = pathname.startsWith("/dashboard");

    if (loading) return;

    // If not authenticated and trying to access protected route
    if (!user && isProtectedRoute) {
      router.push("/signin");
    }

    if (user && (pathname === "/signin" || pathname === "/signup")) {
      router.push("/dashboard");
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A51C30]"></div>
      </div>
    );
  }

  return children;
}
