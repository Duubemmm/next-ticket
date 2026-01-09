"use client";

import { useAuth } from "@/app/lib/authContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogOut() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) return <p>Loading...</p>;
  if (!user) return null;

  return (
    <div className="p-10">
      <h1>Welcome to your Dashboard, {user.name}!</h1>
      <button onClick={logout} className="mt-4 text-red-500 underline">
        Logout
      </button>
    </div>
  );
}
