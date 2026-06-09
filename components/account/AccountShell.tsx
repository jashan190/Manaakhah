// Lightweight wrapper for the customer account pages.
// Customers don't get a formal dashboard sidebar — account pages are reached
// from the avatar menu in the top nav and render as simple centered pages.
// `active` is accepted for backwards-compatibility but no longer used.
export function AccountShell({ children }: { active?: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "var(--paper)", minHeight: "calc(100vh - 64px)" }}>
      <div className="mx-auto w-full max-w-[1040px]">{children}</div>
    </div>
  );
}
