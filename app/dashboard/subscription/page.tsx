"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useMockSession } from "@/components/mock-session-provider";
import Link from "next/link";

interface Plan {
  id: string;
  code: string;
  name: string;
  description: string;
  tier: string;
  amount: number;
  currency: string;
  billingCycle: string;
  features: string[];
}

interface PaymentMethodData {
  id: string;
  type: string;
  label: string | null;
  brand: string | null;
  last4: string | null;
  expMonth: number | null;
  expYear: number | null;
  accountHint: string | null;
  isDefault: boolean;
}

interface BusinessSub {
  id: string;
  name: string;
  subscriptionTier: string | null;
  subscriptionExpires: string | null;
  subscriptions: {
    id: string;
    status: string;
    cancelAtPeriodEnd: boolean;
    currentPeriodStart: string;
    currentPeriodEnd: string;
    plan: Plan;
    paymentMethod: PaymentMethodData | null;
    invoices: {
      id: string;
      amount: number;
      currency: string;
      status: string;
      periodStart: string;
      periodEnd: string;
      paidAt: string | null;
    }[];
  }[];
}

export default function SubscriptionPage() {
  const { data: session } = useMockSession();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [businesses, setBusinesses] = useState<BusinessSub[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodData[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [paymentForm, setPaymentForm] = useState({
    type: "CARD" as string,
    brand: "",
    last4: "",
    expMonth: "",
    expYear: "",
    label: "",
    isDefault: true,
  });

  useEffect(() => {
    if (session?.user?.id) loadData();
  }, [session?.user?.id]);

  const loadData = async () => {
    try {
      const res = await fetch("/api/subscriptions");
      if (res.ok) {
        const data = await res.json();
        setPlans(data.plans || []);
        setBusinesses(data.businesses || []);
        setPaymentMethods(data.paymentMethods || []);
      }
    } catch (err) {
      console.error("Failed to load subscriptions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (businessId: string, planCode: string) => {
    setActionLoading(`sub-${businessId}`);
    try {
      const defaultMethod = paymentMethods.find((m) => m.isDefault);
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId,
          planCode,
          paymentMethodId: defaultMethod?.id,
        }),
      });
      if (res.ok) {
        await loadData();
        setSelectedBusiness(null);
        setSelectedPlan(null);
      } else {
        const err = await res.json();
        alert(err.error || "Failed to subscribe");
      }
    } catch {
      alert("Network error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (subscriptionId: string, immediate: boolean) => {
    const msg = immediate
      ? "Cancel immediately? Your plan will end now."
      : "Cancel at end of billing period?";
    if (!confirm(msg)) return;

    setActionLoading(`cancel-${subscriptionId}`);
    try {
      const res = await fetch(`/api/subscriptions/${subscriptionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(immediate ? { immediate: true } : { cancelAtPeriodEnd: true }),
      });
      if (res.ok) await loadData();
      else alert("Failed to cancel");
    } catch {
      alert("Network error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReactivate = async (subscriptionId: string) => {
    setActionLoading(`react-${subscriptionId}`);
    try {
      const res = await fetch(`/api/subscriptions/${subscriptionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reactivate: true }),
      });
      if (res.ok) await loadData();
    } catch {
      alert("Network error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleAddPaymentMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading("add-payment");
    try {
      const res = await fetch("/api/payment-methods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: paymentForm.type,
          brand: paymentForm.brand || undefined,
          last4: paymentForm.last4 || undefined,
          expMonth: paymentForm.expMonth ? parseInt(paymentForm.expMonth) : undefined,
          expYear: paymentForm.expYear ? parseInt(paymentForm.expYear) : undefined,
          label: paymentForm.label || undefined,
          isDefault: paymentForm.isDefault,
        }),
      });
      if (res.ok) {
        await loadData();
        setShowAddPayment(false);
        setPaymentForm({ type: "CARD", brand: "", last4: "", expMonth: "", expYear: "", label: "", isDefault: true });
      } else {
        const err = await res.json();
        alert(err.error || "Failed to add payment method");
      }
    } catch {
      alert("Network error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeletePaymentMethod = async (id: string) => {
    if (!confirm("Remove this payment method?")) return;
    setActionLoading(`del-${id}`);
    try {
      const res = await fetch(`/api/payment-methods/${id}`, { method: "DELETE" });
      if (res.ok) await loadData();
      else {
        const err = await res.json();
        alert(err.error || "Failed to remove");
      }
    } catch {
      alert("Network error");
    } finally {
      setActionLoading(null);
    }
  };

  const tierColor = (tier: string) => {
    switch (tier) {
      case "BASIC": return "bg-blue-100 text-blue-700";
      case "PROFESSIONAL": return "bg-purple-100 text-purple-700";
      case "ENTERPRISE": return "bg-orange-100 text-orange-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  if (!session?.user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card><CardContent className="p-8 text-center">
          <p className="text-gray-600 mb-4">Please log in to manage subscriptions.</p>
          <Link href="/login"><Button>Sign In</Button></Link>
        </CardContent></Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">Loading subscription data...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Subscription Management</h1>
          <p className="text-gray-600 mt-1">Manage plans and billing for your businesses</p>
        </div>
        <Link href="/dashboard"><Button variant="outline">Back to Dashboard</Button></Link>
      </div>

      {/* Plans */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {plans.filter(p => p.amount > 0).map((plan) => (
          <Card key={plan.id} className={selectedPlan === plan.code ? "ring-2 ring-green-500" : ""}>
            <CardHeader className="pb-2">
              <Badge className={tierColor(plan.tier)}>{plan.tier}</Badge>
              <CardTitle className="text-xl mt-2">{plan.name}</CardTitle>
              <p className="text-sm text-gray-600">{plan.description}</p>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-4">
                ${plan.amount}<span className="text-sm font-normal text-gray-500">/{plan.billingCycle === "MONTHLY" ? "mo" : "yr"}</span>
              </div>
              <ul className="space-y-2 mb-4">
                {(plan.features as string[]).map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-green-500 mt-0.5">&#10003;</span>
                    {f}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* My Businesses & Subscriptions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>My Businesses</CardTitle>
        </CardHeader>
        <CardContent>
          {businesses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No businesses found. <Link href="/dashboard/new-listing" className="text-green-600 hover:underline">Add a business</Link> first.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {businesses.map((biz) => {
                const activeSub = biz.subscriptions?.[0];
                const isActive = activeSub?.status === "ACTIVE" || activeSub?.status === "TRIALING";

                return (
                  <div key={biz.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{biz.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={tierColor(biz.subscriptionTier || "FREE")}>
                            {biz.subscriptionTier || "FREE"}
                          </Badge>
                          {biz.subscriptionExpires && (
                            <span className="text-xs text-gray-500">
                              Expires {new Date(biz.subscriptionExpires).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>

                      {isActive && activeSub ? (
                        <div className="flex gap-2">
                          {activeSub.cancelAtPeriodEnd ? (
                            <Button
                              size="sm"
                              onClick={() => handleReactivate(activeSub.id)}
                              disabled={actionLoading === `react-${activeSub.id}`}
                            >
                              {actionLoading === `react-${activeSub.id}` ? "..." : "Reactivate"}
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCancel(activeSub.id, false)}
                              disabled={actionLoading === `cancel-${activeSub.id}`}
                            >
                              {actionLoading === `cancel-${activeSub.id}` ? "..." : "Cancel"}
                            </Button>
                          )}
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => setSelectedBusiness(selectedBusiness === biz.id ? null : biz.id)}
                        >
                          {selectedBusiness === biz.id ? "Hide Plans" : "Subscribe"}
                        </Button>
                      )}
                    </div>

                    {activeSub && isActive && (
                      <div className="bg-gray-50 rounded p-3 text-sm">
                        <div className="flex items-center justify-between">
                          <span>Plan: <strong>{activeSub.plan.name}</strong></span>
                          <span>Status: <Badge variant={activeSub.cancelAtPeriodEnd ? "secondary" : "default"}>
                            {activeSub.cancelAtPeriodEnd ? "Canceling" : activeSub.status}
                          </Badge></span>
                        </div>
                        <div className="text-gray-500 mt-1">
                          Period: {new Date(activeSub.currentPeriodStart).toLocaleDateString()} – {new Date(activeSub.currentPeriodEnd).toLocaleDateString()}
                        </div>
                        {activeSub.invoices.length > 0 && (
                          <div className="mt-2 pt-2 border-t">
                            <p className="font-medium mb-1">Recent Invoices</p>
                            {activeSub.invoices.map(inv => (
                              <div key={inv.id} className="flex justify-between text-xs text-gray-500">
                                <span>${inv.amount} ({inv.status})</span>
                                <span>{inv.paidAt ? new Date(inv.paidAt).toLocaleDateString() : "Unpaid"}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {selectedBusiness === biz.id && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm font-medium mb-3">Select a plan:</p>
                        <div className="grid md:grid-cols-3 gap-3">
                          {plans.filter(p => p.amount > 0).map(plan => (
                            <button
                              key={plan.code}
                              onClick={() => handleSubscribe(biz.id, plan.code)}
                              disabled={actionLoading === `sub-${biz.id}`}
                              className="border rounded-lg p-3 text-left hover:border-green-500 hover:bg-green-50 transition-colors"
                            >
                              <p className="font-semibold">{plan.name}</p>
                              <p className="text-lg font-bold mt-1">${plan.amount}/mo</p>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Payment Methods</CardTitle>
            <Button size="sm" onClick={() => setShowAddPayment(!showAddPayment)}>
              {showAddPayment ? "Cancel" : "+ Add Method"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showAddPayment && (
            <form onSubmit={handleAddPaymentMethod} className="mb-6 p-4 border rounded-lg space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  value={paymentForm.type}
                  onChange={(e) => setPaymentForm({...paymentForm, type: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="CARD">Card</option>
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                  <option value="ZELLE">Zelle</option>
                  <option value="CASH_APP">Cash App</option>
                  <option value="MANUAL">Manual / Other</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Label</label>
                  <Input
                    value={paymentForm.label}
                    onChange={(e) => setPaymentForm({...paymentForm, label: e.target.value})}
                    placeholder="e.g. My Visa"
                  />
                </div>
                {paymentForm.type === "CARD" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">Brand</label>
                      <Input
                        value={paymentForm.brand}
                        onChange={(e) => setPaymentForm({...paymentForm, brand: e.target.value})}
                        placeholder="Visa, Mastercard..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Last 4 digits</label>
                      <Input
                        value={paymentForm.last4}
                        onChange={(e) => setPaymentForm({...paymentForm, last4: e.target.value.replace(/\D/g, "").slice(0, 4)})}
                        placeholder="1234"
                        maxLength={4}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm font-medium mb-1">Exp Month</label>
                        <Input
                          value={paymentForm.expMonth}
                          onChange={(e) => setPaymentForm({...paymentForm, expMonth: e.target.value})}
                          placeholder="MM"
                          maxLength={2}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Exp Year</label>
                        <Input
                          value={paymentForm.expYear}
                          onChange={(e) => setPaymentForm({...paymentForm, expYear: e.target.value})}
                          placeholder="YYYY"
                          maxLength={4}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={paymentForm.isDefault}
                  onChange={(e) => setPaymentForm({...paymentForm, isDefault: e.target.checked})}
                  className="w-4 h-4"
                />
                <label className="text-sm">Set as default payment method</label>
              </div>
              <Button type="submit" disabled={actionLoading === "add-payment"}>
                {actionLoading === "add-payment" ? "Saving..." : "Save Payment Method"}
              </Button>
            </form>
          )}

          {paymentMethods.length === 0 && !showAddPayment ? (
            <p className="text-center py-4 text-gray-500">No payment methods saved yet.</p>
          ) : (
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">
                      {method.type === "CARD" ? "💳" : method.type === "BANK_TRANSFER" ? "🏦" : method.type === "ZELLE" ? "⚡" : "💵"}
                    </span>
                    <div>
                      <p className="font-medium">
                        {method.label || method.type.replace("_", " ")}
                        {method.isDefault && <Badge className="ml-2" variant="secondary">Default</Badge>}
                      </p>
                      {method.last4 && (
                        <p className="text-sm text-gray-500">
                          {method.brand && `${method.brand} `}****{method.last4}
                          {method.expMonth && method.expYear && ` (${method.expMonth}/${method.expYear})`}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeletePaymentMethod(method.id)}
                    disabled={actionLoading === `del-${method.id}`}
                    className="text-red-600 hover:bg-red-50"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
