"use client";

import { useEffect, useState } from "react";
import { OwnerShell } from "@/components/owner/OwnerShell";
import { ManCard } from "@/components/man/primitives";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/man/EmptyState";
import { Skeleton } from "@/components/man/Skeleton";
import { CalendarDays, Clock, User, CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { formatTimeDisplay } from "@/lib/availability";

type Booking = {
  id: string;
  serviceType: string;
  appointmentDate: string;
  appointmentTime: string;
  duration: number;
  status: string;
  notes?: string;
  customer?: { name?: string; email?: string; phone?: string };
  business?: { name: string };
};

const STATUS_TABS = [
  { k: "ALL", l: "All" },
  { k: "PENDING", l: "Pending" },
  { k: "CONFIRMED", l: "Confirmed" },
  { k: "COMPLETED", l: "Completed" },
  { k: "CANCELLED", l: "Cancelled" },
] as const;

type StatusTab = (typeof STATUS_TABS)[number]["k"];

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  PENDING: { bg: "var(--clay-50)", color: "var(--clay-700)", label: "Pending" },
  CONFIRMED: { bg: "var(--moss-50)", color: "var(--moss-700)", label: "Confirmed" },
  COMPLETED: { bg: "var(--paper-2)", color: "var(--ink-500)", label: "Completed" },
  CANCELLED: { bg: "var(--paper-2)", color: "var(--ink-400)", label: "Cancelled" },
  REJECTED: { bg: "var(--paper-2)", color: "var(--ink-400)", label: "Rejected" },
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<StatusTab>("ALL");
  const [acting, setActing] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    fetch("/api/bookings?role=business")
      .then((r) => r.ok ? r.json() : { bookings: [] })
      .then((d) => { setBookings(d.bookings || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(load, []);

  const updateStatus = async (bookingId: string, status: string) => {
    setActing(bookingId);
    try {
      const res = await fetch(`/api/bookings/${bookingId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) load();
    } finally {
      setActing(null);
    }
  };

  const visible = activeTab === "ALL"
    ? bookings
    : bookings.filter((b) => b.status === activeTab);

  return (
    <OwnerShell active="bookings">
      <div className="px-6 py-7 md:px-8">
        <h1 className="t-h3" style={{ color: "var(--ink-900)" }}>Bookings</h1>
        <p className="t-body-sm mt-1" style={{ color: "var(--ink-500)" }}>Manage appointment requests from customers.</p>

        {/* Tabs */}
        <div className="mt-5 flex gap-1 border-b" style={{ borderColor: "var(--card-edge)" }}>
          {STATUS_TABS.map(({ k, l }) => {
            const on = activeTab === k;
            const count = k === "ALL" ? bookings.length : bookings.filter((b) => b.status === k).length;
            return (
              <button
                key={k}
                onClick={() => setActiveTab(k)}
                className="man-focus rounded-[4px] px-4 py-2.5 t-label transition-colors"
                style={{
                  color: on ? "var(--ink-900)" : "var(--ink-500)",
                  borderBottom: on ? "2px solid var(--moss-700)" : "2px solid transparent",
                  marginBottom: -1,
                }}
              >
                {l}
                {count > 0 && (
                  <span className="ml-1.5 rounded-full px-1.5 py-0.5" style={{ fontSize: 10.5, background: on ? "var(--moss-50)" : "var(--paper-2)", color: on ? "var(--moss-700)" : "var(--ink-500)" }}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-5 grid gap-3">
          {loading ? (
            [...Array(4)].map((_, i) => <Skeleton key={i} style={{ height: 112, borderRadius: 12 }} />)
          ) : visible.length === 0 ? (
            <EmptyState
              Icon={CalendarDays}
              title={activeTab === "ALL" ? "No bookings yet" : `No ${activeTab.toLowerCase()} bookings`}
              description={activeTab === "ALL" ? "Booking requests from customers will appear here." : undefined}
            />
          ) : (
            visible.map((booking) => {
              const aptDate = new Date(`${booking.appointmentDate.split("T")[0]}T00:00:00`);
              const style = STATUS_STYLE[booking.status] ?? STATUS_STYLE.PENDING;
              const busy = acting === booking.id;

              return (
                <ManCard key={booking.id} style={{ padding: 18 }}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="t-label" style={{ color: "var(--ink-900)" }}>{booking.serviceType}</span>
                        <span className="rounded-full px-2 py-0.5 t-body-xs" style={{ background: style.bg, color: style.color, fontWeight: 600 }}>
                          {style.label}
                        </span>
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 t-body-sm" style={{ color: "var(--ink-500)" }}>
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays size={13} />
                          {aptDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Clock size={13} />
                          {formatTimeDisplay(booking.appointmentTime)} · {booking.duration} min
                        </span>
                        {booking.customer?.name && (
                          <span className="inline-flex items-center gap-1.5">
                            <User size={13} />
                            {booking.customer.name}
                          </span>
                        )}
                      </div>

                      {booking.notes && (
                        <p className="mt-2 t-body-sm" style={{ color: "var(--ink-600)" }}>
                          &ldquo;{booking.notes}&rdquo;
                        </p>
                      )}
                    </div>

                    {booking.status === "PENDING" && (
                      <div className="flex gap-2 flex-shrink-0">
                        <Button
                          size="sm"
                          disabled={busy}
                          onClick={() => updateStatus(booking.id, "CONFIRMED")}
                        >
                          <CheckCircle size={14} className="mr-1" />
                          {busy ? "…" : "Confirm"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={busy}
                          onClick={() => updateStatus(booking.id, "REJECTED")}
                        >
                          <XCircle size={14} className="mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}

                    {booking.status === "CONFIRMED" && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={busy}
                        onClick={() => updateStatus(booking.id, "COMPLETED")}
                      >
                        <RotateCcw size={14} className="mr-1" />
                        {busy ? "…" : "Mark complete"}
                      </Button>
                    )}
                  </div>
                </ManCard>
              );
            })
          )}
        </div>
      </div>
    </OwnerShell>
  );
}
