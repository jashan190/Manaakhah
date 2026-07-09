import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isMockMode } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";

const precheckSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// POST /api/auth/login-precheck - Validate credentials and report whether 2FA is required,
// without creating a session. NextAuth's credentials provider can't surface this distinction
// to the client (any throw from authorize() collapses into a generic error), so the login page
// calls this first and only invokes signIn() once it knows whether to ask for a code.
export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
    const { limited, retryAfter } = rateLimit(`precheck:${ip}`, 10, 300_000);
    if (limited) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": String(retryAfter) } }
      );
    }

    if (isMockMode()) {
      return NextResponse.json({ requiresTwoFactor: false });
    }

    const { email, password } = precheckSchema.parse(await req.json());

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        isBanned: true,
        banReason: true,
        twoFactorEnabled: true,
        twoFactorMethod: true,
      },
    });

    // Same generic message whether the email doesn't exist or the password is wrong —
    // matches the existing signIn()/authorize() behavior of not distinguishing the two.
    if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    if (user.isBanned) {
      return NextResponse.json({ error: `Your account has been suspended. ${user.banReason || ""}`.trim() }, { status: 403 });
    }

    if (!user.twoFactorEnabled) {
      return NextResponse.json({ requiresTwoFactor: false });
    }

    if (user.twoFactorMethod === "EMAIL") {
      try {
        const { generateAndSendEmailCode } = await import("@/lib/auth/two-factor");
        await generateAndSendEmailCode(user.id, user.email);
      } catch (err) {
        console.error("Failed to send 2FA email code:", err);
        return NextResponse.json({ error: "Failed to send verification code. Please try again." }, { status: 502 });
      }
    }

    return NextResponse.json({ requiresTwoFactor: true, method: user.twoFactorMethod || "AUTHENTICATOR" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    console.error("Login precheck error:", error);
    return NextResponse.json({ error: "An error occurred. Please try again." }, { status: 500 });
  }
}
