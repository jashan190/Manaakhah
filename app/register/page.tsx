"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthShell } from "@/components/auth/AuthShell";
import { switchMockRole } from "@/lib/mock-auth";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", phone: "",
    role: "CONSUMER" as "CONSUMER" | "BUSINESS_OWNER",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    // Mock mode: establish the chosen-role session and route into that flow
    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true") {
      switchMockRole(formData.role);
      window.location.href = formData.role === "BUSINESS_OWNER" ? "/business" : "/";
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

  const roleBtn = (value: "CONSUMER" | "BUSINESS_OWNER", label: string) => {
    const active = formData.role === value;
    return (
      <button type="button" onClick={() => setFormData({ ...formData, role: value })}
        className="flex-1 rounded-full px-4 py-2 t-label transition-colors"
        style={active
          ? { background: "var(--ink-900)", color: "var(--bone)" }
          : { background: "transparent", color: "var(--ink-500)" }}>
        {label}
      </button>
    );
  };

  return (
    <AuthShell quote="Manaakhah helps neighbors find the Muslim-owned businesses that make our community thrive." author="Yusuf R." role="Diner · Sacramento">
      <span className="t-eyebrow" style={{ color: "var(--ink-500)" }}>Step 1 of 2</span>
      <h1 className="mt-2 t-h1" style={{ color: "var(--ink-900)" }}>Create your account</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {error && (
          <div className="rounded-[10px] p-3 t-body-sm" style={{ background: "#fadfdb", color: "#9b2e25" }}>{error}</div>
        )}

        {/* role segmented control */}
        <div className="flex gap-1 rounded-full p-1" style={{ background: "var(--paper-2)" }}>
          {roleBtn("CONSUMER", "I'm a diner")}
          {roleBtn("BUSINESS_OWNER", "Business owner")}
        </div>

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
          <Link href="/login" className="font-medium" style={{ color: "var(--moss-700)" }}>Sign in</Link>
        </p>
      </form>
    </AuthShell>
  );
}
