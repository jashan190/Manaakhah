"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthShell } from "@/components/auth/AuthShell";
import { Mail, ArrowLeft, Loader2, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <AuthShell>
        <div className="flex h-12 w-12 items-center justify-center rounded-full" style={{ background: "var(--moss-100)" }}>
          <CheckCircle className="h-6 w-6" style={{ color: "var(--moss-700)" }} />
        </div>
        <h1 className="mt-5 t-h1" style={{ color: "var(--ink-900)" }}>Check Your Email</h1>
        <p className="mt-2 t-body" style={{ color: "var(--ink-500)" }}>
          If an account exists with this email, we&apos;ve sent a password reset link. It expires in 1 hour.
        </p>
        <div className="mt-5 flex items-start gap-2 rounded-[10px] p-3 t-body-sm" style={{ background: "var(--clay-50)", color: "var(--clay-700)" }}>
          <Mail className="mt-0.5 h-4 w-4" /> Don&apos;t forget to check your spam folder.
        </div>
        <Link href="/login" className="mt-6 inline-flex items-center gap-1 t-label" style={{ color: "var(--moss-700)" }}>
          <ArrowLeft className="h-4 w-4" /> Back to sign in
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <Link href="/login" className="inline-flex items-center gap-1 t-body-sm" style={{ color: "var(--ink-500)" }}>
        <ArrowLeft className="h-4 w-4" /> Back to sign in
      </Link>
      <h1 className="mt-4 t-h1" style={{ color: "var(--ink-900)" }}>Forgot Password?</h1>
      <p className="mt-2 t-body" style={{ color: "var(--ink-500)" }}>
        Enter your email and we&apos;ll send you a link to reset it.
      </p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="name@example.com" required
            value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</> : <><Mail className="mr-2 h-4 w-4" /> Send reset link</>}
        </Button>
      </form>
    </AuthShell>
  );
}
