import { NextResponse } from "next/server";
import { z } from "zod";
import { db, isMockMode } from "@/lib/db";
import { getRequestUser } from "@/lib/api/auth-user";

const claimSchema = z.object({
  businessId: z.string().min(1),
  verificationMethod: z.string().min(1),
  verificationCode: z.string().optional(),
  notes: z.string().max(2000).optional(),
});

export async function GET(req: Request) {
  try {
    const user = await getRequestUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (isMockMode()) {
      return NextResponse.json({ claims: [] });
    }

    // Find businesses where user attempted a claim (ownerId matches and claimStatus is relevant)
    const businesses = await db.business.findMany({
      where: {
        ownerId: user.id,
        claimStatus: { in: ["CLAIMED", "DISPUTED"] },
      },
      select: {
        id: true,
        name: true,
        address: true,
        city: true,
        claimStatus: true,
        claimedAt: true,
      },
      orderBy: { claimedAt: "desc" },
    });

    return NextResponse.json({
      claims: businesses.map((b) => ({
        id: b.id,
        businessId: b.id,
        businessName: b.name,
        status: b.claimStatus === "CLAIMED" ? "approved" : "pending",
        createdAt: b.claimedAt?.toISOString() || new Date().toISOString(),
      })),
    });
  } catch (error) {
    console.error("Error fetching claims:", error);
    return NextResponse.json({ error: "Failed to fetch claims" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getRequestUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (isMockMode()) {
      return NextResponse.json({ error: "Not available in mock mode" }, { status: 501 });
    }

    const input = claimSchema.parse(await req.json());

    const business = await db.business.findUnique({
      where: { id: input.businessId },
      select: { id: true, name: true, claimStatus: true, ownerId: true },
    });

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    if (business.claimStatus === "CLAIMED") {
      return NextResponse.json({ error: "This business has already been claimed" }, { status: 409 });
    }

    // Mark the business as claimed by this user
    await db.business.update({
      where: { id: input.businessId },
      data: {
        claimStatus: "CLAIMED",
        claimedAt: new Date(),
        ownerId: user.id,
      },
    });

    return NextResponse.json({
      message: "Claim submitted successfully",
      claim: {
        businessId: input.businessId,
        businessName: business.name,
        status: "pending",
      },
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.issues }, { status: 400 });
    }
    console.error("Error creating claim:", error);
    return NextResponse.json({ error: "Failed to submit claim" }, { status: 500 });
  }
}
