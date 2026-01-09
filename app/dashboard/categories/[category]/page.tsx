"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/app/lib/authContext";
import { ticketStore } from "@/app/lib/ticketstore";
import { Ticket, TicketCategory } from "@/app/lib/types";
import TicketCard from "@/app/components/dashboard/ticketcard";
import Link from "next/link";

export default function CategoryTicketsPage() {
  const params = useParams();
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const category = params.category as TicketCategory;

  const categoryInfo: Record<
    TicketCategory,
    { label: string; icon: string; description: string }
  > = {
    technical: {
      label: "Technical Support",
      icon: "🔧",
      description: "Technical issues and troubleshooting",
    },
    billing: {
      label: "Billing",
      icon: "💳",
      description: "Payment and subscription related tickets",
    },
    general: {
      label: "General Inquiry",
      icon: "💬",
      description: "General questions and information",
    },
    "feature-request": {
      label: "Feature Request",
      icon: "✨",
      description: "Feature suggestions and improvements",
    },
    bug: {
      label: "Bug Report",
      icon: "🐛",
      description: "Bug reports and unexpected behavior",
    },
  };

  useEffect(() => {
    if (user) {
      const userTickets = ticketStore.getByUser(user.id);
      const categoryTickets = userTickets.filter((t) => t.category === category);
      setTickets(categoryTickets);
    }
  }, [user, category]);

  const info = categoryInfo[category];

  if (!info) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">❓</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Invalid category
        </h2>
        <Link
          href="/dashboard/categories"
          className="inline-block px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-pink-600 transition"
        >
          Back to Categories
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
        <Link href="/dashboard" className="hover:text-orange-600">
          Dashboard
        </Link>
        <span>/</span>
        <Link href="/dashboard/categories" className="hover:text-orange-600">
          Categories
        </Link>
        <span>/</span>
        <span className="text-gray-900">{info.label}</span>
      </div>

      {/* Header */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-orange-500 rounded-lg flex items-center justify-center text-3xl">
            {info.icon}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{info.label}</h1>
            <p className="mt-1 text-gray-600">{info.description}</p>
            <p className="mt-2 text-sm text-gray-500">
              {tickets.length} {tickets.length === 1 ? "ticket" : "tickets"} in
              this category
            </p>
          </div>
        </div>
      </div>

      {/* Tickets Grid */}
      {tickets.length === 0 ? (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">{info.icon}</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No tickets in this category
          </h3>
          <p className="text-gray-600 mb-6">
            You havent created any {info.label.toLowerCase()} tickets yet.
          </p>
          <Link
            href="/dashboard/create-ticket"
            className="inline-block px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-pink-600 transition"
          >
            Create Ticket
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      )}
    </div>
  );
}