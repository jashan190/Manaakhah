import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getRequestUser } from "@/lib/api/auth-user";
import { sendBookingConfirmationEmail } from "@/lib/email";
import { generateTimeSlots } from "@/lib/availability";

// GET /api/bookings - Get user's bookings
export async function GET(req: Request) {
  try {
    const user = await getRequestUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role") || "customer";
    const status = searchParams.get("status");
    const upcoming = searchParams.get("upcoming") === "true";

    const where: any = {};

    if (role === "business" || user.role === "BUSINESS_OWNER") {
      const businesses = await db.business.findMany({
        where: { ownerId: user.id },
        select: { id: true },
      });
      const businessIds = businesses.map((b: any) => b.id);

      if (businessIds.length === 0) return NextResponse.json({ bookings: [] });

      const filter: any = { businessId: { in: businessIds } };
      if (status) filter.status = status;
      if (upcoming) filter.appointmentDate = { gte: new Date() };

      const bookings = await db.booking.findMany({
        where: filter,
        include: { business: true, customer: true },
        orderBy: { appointmentDate: "asc" },
      });
      return NextResponse.json({ bookings });
    }

    // Consumer: their own bookings
    where.customerId = user.id;
    if (status) where.status = status;
    if (upcoming) where.appointmentDate = { gte: new Date() };

    const bookings = await db.booking.findMany({
      where,
      include: { business: true, customer: true },
      orderBy: { appointmentDate: "desc" },
    });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

// POST /api/bookings - Create a new booking
export async function POST(req: Request) {
  try {
    const user = await getRequestUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { businessId, serviceType, appointmentDate, appointmentTime, duration, notes } = body;

    if (!businessId || !serviceType || !appointmentDate || !appointmentTime || !duration) {
      return NextResponse.json(
        { error: "businessId, serviceType, appointmentDate, appointmentTime, and duration are required" },
        { status: 400 }
      );
    }

    const aptDate = new Date(appointmentDate);
    if (aptDate < new Date()) {
      return NextResponse.json({ error: "Appointment must be in the future" }, { status: 400 });
    }

    const business = await db.business.findUnique({
      where: { id: businessId },
      include: { availability: true },
    });

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    if ((business as any).ownerId === user.id) {
      return NextResponse.json({ error: "You cannot book your own business" }, { status: 400 });
    }

    // Conflict check: verify the requested slot is actually available
    const dayOfWeek = aptDate.getDay();
    const avail = (business as any).availability?.find((a: any) => a.dayOfWeek === dayOfWeek);
    if (avail) {
      const existingBookings = await db.booking.findMany({
        where: {
          businessId,
          appointmentDate: aptDate,
          status: { in: ["PENDING", "CONFIRMED"] },
        },
        select: { appointmentTime: true, duration: true },
      });

      const slots = generateTimeSlots(avail, existingBookings as any, aptDate, parseInt(duration));
      const slot = slots.find((s) => s.time === appointmentTime);

      if (slot && !slot.available) {
        return NextResponse.json(
          { error: "This time slot is no longer available. Please choose another." },
          { status: 409 }
        );
      }
    }

    const booking = await db.booking.create({
      data: {
        businessId,
        customerId: user.id,
        serviceType,
        appointmentDate: aptDate,
        appointmentTime,
        duration: parseInt(duration),
        notes: notes || null,
        status: "PENDING",
        statusHistory: [{ status: "PENDING", timestamp: new Date() }],
      },
      include: { customer: true },
    });

    // Fire confirmation email — non-blocking
    const customer = (booking as any).customer;
    if (customer?.email) {
      sendBookingConfirmationEmail(customer.email, customer.name || "Guest", {
        businessName: (business as any).name,
        serviceName: serviceType,
        date: aptDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }),
        time: appointmentTime,
        address: `${(business as any).address}, ${(business as any).city}, ${(business as any).state}`,
      }).catch(() => {});
    }

    return NextResponse.json({ message: "Booking request submitted successfully", booking }, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
