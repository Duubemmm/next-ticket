import Link from "next/link";
import { Ticket } from "@/app/lib/types";

interface TicketCardProps {
  ticket: Ticket;
}

export default function TicketCard({ ticket }: TicketCardProps) {
  const statusColors = {
    open: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    closed: "bg-gray-100 text-gray-800",
  };

  const priorityColors = {
    low: "text-gray-600",
    medium: "text-blue-600",
    high: "text-orange-600",
    urgent: "text-red-600",
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Link href={`/dashboard/tickets/${ticket.id}`}>
      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-orange-300 transition-all cursor-pointer">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                statusColors[ticket.status]
              }`}
            >
              {ticket.status.toUpperCase()}
            </span>
          </div>
          <span className={`text-sm font-medium ${priorityColors[ticket.priority]}`}>
            {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {ticket.title}
        </h3>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {ticket.description}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>by {ticket.userName}</span>
          <span>{formatDate(ticket.createdAt)}</span>
        </div>
      </div>
    </Link>
  );
}