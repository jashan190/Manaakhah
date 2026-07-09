"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthShell } from "@/components/auth/AuthShell";
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react";

type VerificationStatus = "loading" | "success" | "signing-in" | "error" | "resend-form" | "resend-sent";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<VerificationStatus>("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [email, setEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [resendError, setResendError] = useState("");

  // Handle cooldown countdown
  useEffect(() => {
    if (cooldownSeconds > 0) {
      const timer = setInterval(() => {
        setCooldownSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cooldownSeconds]);

  // Handle auto sign-in after successful verification
  const handleVerificationSuccess = async (userEmail: string, canAutoLogin: boolean) => {
    setStatus("success");

    // Check for stored auto-login token
    const storedEmail = sessionStorage.getItem("pendingVerificationEmail");
    const autoLoginToken = sessionStorage.getItem("autoLoginToken");

    if (canAutoLogin && autoLoginToken && storedEmail === userEmail) {
      setStatus("signing-in");
      setSuccessMessage("Email verified! Signing you in...");

      // Clear stored tokens
      sessionStorage.removeItem("pendingVerificationEmail");
      sessionStorage.removeItem("autoLoginToken");

      try {
        const result = await signIn("credentials", {
          email: userEmail,
          autoLoginToken: autoLoginToken,
          redirect: false,
        });

        if (result?.ok) {
          const session = await getSession();
          const role = (session?.user as any)?.role as string | undefined;
          const dest =
            role === "ADMIN" || role === "SUPER_ADMIN" ? "/admin" :
            role === "BUSINESS_OWNER" || role === "STAFF" || role === "MODERATOR" ? "/dashboard" :
            "/";
          router.push(dest);
          return;
        }
        // If auto-login fails, fall through to login redirect
      } catch (error) {
        console.error("Auto sign-in failed:", error);
      }
    }

    // Fallback: redirect to login with success message
    setSuccessMessage("Email verified successfully!");
    setTimeout(() => {
      router.push("/login?verified=true");
    }, 2000);
  };

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("Missing verification token. Please check your email for the correct link.");
      return;
    }

    async function verifyEmail() {
      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (res.ok) {
          const data = await res.json();
          await handleVerificationSuccess(data.email, data.canAutoLogin);
        } else {
          const data = await res.json();
          setStatus("error");
          setErrorMessage(data.error || "Verification failed. The link may have expired.");
        }
      } catch (err) {
        setStatus("error");
        setErrorMessage("An error occurred during verification. Please try again.");
      }
    }

    verifyEmail();
  }, [token, router]);

  const handleResendRequest = () => {
    setStatus("resend-form");
  };

  const handleResendSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResendLoading(true);
    setResendError("");

    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.status === 429) {
        // Rate limited - parse cooldown seconds from error message
        const data = await res.json();
        const match = data.error?.match(/wait (\d+) seconds/);
        if (match) {
          setCooldownSeconds(parseInt(match[1], 10));
        } else {
          setCooldownSeconds(60); // Default to 60 seconds
        }
        setResendError(data.error || "Please wait before requesting another email");
        setResendLoading(false);
        return;
      }

      // Always show success to prevent email enumeration
      setStatus("resend-sent");
    } catch (err) {
      setStatus("resend-sent");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <AuthShell>
      <h1 className="t-h1" style={{ color: "var(--ink-900)" }}>Email Verification</h1>

      <div className="mt-8 space-y-4">
        {status === "loading" && (
          <div className="flex flex-col items-center py-8 space-y-4">
            <Loader2 className="h-12 w-12 animate-spin" style={{ color: "var(--moss-700)" }} />
            <p className="t-body" style={{ color: "var(--ink-500)" }}>Verifying your email...</p>
          </div>
        )}

        {(status === "success" || status === "signing-in") && (
          <div className="flex flex-col items-center py-8 space-y-4">
            {status === "signing-in" ? (
              <Loader2 className="h-12 w-12 animate-spin" style={{ color: "var(--moss-700)" }} />
            ) : (
              <CheckCircle className="h-12 w-12" style={{ color: "var(--moss-700)" }} />
            )}
            <div className="text-center space-y-2">
              <p className="t-body font-medium" style={{ color: "var(--moss-700)" }}>
                {successMessage || "Email verified successfully!"}
              </p>
              <p className="t-body-sm" style={{ color: "var(--ink-500)" }}>
                {status === "signing-in" ? "Please wait..." : "Redirecting to login..."}
              </p>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center py-8 space-y-4">
            <XCircle className="h-12 w-12" style={{ color: "var(--err-500)" }} />
            <div className="text-center space-y-2">
              <p className="t-body font-medium" style={{ color: "var(--err-500)" }}>Verification failed</p>
              <p className="t-body-sm" style={{ color: "var(--ink-500)" }}>{errorMessage}</p>
            </div>
            <Button onClick={handleResendRequest} variant="outline" className="mt-4">
              <Mail className="h-4 w-4 mr-2" />
              Request New Verification Link
            </Button>
            <Link
              href="/login"
              className="t-body-sm font-medium"
              style={{ color: "var(--moss-700)" }}
            >
              Back to login
            </Link>
          </div>
        )}

        {status === "resend-form" && (
          <form onSubmit={handleResendSubmit} className="space-y-4">
            <div className="text-center mb-4">
              <p className="t-body-sm" style={{ color: "var(--ink-500)" }}>Enter your email address to receive a new verification link.</p>
            </div>

            {resendError && (
              <div className="rounded-[8px] p-3 t-body-sm" style={{ background: "var(--clay-50)", color: "var(--clay-700)" }}>
                {resendError}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={resendLoading || cooldownSeconds > 0}
            >
              {resendLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : cooldownSeconds > 0 ? (
                `Resend in ${cooldownSeconds}s`
              ) : (
                "Send verification link"
              )}
            </Button>
            <button
              type="button"
              onClick={() => {
                setStatus("error");
                setResendError("");
                setCooldownSeconds(0);
              }}
              className="w-full t-body-sm"
              style={{ color: "var(--ink-500)" }}
            >
              Cancel
            </button>
          </form>
        )}

        {status === "resend-sent" && (
          <div className="flex flex-col items-center py-8 space-y-4">
            <Mail className="h-12 w-12" style={{ color: "var(--moss-700)" }} />
            <div className="text-center space-y-2">
              <p className="t-body font-medium" style={{ color: "var(--ink-900)" }}>Check your email</p>
              <p className="t-body-sm" style={{ color: "var(--ink-500)" }}>
                If an account exists with this email, we&apos;ve sent a new verification link.
              </p>
              <p className="t-body-sm mt-2" style={{ color: "var(--ink-500)" }}>
                Don&apos;t forget to check your spam folder.
              </p>
            </div>
            <Link
              href="/login"
              className="t-body-sm font-medium mt-4"
              style={{ color: "var(--moss-700)" }}
            >
              Back to login
            </Link>
          </div>
        )}
      </div>
    </AuthShell>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: "var(--moss-700)" }} />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
