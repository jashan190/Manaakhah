"use client";

import { AccountShell } from "@/components/account/AccountShell";
import { AuthedHelp } from "@/components/help/AuthedHelp";

export default function ConsumerHelpPage() {
  return (
    <AccountShell active="help">
      <AuthedHelp role="consumer" />
    </AccountShell>
  );
}
