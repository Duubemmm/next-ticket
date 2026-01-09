
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/lib/authContext";
import { ticketStore } from "@/app/lib/ticketstore";
import { TicketCategory } from "@/app/lib/types";
import Link from "next/link";

export default function CategoriesPage() {
  const { user } = useAuth();
  const [categoryStats, setCategoryStats] = useState<
    Record<TicketCategory, number>
  >({
    technical: 0,
    billing: 0,
    general: 0,
    "feature-request": 0,
    bug: 0,
  });

  useEffect(() => {
    if (user) {
      const tickets = ticketStore.getByUser(user.id);
      const stats: Record<TicketCategory, number> = {
        technical: 0,
        billing: 0,
        general: 0,
        "feature-request": 0,
        bug: 0,
      };

      tickets.forEach((ticket) => {
        stats[ticket.category]++;
      });

      setCategoryStats(stats);
    }
  }, [user]);

  const categories = [
    {
      value: "technical" as TicketCategory,
      label: "Technical Support",
      icon: "🔧",
      description: "Get help with technical issues and troubleshooting",
      color: "from-blue-500 to-cyan-500",
    },
    {
      value: "billing" as TicketCategory,
      label: "Billing",
      icon: "💳",
      description: "Questions about payments, invoices, and subscriptions",
      color: "from-green-500 to-emerald-500",
    },
    {
      value: "general" as TicketCategory,
      label: "General Inquiry",
      icon: "💬",
      description: "General questions and information requests",
      color: "from-purple-500 to-pink-500",
    },
    {
      value: "feature-request" as TicketCategory,
      label: "Feature Request",
      icon: "✨",
      description: "Suggest new features or improvements",
      color: "from-yellow-500 to-orange-500",
    },
    {
      value: "bug" as TicketCategory,
      label: "Bug Report",
      icon: "🐛",
      description: "Report bugs and unexpected behavior",
      color: "from-red-500 to-pink-500",
    },
  ];

  const totalTickets = Object.values(categoryStats).reduce((a, b) => a + b, 0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Ticket Categories</h1>
        <p className="mt-2 text-gray-600">
          Browse tickets by category • {totalTickets} total tickets
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => {
          const count = categoryStats[category.value];
          return (
            <Link
              key={category.value}
              href={`/dashboard/categories/${category.value}`}
              className="group"
            >
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-orange-300 transition-all">
                {/* Icon & Count */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center text-2xl`}
                  >
                    {category.icon}
                  </div>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold">
                    {count} {count === 1 ? "ticket" : "tickets"}
                  </span>
                </div>

                {/* Label */}
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition">
                  {category.label}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600">{category.description}</p>

                {/* View Link */}
                <div className="mt-4 flex items-center text-sm font-medium text-orange-600 group-hover:text-orange-700">
                  View tickets
                  <svg
                    className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {totalTickets === 0 && (
        <div className="mt-12 bg-white rounded-lg shadow border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No tickets yet
          </h3>
          <p className="text-gray-600 mb-6">
            Create your first ticket to get started
          </p>
          <Link
            href="/dashboard/create-ticket"
            className="inline-block px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-pink-600 transition"
          >
            Create Ticket
          </Link>
        </div>
      )}
    </div>
  );
}