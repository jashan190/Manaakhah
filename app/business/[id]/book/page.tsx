"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ManCard, Tag } from "@/components/man/primitives";
import { Skeleton } from "@/components/man/Skeleton";
import { ArrowLeft, CalendarDays, Clock, CheckCircle } from "lucide-react";
import { formatTimeDisplay } from "@/lib/availability";

const DURATIONS = [30, 45, 60, 90, 120];

type Slot = { time: string; available: boolean; reason?: string };

function today() {
  return new Date().toISOString().split("T")[0];
}

function addDays(base: string, n: number) {
  const d = new Date(`${base}T00:00:00`);
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
}

export default function BookPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const [business, setBusiness] = useState<any>(null);
  const [loadingBiz, setLoadingBiz] = useState(true);

  const [serviceType, setServiceType] = useState("");
  const [duration, setDuration] = useState(60);
  const [date, setDate] = useState(addDays(today(), 1));
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedTime, setSelectedTime] = useState("");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/businesses/${id}`)
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { setBusiness(d); setLoadingBiz(false); })
      .catch(() => setLoadingBiz(false));
  }, [id]);

  useEffect(() => {
    if (!date || !duration) return;
    setSelectedTime("");
    setSlots([]);
    setLoadingSlots(true);
    fetch(`/api/businesses/${id}/slots?date=${date}&duration=${duration}`)
      .then((r) => r.ok ? r.json() : { slots: [] })
      .then((d) => { setSlots(d.slots || []); setLoadingSlots(false); })
      .catch(() => setLoadingSlots(false));
  }, [id, date, duration]);

  const handleSubmit = async () => {
    setError("");
    if (!serviceType.trim()) { setError("Please enter a service type."); return; }
    if (!selectedTime) { setError("Please select a time slot."); return; }

    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: id,
          serviceType: serviceType.trim(),
          appointmentDate: date,
          appointmentTime: selectedTime,
          duration,
          notes: notes.trim() || undefined,
        }),
      });

      if (res.status === 401) {
        router.push(`/login?next=/business/${id}/book`);
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to submit booking.");
      } else {
        setSuccess(true);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingBiz) {
    return (
      <div style={{ background: "var(--paper)" }} className="min-h-screen">
        <div className="mx-auto max-w-[640px] px-5 py-10 md:px-8">
          <Skeleton style={{ height: 28, width: "50%", marginBottom: 24 }} />
          <Skeleton style={{ height: 200, width: "100%", borderRadius: 12 }} />
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3" style={{ background: "var(--paper)" }}>
        <p className="t-body" style={{ color: "var(--ink-700)" }}>Business not found.</p>
        <Link href="/search"><Button>Browse Businesses</Button></Link>
      </div>
    );
  }

  if (success) {
    return (
      <div style={{ background: "var(--paper)" }} className="min-h-screen">
        <div className="mx-auto max-w-[560px] px-5 py-16 md:px-8 text-center">
          <CheckCircle size={48} style={{ color: "var(--moss-700)", margin: "0 auto" }} />
          <h1 className="t-h2 mt-5" style={{ color: "var(--ink-900)" }}>Request submitted!</h1>
          <p className="t-body mt-3" style={{ color: "var(--ink-700)", lineHeight: 1.6 }}>
            Your booking request at <strong>{business.name}</strong> for {serviceType} on{" "}
            {new Date(`${date}T00:00:00`).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} at{" "}
            {formatTimeDisplay(selectedTime)} has been sent. You&apos;ll be notified once the business confirms.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link href={`/business/${id}`}><Button variant="outline">Back to {business.name}</Button></Link>
            <Link href="/search"><Button>Browse more</Button></Link>
          </div>
        </div>
      </div>
    );
  }

  const availableSlots = slots.filter((s) => s.available);

  return (
    <div style={{ background: "var(--paper)" }} className="min-h-screen">
      <div className="mx-auto max-w-[640px] px-5 py-10 md:px-8">
        <Link href={`/business/${id}`} className="inline-flex items-center gap-1.5 t-body-sm mb-6" style={{ color: "var(--ink-500)" }}>
          <ArrowLeft size={15} /> {business.name}
        </Link>

        <h1 className="t-h2" style={{ color: "var(--ink-900)" }}>Book an appointment</h1>
        <p className="t-body-sm mt-1" style={{ color: "var(--ink-500)" }}>{business.name} · {business.city}, {business.state}</p>

        <div className="mt-6 grid gap-5">
          {/* Service */}
          <ManCard style={{ padding: 20 }}>
            <div className="t-label" style={{ color: "var(--ink-900)", marginBottom: 10 }}>Service type</div>
            <input
              type="text"
              placeholder="e.g. Haircut, Consultation, Catering…"
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className="man-field w-full rounded-[8px] px-3.5 py-2.5 t-body"
              style={{ border: "1px solid var(--card-edge)", color: "var(--ink-900)" }}
            />
          </ManCard>

          {/* Duration */}
          <ManCard style={{ padding: 20 }}>
            <div className="t-label" style={{ color: "var(--ink-900)", marginBottom: 10 }}>Duration</div>
            <div className="flex flex-wrap gap-2">
              {DURATIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className="man-focus rounded-full px-3.5 py-1.5 t-body-sm transition-colors"
                  style={{
                    background: duration === d ? "var(--moss-700)" : "var(--paper-2)",
                    color: duration === d ? "#fff" : "var(--ink-700)",
                    fontWeight: duration === d ? 600 : 400,
                    border: "1px solid transparent",
                  }}
                >
                  {d < 60 ? `${d} min` : `${d / 60}h${d % 60 ? ` ${d % 60}min` : ""}`}
                </button>
              ))}
            </div>
          </ManCard>

          {/* Date */}
          <ManCard style={{ padding: 20 }}>
            <div className="t-label" style={{ color: "var(--ink-900)", marginBottom: 10 }}>
              <CalendarDays size={14} className="inline mr-1.5" style={{ color: "var(--moss-700)" }} />
              Date
            </div>
            <input
              type="date"
              value={date}
              min={addDays(today(), 1)}
              max={addDays(today(), 90)}
              onChange={(e) => setDate(e.target.value)}
              className="man-field rounded-[8px] px-3.5 py-2.5 t-body"
              style={{ border: "1px solid var(--card-edge)", color: "var(--ink-900)" }}
            />
          </ManCard>

          {/* Time slots */}
          <ManCard style={{ padding: 20 }}>
            <div className="t-label" style={{ color: "var(--ink-900)", marginBottom: 10 }}>
              <Clock size={14} className="inline mr-1.5" style={{ color: "var(--moss-700)" }} />
              Available times
            </div>

            {loadingSlots ? (
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {[...Array(8)].map((_, i) => (
                  <Skeleton key={i} style={{ height: 38, borderRadius: 8 }} />
                ))}
              </div>
            ) : slots.length === 0 ? (
              <div className="rounded-[8px] py-8 text-center" style={{ background: "var(--paper-2)" }}>
                <p className="t-body-sm" style={{ color: "var(--ink-500)" }}>
                  No availability configured for this date. Try a different day or contact the business directly.
                </p>
              </div>
            ) : (
              <>
                {availableSlots.length === 0 ? (
                  <p className="t-body-sm" style={{ color: "var(--ink-500)" }}>All slots are booked for this day. Try a different date.</p>
                ) : (
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {slots.map((slot) => (
                      <button
                        key={slot.time}
                        disabled={!slot.available}
                        onClick={() => setSelectedTime(slot.time)}
                        className="man-focus rounded-[8px] py-2 t-body-sm transition-colors"
                        style={{
                          background: !slot.available
                            ? "var(--paper-2)"
                            : selectedTime === slot.time
                            ? "var(--moss-700)"
                            : "var(--paper)",
                          color: !slot.available
                            ? "var(--ink-300)"
                            : selectedTime === slot.time
                            ? "#fff"
                            : "var(--ink-700)",
                          border: `1px solid ${selectedTime === slot.time ? "var(--moss-700)" : "var(--card-edge)"}`,
                          cursor: slot.available ? "pointer" : "not-allowed",
                          fontWeight: selectedTime === slot.time ? 600 : 400,
                        }}
                      >
                        {formatTimeDisplay(slot.time)}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </ManCard>

          {/* Notes */}
          <ManCard style={{ padding: 20 }}>
            <div className="t-label" style={{ color: "var(--ink-900)", marginBottom: 10 }}>Notes (optional)</div>
            <textarea
              rows={3}
              placeholder="Any details for the business…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="man-field w-full rounded-[8px] px-3.5 py-2.5 t-body resize-none"
              style={{ border: "1px solid var(--card-edge)", color: "var(--ink-900)" }}
            />
          </ManCard>

          {error && (
            <p className="t-body-sm px-1" style={{ color: "var(--err-500)" }}>{error}</p>
          )}

          <div className="flex gap-3">
            <Button onClick={handleSubmit} disabled={submitting || !selectedTime} className="flex-1">
              {submitting ? "Submitting…" : "Request Appointment"}
            </Button>
            <Link href={`/business/${id}`}><Button variant="outline">Cancel</Button></Link>
          </div>
        </div>
      </div>
    </div>
  );
}
