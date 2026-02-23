import { auth } from "@/lib/auth";
import { isMockMode } from "@/lib/db";

export type RequestUser = {
  id: string;
  role: string;
};

export async function getRequestUser(req: Request): Promise<RequestUser | null> {
  if (isMockMode()) {
    const id = req.headers.get("x-user-id");
    const role = req.headers.get("x-user-role") || "CONSUMER";
    if (!id) return null;
    return { id, role };
  }

  const session = await auth();
  if (!session?.user?.id) return null;
  return {
    id: session.user.id,
    role: session.user.role || "CONSUMER",
  };
}
