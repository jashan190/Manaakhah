import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/admin-auth";

// Force dynamic rendering - prevents static analysis during build
export const dynamic = "force-dynamic";

// GET /api/admin/verification-requests - List verification requests, defaults to PENDING
export async function GET(req: Request) {
  try {
    if (!(await isAdmin(req))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "PENDING";

    const where: any = {};
    if (status !== "ALL") {
      where.status = status;
    }

    const requests = await db.verificationRequest.findMany({
      where,
      include: {
        business: {
          select: {
            id: true,
            name: true,
            city: true,
            state: true,
            category: true,
            coverImage: true,
            verificationStatus: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ requests });
  } catch (error) {
    console.error("Error fetching verification requests:", error);
    return NextResponse.json({ error: "Failed to fetch verification requests" }, { status: 500 });
  }
}
