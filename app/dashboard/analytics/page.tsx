import { redirect } from "next/navigation";

// Analytics is now the "Analytics" tab on the dashboard.
export default function Page() {
  redirect("/dashboard");
}
