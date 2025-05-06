"use client";
import { useAuth } from "@/context/AuthContext";

export default function Topbar() {
  const { user } = useAuth();

  const initials = user?.displayName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="w-full px-6 py-4 border-b bg-white flex justify-end items-center gap-4">
      <div className="text-right">
        <p className="text-sm text-gray-500">Welcome back,</p>
        <p className="font-medium text-gray-700">{user?.displayName}</p>
      </div>
      <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-full font-semibold">
        {initials}
      </div>
    </div>
  );
}
