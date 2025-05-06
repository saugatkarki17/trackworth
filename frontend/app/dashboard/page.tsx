"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to /login only after loading finishes and no user is found
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return <div className="text-center mt-10 text-xl">Refreshing...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user?.displayName} 👋</h1>
      <p>Your personalized dashboard will appear here.</p>
    </div>
  );
}
