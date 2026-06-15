"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { switchMockRole } from "@/lib/mock-auth";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthShell } from "@/components/auth/AuthShell";
import { Eye, EyeOff, CheckCircle, Mail, Loader2 } from "lucide-react";

function LoginContent() {
  const searchParams = useSearchParams();
  const verified = searchParams.get("verified") === "true";
  const reset = searchParams.get("reset") === "true";
  const registered = searchParams.get("registered") === "true";
  const next = searchParams.get("next") || "";
  const roleParam = searchParams.get("role");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"CONSUMER" | "BUSINESS_OWNER">(roleParam === "owner" ? "BUSINESS_OWNER" : "CONSUMER");
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    // Mock mode: establish the chosen-role session and route into that flow
    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true") {
      // Admin accounts (by email) drop into the admin console
      const target = formData.email.toLowerCase().includes("admin") ? "ADMIN" : role;
      switchMockRole(target);
      const fallback = target === "ADMIN" ? "/admin" : target === "BUSINESS_OWNER" ? "/dashboard" : "/";
      window.location.href = target === "ADMIN" ? "/admin" : (next || fallback);
      return;
    }
    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });
      if (!result?.ok || result?.error) {
        setError(
          result?.error === "EMAIL_NOT_VERIFIED"
            ? "Please verify your email before signing in."
            : "Invalid email or password"
        );
        setLoading(false);
        return;
      }
      window.location.href = "/dashboard";
    } catch {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <h1 className="t-h1" style={{ color: "var(--ink-900)" }}>Welcome Back</h1>
      <p className="mt-2 t-body" style={{ color: "var(--ink-500)" }}>
        Sign in to support Muslim-owned businesses near you.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {(verified || reset) && (
          <div className="flex items-center gap-2 rounded-[10px] p-3 t-body-sm"
            style={{ background: "var(--moss-50)", color: "var(--moss-700)" }}>
            <CheckCircle className="h-4 w-4" />
            {verified ? "Email verified! Please sign in." : "Password reset! Sign in with your new password."}
          </div>
        )}
        {registered && (
          <div className="flex items-center gap-2 rounded-[10px] p-3 t-body-sm"
            style={{ background: "var(--clay-50)", color: "var(--clay-700)" }}>
            <Mail className="h-4 w-4" /> Registration successful! Check your email to verify.
          </div>
        )}
        {error && (
          <div className="rounded-[10px] p-3 t-body-sm" style={{ background: "#fadfdb", color: "#9b2e25" }}>{error}</div>
        )}

        {/* Which experience to sign into */}
        <div>
          <Label>Sign in as</Label>
          <div className="mt-1.5 flex gap-1 rounded-full p-1" style={{ background: "var(--paper-2)" }}>
            {([["CONSUMER", "Customer"], ["BUSINESS_OWNER", "Business owner"]] as const).map(([v, l]) => {
              const active = role === v;
              return (
                <button key={v} type="button" onClick={() => setRole(v)}
                  className="flex-1 rounded-full px-4 py-2 t-label transition-colors"
                  style={active ? { background: "var(--ink-900)", color: "var(--bone)" } : { background: "transparent", color: "var(--ink-500)" }}>
                  {l}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="name@example.com" required
            value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="/forgot-password" className="t-body-sm" style={{ color: "var(--moss-700)" }}>Forgot password?</Link>
          </div>
          <div className="relative">
            <Input id="password" type={showPassword ? "text" : "password"} required className="pr-10"
              value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}
              className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--ink-400)" }}>
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </Button>

        <p className="text-center t-body-sm" style={{ color: "var(--ink-500)" }}>
          Don&apos;t have an account?{" "}
          <Link href={next ? `/register?next=${encodeURIComponent(next)}${roleParam ? `&role=${roleParam}` : ""}` : "/register"} className="font-medium" style={{ color: "var(--moss-700)" }}>Create one</Link>
        </p>
      </form>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" style={{ color: "var(--moss-700)" }} /></div>}>
      <LoginContent />
    </Suspense>
  );
}
