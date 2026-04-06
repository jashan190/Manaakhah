import { NextResponse } from "next/server";
import { z } from "zod";
import { db, isMockMode } from "@/lib/db";
import { getRequestUser } from "@/lib/api/auth-user";

function generateCode(userId: string): string {
  const prefix = userId.slice(0, 4).toUpperCase();
  const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `MANA-${prefix}-${suffix}`;
}

export async function GET(req: Request) {
  try {
    const user = await getRequestUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (isMockMode()) {
      return NextResponse.json({ referrals: [], code: "MANA-DEMO-CODE", stats: { total: 0, completed: 0, totalEarned: 0 } });
    }

    const referrals = await db.referral.findMany({
      where: { referrerId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        referred: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    // Get or generate a referral code for this user
    const existingReferral = await db.referral.findFirst({
      where: { referrerId: user.id },
      select: { code: true },
    });

    const code = existingReferral?.code || generateCode(user.id);

    const completed = referrals.filter((r) => r.status === "completed" || r.status === "rewarded");
    const totalEarned = referrals.reduce((sum, r) => sum + (r.rewardAmount || 0), 0);

    return NextResponse.json({
      referrals,
      code,
      stats: {
        total: referrals.length,
        completed: completed.length,
        totalEarned,
      },
    });
  } catch (error) {
    console.error("Error fetching referrals:", error);
    return NextResponse.json({ error: "Failed to fetch referrals" }, { status: 500 });
  }
}

const inviteSchema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  try {
    const user = await getRequestUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (isMockMode()) {
      return NextResponse.json({ error: "Not available in mock mode" }, { status: 501 });
    }

    const { email } = inviteSchema.parse(await req.json());

    // Check if referred user exists
    const referredUser = await db.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!referredUser) {
      // For now, just track the invite — the referral will complete when user signs up
      return NextResponse.json({
        message: "Invite recorded. Referral will complete when they sign up.",
        pending: true,
      });
    }

    if (referredUser.id === user.id) {
      return NextResponse.json({ error: "Cannot refer yourself" }, { status: 400 });
    }

    // Check for existing referral
    const existing = await db.referral.findFirst({
      where: {
        referrerId: user.id,
        referredId: referredUser.id,
      },
    });

    if (existing) {
      return NextResponse.json({ error: "Already referred this user" }, { status: 409 });
    }

    const code = generateCode(user.id);

    const referral = await db.referral.create({
      data: {
        referrerId: user.id,
        referredId: referredUser.id,
        code,
        status: "pending",
        rewardAmount: 5.0,
      },
    });

    return NextResponse.json({ referral }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid email", details: error.issues }, { status: 400 });
    }
    console.error("Error creating referral:", error);
    return NextResponse.json({ error: "Failed to create referral" }, { status: 500 });
  }
}
