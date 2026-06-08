"use client";

import { OwnerShell } from "@/components/owner/OwnerShell";
import { AuthedHelp } from "@/components/help/AuthedHelp";

export default function OwnerHelpPage() {
  return (
    <OwnerShell active="help">
      <AuthedHelp role="owner" />
    </OwnerShell>
  );
}
