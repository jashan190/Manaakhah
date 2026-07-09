import { NextResponse } from "next/server";
import { z } from "zod";
import { db, isMockMode } from "@/lib/db";
import { getRequestUser } from "@/lib/api/auth-user";

const claimSchema = z.object({
  businessId: z.string().min(1),
  verificationMethod: z.enum(["phone", "email", "docs"]),
  verificationCode: z.string().optional(),
  documentUrl: z.string().optional(),
  notes: z.string().max(2000).optional(),
});

const METHOD_TO_TYPE = {
  phone: "MUSLIM_OWNED",
  email: "MUSLIM_OWNED",
  docs: "BUSINESS_LICENSE",
} as const;

export async function GET(req: Request) {
  try {
    const user = await getRequestUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (isMockMode()) {
      return NextResponse.json({ claims: [] });
    }

    // Businesses already granted to this user (admin-approved claims)
    const owned = await db.business.findMany({
      where: { ownerId: user.id, claimStatus: { in: ["CLAIMED", "DISPUTED"] } },
      select: { id: true, name: true, claimStatus: true, claimedAt: true },
      orderBy: { claimedAt: "desc" },
    });

    // Claim requests this user submitted that are still awaiting admin review
    const pendingLogs = await db.activityLog.findMany({
      where: { userId: user.id, action: "VERIFICATION", entityType: "Business" },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    const pendingBusinessIds = [...new Set(pendingLogs.map((l: any) => l.entityId).filter(Boolean))]
      .filter((id) => !owned.some((b: any) => b.id === id));
    const pendingBusinesses = pendingBusinessIds.length
      ? await db.business.findMany({
          where: { id: { in: pendingBusinessIds as string[] }, claimStatus: "UNCLAIMED" },
          select: { id: true, name: true, claimStatus: true },
        })
      : [];

    return NextResponse.json({
      claims: [
        ...owned.map((b: any) => ({
          id: b.id,
          businessId: b.id,
          businessName: b.name,
          status: b.claimStatus === "CLAIMED" ? "approved" : "disputed",
          createdAt: b.claimedAt?.toISOString() || new Date().toISOString(),
        })),
        ...pendingBusinesses.map((b: any) => ({
          id: b.id,
          businessId: b.id,
          businessName: b.name,
          status: "pending",
          createdAt: new Date().toISOString(),
        })),
      ],
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

    if (input.verificationMethod === "docs" && !input.documentUrl) {
      return NextResponse.json({ error: "documentUrl is required for document verification" }, { status: 400 });
    }

    // Ownership does NOT transfer here — it only transfers when an admin approves the
    // verification request (see PATCH /api/admin/verification-requests/[id]). We record who
    // is asking via ActivityLog (VerificationRequest has no requester column) so approval
    // knows who to grant ownership to.

    // Re-use a pending request for this business instead of piling up duplicates
    const existingRequest = await db.verificationRequest.findFirst({
      where: { businessId: input.businessId, status: "PENDING" },
    });

    const verificationRequest = existingRequest
      ? await db.verificationRequest.update({
          where: { id: existingRequest.id },
          data: {
            type: METHOD_TO_TYPE[input.verificationMethod],
            documentUrl: input.documentUrl || `verification-method:${input.verificationMethod}`,
            documentType: input.verificationMethod,
          },
        })
      : await db.verificationRequest.create({
          data: {
            businessId: input.businessId,
            type: METHOD_TO_TYPE[input.verificationMethod],
            documentUrl: input.documentUrl || `verification-method:${input.verificationMethod}`,
            documentType: input.verificationMethod,
          },
        });

    await db.activityLog.create({
      data: {
        userId: user.id,
        action: "VERIFICATION",
        entityType: "Business",
        entityId: input.businessId,
        details: { claimRequest: true, verificationRequestId: verificationRequest.id, notes: input.notes },
      },
    });

    return NextResponse.json({
      message: "Claim request submitted — an admin will review it before ownership transfers",
      claim: {
        businessId: input.businessId,
        businessName: business.name,
        status: "pending",
      },
      verificationRequest: { id: verificationRequest.id, status: verificationRequest.status },
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.issues }, { status: 400 });
    }
    console.error("Error creating claim:", error);
    return NextResponse.json({ error: "Failed to submit claim" }, { status: 500 });
  }
}
