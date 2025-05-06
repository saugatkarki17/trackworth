"use client";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

const navItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Update Income", path: "/dashboard/income" },
  { label: "Update Expenses", path: "/dashboard/expenses" },
  { label: "My Profile", path: "/dashboard/profile" },
];

export default function Sidebar() {
  const { logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <aside className="w-64 min-h-screen bg-white border-r flex flex-col">
      {/* Top Section */}
      <div className="flex-1 p-6">
        <h1 className="text-blue-600 font-bold text-2xl p-2 mb-8">TrackWorth</h1>
        <nav className="space-y-3 ">
          {navItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <div
                className={`px-4 py-2 rounded-lg cursor-pointer transition-all ${
                  pathname === item.path
                    ? "bg-blue-100 text-blue-600 font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.label}
              </div>
            </Link>
          ))}
        </nav>
      </div>

      {/* Bottom Logout */}
      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="w-full text-red-500 border border-red-300 py-3 px-4 mb-6 mt-2 rounded-lg hover:bg-red-50 transition"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}
