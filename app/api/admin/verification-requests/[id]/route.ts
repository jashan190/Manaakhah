import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkAdminAuth } from "@/lib/admin-auth";

// Force dynamic rendering - prevents static analysis during build
export const dynamic = "force-dynamic";

// PATCH /api/admin/verification-requests/:id - Approve or reject a verification request
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await checkAdminAuth(req);
    if (!auth.authorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { decision, reviewNote } = body as { decision?: string; reviewNote?: string };

    if (decision !== "APPROVED" && decision !== "REJECTED") {
      return NextResponse.json({ error: "decision must be APPROVED or REJECTED" }, { status: 400 });
    }

    const request_ = await db.verificationRequest.findUnique({ where: { id } });
    if (!request_) {
      return NextResponse.json({ error: "Verification request not found" }, { status: 404 });
    }

    const updated = await db.verificationRequest.update({
      where: { id },
      data: {
        status: decision,
        reviewedBy: auth.userId,
        reviewNote: reviewNote || null,
      },
    });

    const business = await db.business.update({
      where: { id: request_.businessId },
      data: {
        verificationStatus: decision,
        ...(decision === "APPROVED" ? { verifiedAt: new Date(), verifiedBy: auth.userId } : {}),
      },
    });

    // If this verification request originated from an unclaimed business being claimed,
    // ownership only transfers on approval — find who asked via the ActivityLog trail
    // left by POST /api/claims (VerificationRequest has no requester column of its own).
    if (decision === "APPROVED" && business.claimStatus === "UNCLAIMED") {
      const claimLog = await db.activityLog.findFirst({
        where: { entityType: "Business", entityId: business.id, action: "VERIFICATION" },
        orderBy: { createdAt: "desc" },
      });
      if (claimLog?.userId) {
        await db.business.update({
          where: { id: business.id },
          data: { ownerId: claimLog.userId, claimStatus: "CLAIMED", claimedAt: new Date() },
        });
      }
    }

    return NextResponse.json({ message: "Verification request updated", request: updated });
  } catch (error) {
    console.error("Error updating verification request:", error);
    return NextResponse.json({ error: "Failed to update verification request" }, { status: 500 });
  }
}
