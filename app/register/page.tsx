"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthShell } from "@/components/auth/AuthShell";
import { switchMockRole } from "@/lib/mock-auth";
import { Eye, EyeOff, Loader2 } from "lucide-react";

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "";
  const roleParam = searchParams.get("role");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", phone: "",
    role: (roleParam === "owner" ? "BUSINESS_OWNER" : "CONSUMER") as "CONSUMER" | "BUSINESS_OWNER",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    // Mock mode: establish the chosen-role session and route into that flow
    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true") {
      switchMockRole(formData.role);
      const fallback = formData.role === "BUSINESS_OWNER" ? "/for-business#get-listed" : "/";
      window.location.href = next || fallback;
      return;
    }
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Registration failed");
        return;
      }
      if (data.autoLoginToken) {
        sessionStorage.setItem("pendingVerificationEmail", formData.email);
        sessionStorage.setItem("autoLoginToken", data.autoLoginToken);
      }
      router.push("/login?registered=true");
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const presetOwner = roleParam === "owner";   // came from Claim/Add — role is fixed
  const ownerFlow = formData.role === "BUSINESS_OWNER";
  const loginHref = next ? `/login?next=${encodeURIComponent(next)}${roleParam ? `&role=${roleParam}` : ""}` : "/login";

  const roleBtn = (value: "CONSUMER" | "BUSINESS_OWNER", label: string) => {
    const active = formData.role === value;
    return (
      <button type="button" onClick={() => setFormData({ ...formData, role: value })}
        className="flex-1 rounded-full px-4 py-2 t-label transition-colors"
        style={active ? { background: "var(--ink-900)", color: "var(--bone)" } : { background: "transparent", color: "var(--ink-500)" }}>
        {label}
      </button>
    );
  };

  return (
    <AuthShell>
      <span className="t-eyebrow" style={{ color: "var(--ink-500)" }}>{ownerFlow ? "Get listed" : "Step 1 of 2"}</span>
      <h1 className="mt-2 t-h1" style={{ color: "var(--ink-900)" }}>{ownerFlow ? "Create Your Business Account" : "Create Your Account"}</h1>
      {ownerFlow && <p className="mt-2 t-body" style={{ color: "var(--ink-500)" }}>Set up your owner account to finish listing your business.</p>}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {error && (
          <div className="rounded-[10px] p-3 t-body-sm" style={{ background: "#fadfdb", color: "#9b2e25" }}>{error}</div>
        )}

        {/* role chooser — only on the generic sign-up (Claim/Add presets the role) */}
        {!presetOwner && (
          <div>
            <Label>I&apos;m signing up as</Label>
            <div className="mt-1.5 flex gap-1 rounded-full p-1" style={{ background: "var(--paper-2)" }}>
              {roleBtn("CONSUMER", "Customer")}
              {roleBtn("BUSINESS_OWNER", "Business owner")}
            </div>
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" placeholder="Your name" required
            value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="name@example.com" required
            value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input id="password" type={showPassword ? "text" : "password"} placeholder="Minimum 8 characters"
              required minLength={8} className="pr-10"
              value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}
              className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--ink-400)" }}>
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </Button>

        <p className="text-center t-body-sm" style={{ color: "var(--ink-500)" }}>
          Already have an account?{" "}
          <Link href={loginHref} className="font-medium" style={{ color: "var(--moss-700)" }}>Sign in</Link>
        </p>
      </form>
    </AuthShell>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" style={{ color: "var(--moss-700)" }} /></div>}>
      <RegisterContent />
    </Suspense>
  );
}
