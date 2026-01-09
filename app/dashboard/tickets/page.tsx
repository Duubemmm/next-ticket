"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/lib/authContext";
import { ticketStore } from "@/app/lib/ticketstore";
import { Ticket, TicketStatus, TicketCategory } from "@/app/lib/types";
import TicketCard from "@/app/components/dashboard/ticketcard";
import Link from "next/link";

export default function AllTicketsPage() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<TicketCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (user) {
      const userTickets = ticketStore.getByUser(user.id);
      setTickets(userTickets);
      setFilteredTickets(userTickets);
    }
  }, [user]);

  useEffect(() => {
    let filtered = tickets;

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((t) => t.status === statusFilter);
    }

    // Filter by category
    if (categoryFilter !== "all") {
      filtered = filtered.filter((t) => t.category === categoryFilter);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTickets(filtered);
  }, [statusFilter, categoryFilter, searchQuery, tickets]);

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "technical", label: "Technical", icon: "🔧" },
    { value: "billing", label: "Billing", icon: "💳" },
    { value: "general", label: "General", icon: "💬" },
    { value: "feature-request", label: "Feature Request", icon: "✨" },
    { value: "bug", label: "Bug Report", icon: "🐛" },
  ];

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Tickets</h1>
          <p className="mt-2 text-gray-600">
            Showing {filteredTickets.length} of {tickets.length} tickets
          </p>
        </div>
        <Link
          href="/dashboard/create-ticket"
          className="px-6 py-3 bg-linear-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-pink-600 transition"
        >
          + New Ticket
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search tickets by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as TicketStatus | "all")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="pending">Pending</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as TicketCategory | "all")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.icon ? `${cat.icon} ` : ""}{cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Clear Filters */}
        {(statusFilter !== "all" || categoryFilter !== "all" || searchQuery) && (
          <button
            onClick={() => {
              setStatusFilter("all");
              setCategoryFilter("all");
              setSearchQuery("");
            }}
            className="mt-4 text-sm text-orange-600 hover:text-orange-700 font-medium"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Tickets Grid */}
      {filteredTickets.length === 0 ? (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">🎫</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No tickets found</h3>
          <p className="text-gray-600 mb-6">
            {tickets.length === 0
              ? "You haven't created any tickets yet."
              : "Try adjusting your filters."}
          </p>
          {tickets.length === 0 && (
            <Link
              href="/dashboard/create-ticket"
              className="inline-block px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-pink-600 transition"
            >
              Create Your First Ticket
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      )}
    </div>
  );
}