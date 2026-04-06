"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMockSession } from "@/components/mock-session-provider";
import Link from "next/link";

interface Referral {
  id: string;
  referrerId: string;
  referredId: string;
  code: string;
  status: string;
  rewardAmount: number | null;
  rewardedAt: string | null;
  createdAt: string;
  referred?: {
    id: string;
    name: string | null;
    email: string | null;
  };
}

interface ReferralStats {
  total: number;
  completed: number;
  totalEarned: number;
}

export default function ReferralProgramPage() {
  const { data: session } = useMockSession();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [referralCode, setReferralCode] = useState("");
  const [stats, setStats] = useState<ReferralStats>({ total: 0, completed: 0, totalEarned: 0 });
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteStatus, setInviteStatus] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user?.id) loadData();
  }, [session?.user?.id]);

  const loadData = async () => {
    try {
      const res = await fetch("/api/referrals");
      if (res.ok) {
        const data = await res.json();
        setReferrals(data.referrals || []);
        setReferralCode(data.code || "");
        setStats(data.stats || { total: 0, completed: 0, totalEarned: 0 });
      }
    } catch (err) {
      console.error("Error loading referrals:", err);
    } finally {
      setLoading(false);
    }
  };

  const getReferralLink = () => {
    return `${typeof window !== "undefined" ? window.location.origin : ""}/register?ref=${referralCode}`;
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getReferralLink());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;

    setInviteStatus(null);
    try {
      const res = await fetch("/api/referrals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail }),
      });
      const data = await res.json();
      if (res.ok) {
        setInviteStatus(data.message || "Invite sent!");
        setInviteEmail("");
        await loadData();
      } else {
        setInviteStatus(data.error || "Failed to send invite");
      }
    } catch {
      setInviteStatus("Network error");
    }
  };

  const handleShare = (platform: string) => {
    const link = getReferralLink();
    const text = "Join Manaakhah - The best platform to discover Muslim-owned businesses in your community! Use my referral link:";

    switch (platform) {
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + link)}`);
        break;
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(link)}`);
        break;
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`);
        break;
      case "email":
        window.open(`mailto:?subject=${encodeURIComponent("Join Manaakhah!")}&body=${encodeURIComponent(text + "\n\n" + link)}`);
        break;
    }
  };

  if (!session?.user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-600">Please log in to view your referrals.</p>
            <Link href="/login">
              <Button className="mt-4">Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Refer Friends, Earn Rewards</h1>
        <p className="text-gray-600">
          Share Manaakhah with friends and family. Earn $5 for every successful referral!
        </p>
      </div>

      {/* How It Works */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">1</span>
              </div>
              <h3 className="font-semibold mb-1">Share Your Link</h3>
              <p className="text-sm text-gray-600">
                Send your unique referral link to friends and family
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">2</span>
              </div>
              <h3 className="font-semibold mb-1">They Sign Up</h3>
              <p className="text-sm text-gray-600">
                Your friend creates an account using your link
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">3</span>
              </div>
              <h3 className="font-semibold mb-1">Earn Rewards</h3>
              <p className="text-sm text-gray-600">
                You both get $5 credit when they write their first review!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Your Referral Link */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Your Referral Link</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input
              value={getReferralLink()}
              readOnly
              className="flex-1 bg-gray-50"
            />
            <Button onClick={handleCopyLink}>
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm text-gray-500">Or share your code:</span>
            <div className="flex items-center gap-2">
              <code className="px-3 py-1 bg-gray-100 rounded font-mono text-lg">
                {referralCode}
              </code>
              <Button variant="outline" size="sm" onClick={handleCopyCode}>
                Copy
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-500 mr-2">Share via:</span>
            <Button variant="outline" size="sm" onClick={() => handleShare("whatsapp")}>
              WhatsApp
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleShare("twitter")}>
              Twitter
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleShare("facebook")}>
              Facebook
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleShare("email")}>
              Email
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Send Direct Invite */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Send Direct Invite</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSendInvite} className="flex gap-2">
            <Input
              type="email"
              placeholder="Enter friend's email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">Send Invite</Button>
          </form>
          {inviteStatus && (
            <p className="text-sm mt-2 text-green-600">{inviteStatus}</p>
          )}
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-green-600">
              ${stats.totalEarned.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">Total Earned</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-purple-600">
              {stats.completed}
            </div>
            <div className="text-sm text-gray-600">Successful Referrals</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-orange-600">
              {stats.total}
            </div>
            <div className="text-sm text-gray-600">Total Invites</div>
          </CardContent>
        </Card>
      </div>

      {/* Referral History */}
      <Card>
        <CardHeader>
          <CardTitle>Referral History</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-4">Loading...</p>
          ) : referrals.length === 0 ? (
            <p className="text-center py-8 text-gray-500">
              No referrals yet. Share your link to start earning!
            </p>
          ) : (
            <div className="space-y-3">
              {referrals.map((referral) => (
                <div
                  key={referral.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">
                      {referral.referred?.name || referral.referred?.email || "User"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Invited on {new Date(referral.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        referral.status === "completed" || referral.status === "rewarded"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
                    </span>
                    {referral.rewardAmount && (
                      <p className="text-sm text-green-600 mt-1">
                        +${referral.rewardAmount.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
