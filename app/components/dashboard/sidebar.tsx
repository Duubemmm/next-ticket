"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useAuth } from "@/app/lib/authContext";

const Sidebar = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navigation = [
    { name: "Overview", href: "/dashboard" },
    { name: "Create Ticket", href: "/dashboard/create-ticket" },
    { name: "All Tickets", href: "/dashboard/all-tickets"},
    { name: "Open Tickets", href: "/dashboard/open-tickets"},
    { name: "Pending Tickets", href: "/dashboard/pending-tickets" },
    { name: "Closed Tickets", href: "/dashboard/closed-tickets" },
    { name: "Categories", href: "/dashboard/categories"},
  ];

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200">
      <div className="flex flex-col h-full">
        <div className="p-6 border-b border-gray-200">
          <Link href="/">
            <h1 className="text-2xl font-bold text-gray-900">Ticz</h1>
          </Link>
          {user && (
            <p className="mt-2 text-sm text-gray-600">Welcome, {user.name}</p>
          )}
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={clsx(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                      isActive
                        ? "bg-orange-50 text-orange-600 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => logout()}
            className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;