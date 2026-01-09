"use client";

import { useMemo } from "react"; 
import { useAuth } from "@/app/lib/authContext";
import { ticketStore } from "@/app/lib/ticketstore";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuth();

  const stats = useMemo(() => {
    if (!user) {
      return { total: 0, open: 0, pending: 0, closed: 0 };
    }
    return ticketStore.getStats(user.id);
  }, [user]);

  const statsCards = [
    { label: "Total Tickets", value: stats.total, color: "bg-blue-500" },
    { label: "Open", value: stats.open, color: "bg-green-500" },
    { label: "Pending", value: stats.pending, color: "bg-yellow-500" },
    { label: "Closed", value: stats.closed, color: "bg-gray-500" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="mt-2 text-gray-600">Track and manage your tickets</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-lg shadow p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stat.label}
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {stat.value}
                </p>
              </div>
              <div
                className={`${stat.color} text-white p-3 rounded-lg text-2xl`}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/dashboard/create-ticket"
            className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition"
          >
            <span className="font-medium text-gray-700">Create New Ticket</span>
          </Link>
          <Link
            href="/dashboard/all-tickets"
            className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition"
          >
            <span className="font-medium text-gray-700">View All Tickets</span>
          </Link>
          <Link
            href="/dashboard/open-tickets"
            className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition"
          >
            <span className="font-medium text-gray-700">Open Tickets</span>
          </Link>
        </div>
      </div>
    </div>
  );
}