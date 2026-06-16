"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/man/primitives";
import { useMockSession, useMockSignOut } from "@/components/mock-session-provider";
import { switchMockRole } from "@/lib/mock-auth";
import { Bell, Menu, X, ChevronDown, LogOut, User, Store, Check, Bookmark, Search, MessageCircle, Settings, LifeBuoy } from "lucide-react";

type Tab = { l: string; href: string };

const SIGNED_OUT: Tab[] = [
  { l: "Home", href: "/" },
  { l: "Browse", href: "/search" },
  { l: "For Businesses", href: "/for-business" },
  { l: "About", href: "/about" },
];
const CONSUMER: Tab[] = [
  { l: "Home", href: "/" },
  { l: "Browse", href: "/search" },
];
// Business owners navigate via the OwnerShell sidebar — no top-nav tabs needed.
const BUSINESS: Tab[] = [];

export function Header() {
  const { data: session } = useMockSession();
  const signOut = useMockSignOut();
  const pathname = usePathname() || "";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [acctOpen, setAcctOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const acctRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => { if (acctRef.current && !acctRef.current.contains(e.target as Node)) setAcctOpen(false); };
    if (acctOpen) document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [acctOpen]);

  // Auth screens use a standalone AuthShell — no marketing header
  if (/^\/(login|register|forgot-password|reset-password|verify-email|link-account)/.test(pathname)) return null;

  const signedIn = !!session;
  const role = session?.user?.role;
  const isOwner = role === "BUSINESS_OWNER";
  const isAdmin = role === "ADMIN";
  const isConsumer = signedIn && !isOwner && !isAdmin;
  const acctLinks = [
    { l: "Account Home", href: "/account", Icon: User },
    { l: "Saved Lists", href: "/account/lists", Icon: Bookmark },
    { l: "Saved Searches", href: "/account/searches", Icon: Search },
    { l: "Messages", href: "/inbox", Icon: MessageCircle },
    { l: "Settings", href: "/account/settings", Icon: Settings },
    { l: "Help & Support", href: "/account/help", Icon: LifeBuoy },
  ];
  // Owners and admins navigate via their own shell sidebars — no top-nav tabs.
  const tabs = !signedIn ? SIGNED_OUT : (isOwner || isAdmin) ? BUSINESS : CONSUMER;
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const homeHref = !signedIn ? "/" : isOwner ? "/dashboard" : isAdmin ? "/admin" : "/";
  const notifHref = isOwner ? "/dashboard/notifications" : "/notifications";
  // What the avatar dropdown leads with — the business for owners, otherwise the person
  const acctName = isOwner ? "Famous Kabob" : (session?.user?.name || "Your account");
  const acctSub = isAdmin ? "Admin console" : isOwner ? "Business account" : "Customer account";

  // Switch between the customer and business experiences (mock)
  const switchTo = (target: "CONSUMER" | "BUSINESS_OWNER") => {
    if (target === role) { setAcctOpen(false); return; }
    switchMockRole(target);
    window.location.href = target === "BUSINESS_OWNER" ? "/dashboard" : "/";
  };

  return (
    <header style={{ height: 64, borderBottom: "1px solid var(--card-edge)", background: "var(--paper)", boxShadow: scrolled ? "0 4px 16px -8px rgba(17,50,30,0.22)" : "none", transition: "box-shadow 0.2s" }}
      className="sticky top-0 z-[1000] flex items-center justify-between px-5 sm:px-8">
      {/* Left: logo + tabs */}
      <div className="flex items-center gap-9">
        <Link href={homeHref} className="t-h4" style={{ color: "var(--moss-700)", fontWeight: 600 }}>
          Manaakhah
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {tabs.map((t) => (
            <Link key={t.href} href={t.href} className="man-focus rounded-lg px-3 py-2"
              style={{ fontSize: 13, fontWeight: 500, color: isActive(t.href) ? "var(--ink-900)" : "var(--ink-500)", background: isActive(t.href) ? "#ffffff" : "transparent" }}>
              {t.l}
            </Link>
          ))}
        </nav>
      </div>

      {/* Right: auth actions OR bell + avatar */}
      <div className="flex items-center gap-2.5">
        {!signedIn ? (
          <>
            <Link href="/login"><Button variant="ghost" size="sm">Sign In</Button></Link>
            <Link href="/register"><Button size="sm">Sign Up</Button></Link>
          </>
        ) : (
          <>
            {!isAdmin && (
              <Link href={notifHref} className="hidden rounded-full p-2 hover:bg-[var(--paper-2)] md:block" aria-label="Notifications">
                <Bell className="h-5 w-5" style={{ color: "var(--ink-500)" }} />
              </Link>
            )}
            <div ref={acctRef} className="relative">
              <button onClick={() => setAcctOpen((o) => !o)} className="flex items-center gap-1.5" aria-label="Account menu">
                <Avatar name={session?.user?.name || "User"} size={32} />
                <ChevronDown className="hidden h-4 w-4 md:block" style={{ color: "var(--ink-400)", transform: acctOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
              </button>
              {acctOpen && (
                <div className="absolute right-0 mt-2 w-60 overflow-hidden rounded-[12px] border py-1.5" style={{ background: "#ffffff", borderColor: "var(--card-edge)", boxShadow: "var(--shadow-lift)" }}>
                  <div className="flex items-center gap-3 px-4 py-4" style={{ borderBottom: "1px solid var(--card-edge)" }}>
                    <Avatar name={acctName} size={44} />
                    <div className="min-w-0">
                      <div className="t-h4 truncate" style={{ color: "var(--ink-900)" }}>{acctName}</div>
                      <div className="t-body-xs truncate" style={{ color: "var(--ink-500)" }}>{acctSub}</div>
                    </div>
                  </div>
                  {isConsumer && (
                    <div className="py-1" style={{ borderBottom: "1px solid var(--card-edge)" }}>
                      {acctLinks.map((it) => (
                        <Link key={it.href} href={it.href} onClick={() => setAcctOpen(false)} className="man-focus flex items-center gap-2.5 px-4 py-2.5 t-body-sm hover:bg-[var(--paper-2)]" style={{ color: "var(--ink-700)" }}>
                          <it.Icon size={16} style={{ color: "var(--ink-500)" }} /> {it.l}
                        </Link>
                      ))}
                    </div>
                  )}
                  {!isAdmin && (
                    <div className="py-1" style={{ borderTop: "1px solid var(--card-edge)" }}>
                      <div className="px-4 pb-1 pt-1.5 t-eyebrow" style={{ color: "var(--ink-500)" }}>Switch account</div>
                      <button onClick={() => switchTo("CONSUMER")} className="man-focus flex w-full items-center gap-2.5 px-4 py-2.5 text-left t-body-sm hover:bg-[var(--paper-2)]" style={{ color: "var(--ink-700)" }}>
                        <User size={16} style={{ color: "var(--ink-500)" }} /> <span className="flex-1">Customer</span> {role === "CONSUMER" && <Check size={15} style={{ color: "var(--moss-700)" }} />}
                      </button>
                      <button onClick={() => switchTo("BUSINESS_OWNER")} className="man-focus flex w-full items-center gap-2.5 px-4 py-2.5 text-left t-body-sm hover:bg-[var(--paper-2)]" style={{ color: "var(--ink-700)" }}>
                        <Store size={16} style={{ color: "var(--ink-500)" }} /> <span className="flex-1">Business</span> {role === "BUSINESS_OWNER" && <Check size={15} style={{ color: "var(--moss-700)" }} />}
                      </button>
                    </div>
                  )}
                  <div className="py-1" style={{ borderTop: "1px solid var(--card-edge)" }}>
                    <button onClick={() => { setAcctOpen(false); signOut(); }} className="man-focus flex w-full items-center gap-2.5 px-4 py-2.5 text-left t-body-sm hover:bg-[var(--paper-2)]" style={{ color: "var(--err-500)" }}><LogOut size={16} /> Sign Out</button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
        <button className="md:hidden" onClick={() => setMobileOpen((o) => !o)} aria-label="Menu">
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="absolute left-0 right-0 top-16 border-b bg-white p-4 md:hidden" style={{ borderColor: "var(--card-edge)" }}>
          <nav className="flex flex-col gap-1">
            {tabs.map((t) => (
              <Link key={t.href} href={t.href} onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 t-body" style={{ color: "var(--ink-700)" }}>{t.l}</Link>
            ))}
            {!signedIn && (
              <div className="mt-2 flex gap-2 border-t pt-3" style={{ borderColor: "var(--card-edge)" }}>
                <Link href="/login" className="flex-1" onClick={() => setMobileOpen(false)}><Button variant="outline" className="w-full">Sign In</Button></Link>
                <Link href="/register" className="flex-1" onClick={() => setMobileOpen(false)}><Button className="w-full">Sign Up</Button></Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
