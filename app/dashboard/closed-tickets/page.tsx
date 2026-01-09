"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/lib/authContext";
import { ticketStore } from "@/app/lib/ticketstore";
import { Ticket } from "@/app/lib/types";
import TicketCard from "@/app/components/dashboard/ticketcard";
import Link from "next/link";

export default function ClosedTicketsPage() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    if (user) {
      const userTickets = ticketStore.getByUser(user.id);
      const closedTickets = userTickets.filter((t) => t.status === "closed");
      setTickets(closedTickets);
    }
  }, [user]);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Closed Tickets</h1>
          <p className="mt-2 text-gray-600">
            {tickets.length} resolved {tickets.length === 1 ? "ticket" : "tickets"}
          </p>
        </div>
        <Link
          href="/dashboard/create-ticket"
          className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-pink-600 transition"
        >
          + New Ticket
        </Link>
      </div>

      {tickets.length === 0 ? (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No closed tickets</h3>
          <p className="text-gray-600 mb-6">
            You dont have any resolved tickets yet.
          </p>
          <Link
            href="/dashboard/tickets"
            className="inline-block px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
          >
            View All Tickets
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