import { NextResponse } from "next/server";
import { z } from "zod";
import { db, isMockMode } from "@/lib/db";
import { getRequestUser } from "@/lib/api/auth-user";

const paymentMethodSchema = z.object({
  type: z.enum(["CARD", "BANK_TRANSFER", "ZELLE", "CASH_APP", "MANUAL"]),
  label: z.string().max(100).optional(),
  brand: z.string().max(50).optional(),
  last4: z.string().regex(/^\d{4}$/).optional(),
  expMonth: z.number().int().min(1).max(12).optional(),
  expYear: z.number().int().min(2024).max(2100).optional(),
  accountHint: z.string().max(100).optional(),
  isDefault: z.boolean().optional(),
});

export async function GET(req: Request) {
  try {
    const user = await getRequestUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (isMockMode()) {
      return NextResponse.json({ methods: [] });
    }

    const methods = await db.paymentMethod.findMany({
      where: {
        userId: user.id,
        isActive: true,
      },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ methods });
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    return NextResponse.json(
      { error: "Failed to fetch payment methods" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await getRequestUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (isMockMode()) {
      return NextResponse.json(
        { error: "Payment methods are not available in mock mode" },
        { status: 501 }
      );
    }

    const body = await req.json();
    const input = paymentMethodSchema.parse(body);

    if (input.isDefault) {
      await db.paymentMethod.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    const method = await db.paymentMethod.create({
      data: {
        userId: user.id,
        type: input.type,
        label: input.label || null,
        brand: input.brand || null,
        last4: input.last4 || null,
        expMonth: input.expMonth || null,
        expYear: input.expYear || null,
        accountHint: input.accountHint || null,
        isDefault: input.isDefault ?? false,
        isActive: true,
      },
    });

    return NextResponse.json({ method }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error creating payment method:", error);
    return NextResponse.json(
      { error: "Failed to save payment method" },
      { status: 500 }
    );
  }
}

