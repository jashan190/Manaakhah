"use client";

import Link from "next/link";
import { ManCard } from "@/components/man/primitives";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div style={{ background: "var(--paper)" }} className="min-h-screen">
      <div className="mx-auto max-w-[760px] px-5 py-10 md:px-8">
        <Link href="/" className="inline-flex items-center gap-1.5 t-body-sm mb-6" style={{ color: "var(--ink-500)" }}>
          <ArrowLeft size={15} /> Back to Minara
        </Link>

        <h1 className="t-h1" style={{ color: "var(--ink-900)" }}>Privacy Policy</h1>
        <p className="t-body-sm mt-1" style={{ color: "var(--ink-500)" }}>Last updated: July 2026</p>

        <div className="mt-8 grid gap-6">
          <ManCard style={{ padding: 24 }}>
            <h2 className="t-h4" style={{ color: "var(--ink-900)" }}>1. Information We Collect</h2>
            <p className="mt-3 t-body" style={{ color: "var(--ink-700)", lineHeight: 1.7 }}>
              We collect information you provide directly when creating an account (name, email, password), submitting a business listing, writing a review, or contacting us. We also collect usage data such as pages visited, search queries, and actions taken on business profiles (calls, directions, website clicks) to help business owners understand how customers find them.
            </p>
          </ManCard>

          <ManCard style={{ padding: 24 }}>
            <h2 className="t-h4" style={{ color: "var(--ink-900)" }}>2. How We Use Your Information</h2>
            <p className="mt-3 t-body" style={{ color: "var(--ink-700)", lineHeight: 1.7 }}>
              We use the information we collect to: operate and improve the Minara platform; send transactional emails (account verification, booking confirmations, password resets); provide business owners with aggregated analytics about their profile performance; moderate content and enforce our community standards; and respond to your inquiries.
            </p>
            <p className="mt-3 t-body" style={{ color: "var(--ink-700)", lineHeight: 1.7 }}>
              We do not sell your personal information to third parties.
            </p>
          </ManCard>

          <ManCard style={{ padding: 24 }}>
            <h2 className="t-h4" style={{ color: "var(--ink-900)" }}>3. Data Sharing</h2>
            <p className="mt-3 t-body" style={{ color: "var(--ink-700)", lineHeight: 1.7 }}>
              We share data only with service providers necessary to operate Minara (database hosting via Neon, email delivery via Resend, image hosting via Cloudinary). These providers process data on our behalf under confidentiality agreements. We may disclose information if required by law or to protect the safety of our community.
            </p>
          </ManCard>

          <ManCard style={{ padding: 24 }}>
            <h2 className="t-h4" style={{ color: "var(--ink-900)" }}>4. Cookies & Local Storage</h2>
            <p className="mt-3 t-body" style={{ color: "var(--ink-700)", lineHeight: 1.7 }}>
              We use cookies to maintain your login session. We use browser local storage to remember your preferred language and saved businesses. We do not use third-party tracking cookies or advertising networks.
            </p>
          </ManCard>

          <ManCard style={{ padding: 24 }}>
            <h2 className="t-h4" style={{ color: "var(--ink-900)" }}>5. Data Retention</h2>
            <p className="mt-3 t-body" style={{ color: "var(--ink-700)", lineHeight: 1.7 }}>
              Account data is retained as long as your account is active. If you delete your account, personal data is removed within 30 days, except where retention is required by law or to resolve disputes. Aggregated, anonymized analytics data may be retained indefinitely.
            </p>
          </ManCard>

          <ManCard style={{ padding: 24 }}>
            <h2 className="t-h4" style={{ color: "var(--ink-900)" }}>6. Your Rights</h2>
            <p className="mt-3 t-body" style={{ color: "var(--ink-700)", lineHeight: 1.7 }}>
              You may request access to, correction of, or deletion of your personal data at any time by contacting us at the address below. You may also export your data through your account settings.
            </p>
          </ManCard>

          <ManCard style={{ padding: 24 }}>
            <h2 className="t-h4" style={{ color: "var(--ink-900)" }}>7. Security</h2>
            <p className="mt-3 t-body" style={{ color: "var(--ink-700)", lineHeight: 1.7 }}>
              Passwords are hashed using bcrypt. Authentication sessions use signed JWTs. All data is transmitted over TLS. We support two-factor authentication for additional account security.
            </p>
          </ManCard>

          <ManCard style={{ padding: 24 }}>
            <h2 className="t-h4" style={{ color: "var(--ink-900)" }}>8. Children</h2>
            <p className="mt-3 t-body" style={{ color: "var(--ink-700)", lineHeight: 1.7 }}>
              Minara is not directed to children under 13. We do not knowingly collect personal information from children under 13.
            </p>
          </ManCard>

          <ManCard style={{ padding: 24 }}>
            <h2 className="t-h4" style={{ color: "var(--ink-900)" }}>9. Changes to This Policy</h2>
            <p className="mt-3 t-body" style={{ color: "var(--ink-700)", lineHeight: 1.7 }}>
              We will notify users of material changes to this policy via email or an in-app notice at least 14 days before they take effect.
            </p>
          </ManCard>

          <ManCard style={{ padding: 24 }}>
            <h2 className="t-h4" style={{ color: "var(--ink-900)" }}>10. Contact</h2>
            <p className="mt-3 t-body" style={{ color: "var(--ink-700)", lineHeight: 1.7 }}>
              For privacy questions or data requests, email us at{" "}
              <a href="mailto:privacy@minara.market" style={{ color: "var(--moss-700)" }}>privacy@minara.market</a>.
            </p>
          </ManCard>
        </div>

        <div className="mt-8">
          <Link href="/terms"><Button variant="outline" size="sm">Read Terms of Service →</Button></Link>
        </div>
      </div>
    </div>
  );
}
