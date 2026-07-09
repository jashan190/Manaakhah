"use client";

import Link from "next/link";
import { ManCard } from "@/components/man/primitives";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div style={{ background: "var(--paper)" }} className="min-h-screen">
      <div className="mx-auto max-w-[760px] px-5 py-10 md:px-8">
        <Link href="/" className="inline-flex items-center gap-1.5 t-body-sm mb-6" style={{ color: "var(--ink-500)" }}>
          <ArrowLeft size={15} /> Back to Minara
        </Link>

        <h1 className="t-h1" style={{ color: "var(--ink-900)" }}>Terms of Service</h1>
        <p className="t-body-sm mt-1" style={{ color: "var(--ink-500)" }}>Last updated: July 2026</p>

        <div className="mt-8 grid gap-6">
          <ManCard style={{ padding: 24 }}>
            <h2 className="t-h4" style={{ color: "var(--ink-900)" }}>1. Acceptance of Terms</h2>
            <p className="mt-3 t-body" style={{ color: "var(--ink-700)", lineHeight: 1.7 }}>
              By accessing or using Minara, you agree to these Terms of Service and our Privacy Policy. If you do not agree, do not use the platform.
            </p>
          </ManCard>

          <ManCard style={{ padding: 24 }}>
            <h2 className="t-h4" style={{ color: "var(--ink-900)" }}>2. Eligibility</h2>
            <p className="mt-3 t-body" style={{ color: "var(--ink-700)", lineHeight: 1.7 }}>
              You must be at least 13 years old to use Minara. By creating an account, you represent that you meet this age requirement and that the information you provide is accurate.
            </p>
          </ManCard>

          <ManCard style={{ padding: 24 }}>
            <h2 className="t-h4" style={{ color: "var(--ink-900)" }}>3. User Accounts</h2>
            <p className="mt-3 t-body" style={{ color: "var(--ink-700)", lineHeight: 1.7 }}>
              You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. You must notify us immediately of any unauthorized access. We reserve the right to suspend or terminate accounts that violate these terms.
            </p>
          </ManCard>

          <ManCard style={{ padding: 24 }}>
            <h2 className="t-h4" style={{ color: "var(--ink-900)" }}>4. Business Listings</h2>
            <p className="mt-3 t-body" style={{ color: "var(--ink-700)", lineHeight: 1.7 }}>
              Business owners are responsible for the accuracy of their listing information, including halal certification claims. Minara does not independently verify all listings; our verification badge indicates that we have reviewed submitted documentation, not that we guarantee ongoing compliance. Misrepresentation of halal status may result in immediate removal and potential legal action.
            </p>
          </ManCard>

          <ManCard style={{ padding: 24 }}>
            <h2 className="t-h4" style={{ color: "var(--ink-900)" }}>5. Reviews & Community Content</h2>
            <p className="mt-3 t-body" style={{ color: "var(--ink-700)", lineHeight: 1.7 }}>
              You retain ownership of content you submit (reviews, posts, photos), but grant Minara a worldwide, royalty-free license to display, distribute, and moderate that content on the platform. You agree not to submit false reviews, spam, hate speech, or content that violates others&apos; rights. We may remove any content that violates these terms without notice.
            </p>
          </ManCard>

          <ManCard style={{ padding: 24 }}>
            <h2 className="t-h4" style={{ color: "var(--ink-900)" }}>6. Bookings</h2>
            <p className="mt-3 t-body" style={{ color: "var(--ink-700)", lineHeight: 1.7 }}>
              Minara facilitates booking requests between consumers and business owners. We are not a party to the appointment itself and are not liable for no-shows, cancellations, or disputes arising from bookings. Business owners set their own availability and cancellation policies.
            </p>
          </ManCard>

          <ManCard style={{ padding: 24 }}>
            <h2 className="t-h4" style={{ color: "var(--ink-900)" }}>7. Prohibited Conduct</h2>
            <p className="mt-3 t-body" style={{ color: "var(--ink-700)", lineHeight: 1.7 }}>
              You may not use Minara to: scrape or harvest data without permission; attempt to access accounts that are not yours; post fraudulent business listings or reviews; harass or threaten other users; or violate any applicable laws.
            </p>
          </ManCard>

          <ManCard style={{ padding: 24 }}>
            <h2 className="t-h4" style={{ color: "var(--ink-900)" }}>8. Intellectual Property</h2>
            <p className="mt-3 t-body" style={{ color: "var(--ink-700)", lineHeight: 1.7 }}>
              The Minara name, logo, design, and platform code are owned by Minara and protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without our written permission.
            </p>
          </ManCard>

          <ManCard style={{ padding: 24 }}>
            <h2 className="t-h4" style={{ color: "var(--ink-900)" }}>9. Disclaimers & Limitation of Liability</h2>
            <p className="mt-3 t-body" style={{ color: "var(--ink-700)", lineHeight: 1.7 }}>
              Minara is provided &quot;as is&quot; without warranties of any kind. We are not liable for indirect, incidental, or consequential damages arising from your use of the platform. Our total liability to you for any claim is limited to $100 USD or the amount you paid us in the preceding 12 months, whichever is greater.
            </p>
          </ManCard>

          <ManCard style={{ padding: 24 }}>
            <h2 className="t-h4" style={{ color: "var(--ink-900)" }}>10. Changes to Terms</h2>
            <p className="mt-3 t-body" style={{ color: "var(--ink-700)", lineHeight: 1.7 }}>
              We may update these terms from time to time. We will notify you of material changes at least 14 days in advance. Continued use of Minara after the effective date constitutes acceptance of the updated terms.
            </p>
          </ManCard>

          <ManCard style={{ padding: 24 }}>
            <h2 className="t-h4" style={{ color: "var(--ink-900)" }}>11. Contact</h2>
            <p className="mt-3 t-body" style={{ color: "var(--ink-700)", lineHeight: 1.7 }}>
              Questions about these terms? Contact us at{" "}
              <a href="mailto:legal@minara.market" style={{ color: "var(--moss-700)" }}>legal@minara.market</a>.
            </p>
          </ManCard>
        </div>

        <div className="mt-8">
          <Link href="/privacy"><Button variant="outline" size="sm">Read Privacy Policy →</Button></Link>
        </div>
      </div>
    </div>
  );
}
