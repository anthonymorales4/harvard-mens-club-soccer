"use client";

import { useAuth } from "@/app/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const isProtectedRoute = pathname.startsWith("/team");

    if (loading) return;

    if (!user && isProtectedRoute) {
      router.push("/signin");
    }

    if (user && (pathname === "/signin" || pathname === "/signup")) {
      router.push("/team");
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
