import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateTimeSlots } from "@/lib/availability";

// GET /api/businesses/[id]/slots?date=YYYY-MM-DD&duration=60
// Returns available time slots for a given date. Public — no auth required.
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: businessId } = await params;
    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get("date");
    const duration = parseInt(searchParams.get("duration") || "60");

    if (!dateStr) {
      return NextResponse.json({ error: "date query param required (YYYY-MM-DD)" }, { status: 400 });
    }

    const date = new Date(`${dateStr}T00:00:00`);
    if (isNaN(date.getTime())) {
      return NextResponse.json({ error: "Invalid date" }, { status: 400 });
    }

    const dayOfWeek = date.getDay();

    const availability = await prisma.businessAvailability.findUnique({
      where: { businessId_dayOfWeek: { businessId, dayOfWeek } },
    });

    if (!availability || !availability.isAvailable) {
      return NextResponse.json({ slots: [], message: "No availability configured for this day" });
    }

    const startOfDay = new Date(`${dateStr}T00:00:00`);
    const endOfDay = new Date(`${dateStr}T23:59:59`);

    const existingBookings = await prisma.booking.findMany({
      where: {
        businessId,
        appointmentDate: { gte: startOfDay, lte: endOfDay },
        status: { in: ["PENDING", "CONFIRMED"] },
      },
      select: { appointmentTime: true, duration: true },
    });

    const slots = generateTimeSlots(availability, existingBookings, date, duration);

    return NextResponse.json({ slots });
  } catch (error) {
    console.error("Slots error:", error);
    return NextResponse.json({ error: "Failed to fetch slots" }, { status: 500 });
  }
}
