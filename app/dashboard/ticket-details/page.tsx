"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ticketStore } from "@/app/lib/ticketstore";
import { Ticket, TicketStatus } from "@/app/lib/types";
import Link from "next/link";

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    const ticketId = params.id as string;
    const foundTicket = ticketStore.getById(ticketId);
    if (foundTicket) {
      setTicket(foundTicket);
      setEditData({
        title: foundTicket.title,
        description: foundTicket.description,
      });
    }
  }, [params.id]);

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

  const categoryIcons = {
    technical: "🔧",
    billing: "💳",
    general: "💬",
    "feature-request": "✨",
    bug: "🐛",
  };

  const categoryLabels = {
    technical: "Technical Support",
    billing: "Billing",
    general: "General Inquiry",
    "feature-request": "Feature Request",
    bug: "Bug Report",
  };

  const handleStatusChange = (newStatus: TicketStatus) => {
    if (!ticket) return;
    const updated = ticketStore.update(ticket.id, { status: newStatus });
    if (updated) {
      setTicket(updated);
    }
  };

  const handleDelete = () => {
    if (!ticket) return;
    if (confirm("Are you sure you want to delete this ticket?")) {
      ticketStore.delete(ticket.id);
      router.push("/dashboard/tickets");
    }
  };

  const handleSaveEdit = () => {
    if (!ticket) return;
    const updated = ticketStore.update(ticket.id, {
      title: editData.title,
      description: editData.description,
    });
    if (updated) {
      setTicket(updated);
      setIsEditing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!ticket) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Ticket not found</h2>
        <p className="text-gray-600 mb-6">This ticket doesnt exist or has been deleted.</p>
        <Link
          href="/dashboard/tickets"
          className="inline-block px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-pink-600 transition"
        >
          Back to Tickets
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
        <Link href="/dashboard" className="hover:text-orange-600">
          Dashboard
        </Link>
        <span>/</span>
        <Link href="/dashboard/tickets" className="hover:text-orange-600">
          Tickets
        </Link>
        <span>/</span>
        <span className="text-gray-900">#{ticket.id.slice(-8)}</span>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{categoryIcons[ticket.category]}</span>
              <div>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    statusColors[ticket.status]
                  }`}
                >
                  {ticket.status.toUpperCase()}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Edit
                </button>
              )}
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition"
              >
                Delete
              </button>
            </div>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <input
                type="text"
                value={editData.title}
                onChange={(e) =>
                  setEditData((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full text-2xl font-bold px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditData({ title: ticket.title, description: ticket.description });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <h1 className="text-2xl font-bold text-gray-900">{ticket.title}</h1>
          )}
        </div>

        {/* Details Grid */}
        <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 border-b border-gray-200">
          <div>
            <p className="text-xs text-gray-600 mb-1">Category</p>
            <p className="text-sm font-medium text-gray-900">
              {categoryLabels[ticket.category]}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Priority</p>
            <p className={`text-sm font-medium ${priorityColors[ticket.priority]}`}>
              {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Created</p>
            <p className="text-sm font-medium text-gray-900">{formatDate(ticket.createdAt)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Updated</p>
            <p className="text-sm font-medium text-gray-900">{formatDate(ticket.updatedAt)}</p>
          </div>
        </div>

        {/* Description */}
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
          {isEditing ? (
            <textarea
              value={editData.description}
              onChange={(e) =>
                setEditData((prev) => ({ ...prev, description: e.target.value }))
              }
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 resize-none"
            />
          ) : (
            <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
          )}
        </div>

        {/* Status Actions */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Update Status</h3>
          <div className="flex gap-3">
            <button
              onClick={() => handleStatusChange("open")}
              disabled={ticket.status === "open"}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                ticket.status === "open"
                  ? "bg-green-100 text-green-800 cursor-not-allowed"
                  : "bg-white border border-gray-300 hover:bg-gray-50"
              }`}
            >
              Open
            </button>
            <button
              onClick={() => handleStatusChange("pending")}
              disabled={ticket.status === "pending"}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                ticket.status === "pending"
                  ? "bg-yellow-100 text-yellow-800 cursor-not-allowed"
                  : "bg-white border border-gray-300 hover:bg-gray-50"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => handleStatusChange("closed")}
              disabled={ticket.status === "closed"}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                ticket.status === "closed"
                  ? "bg-gray-100 text-gray-800 cursor-not-allowed"
                  : "bg-white border border-gray-300 hover:bg-gray-50"
              }`}
            >
              Closed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}