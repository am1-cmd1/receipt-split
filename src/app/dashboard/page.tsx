"use client";

import { useState, useEffect } from "react";
import { Camera, Upload, Receipt, Users, Share2, ArrowLeft, Plus, X, MessageCircle, Link2, Copy, Check, ChevronDown, History, Crown, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

interface ReceiptItem {
  id: number;
  name: string;
  price: number;
  assignedTo: string[];
}

interface Person {
  name: string;
  color: string;
}

const MOCK_ITEMS: ReceiptItem[] = [
  { id: 1, name: "Peri Peri Chicken", price: 12.5, assignedTo: [] },
  { id: 2, name: "Halloumi Sticks x2", price: 5.5, assignedTo: [] },
  { id: 3, name: "Butterfly Burger", price: 11.25, assignedTo: [] },
  { id: 4, name: "Garlic Bread", price: 3.95, assignedTo: [] },
  { id: 5, name: "Coca Cola", price: 2.95, assignedTo: [] },
  { id: 6, name: "Lemonade", price: 2.95, assignedTo: [] },
  { id: 7, name: "Still Water", price: 1.95, assignedTo: [] },
  { id: 8, name: "Chocolate Cake", price: 5.75, assignedTo: [] },
];

const COLORS = [
  "bg-blue-500", "bg-emerald-500", "bg-purple-500", "bg-orange-500",
  "bg-pink-500", "bg-teal-500", "bg-red-500", "bg-yellow-500",
];

const COLOR_LIGHT: Record<string, string> = {
  "bg-blue-500": "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  "bg-emerald-500": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  "bg-purple-500": "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  "bg-orange-500": "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  "bg-pink-500": "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300",
  "bg-teal-500": "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300",
  "bg-red-500": "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  "bg-yellow-500": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
};

type Stage = "upload" | "scanning" | "split" | "summary";

function TrialBanner() {
  const [hoursLeft] = useState(48);
  const [upgrading, setUpgrading] = useState(false);
  const { user } = useAuth();

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.id, email: user?.email }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else setUpgrading(false);
    } catch {
      setUpgrading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2.5 flex items-center justify-between text-sm">
      <span>✨ {hoursLeft} hours left in your free trial</span>
      <button
        onClick={handleUpgrade}
        disabled={upgrading}
        className="px-3 py-1 bg-white text-indigo-600 rounded-full font-semibold text-xs hover:bg-indigo-50 transition disabled:opacity-50 flex items-center gap-1"
      >
        <Crown className="w-3 h-3" />
        {upgrading ? "..." : "Upgrade to Pro"}
      </button>
    </div>
  );
}

export default function Dashboard() {
  const { user, loading, isConfigured, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isConfigured && !user) {
      router.push("/auth/sign-in");
    }
  }, [user, loading, isConfigured, router]);

  const [stage, setStage] = useState<Stage>("upload");
  const [items, setItems] = useState<ReceiptItem[]>(MOCK_ITEMS);
  const [people, setPeople] = useState<Person[]>([
    { name: "You", color: COLORS[0] },
    { name: "Sam", color: COLORS[1] },
    { name: "Jordan", color: COLORS[2] },
  ]);
  const [selectedPerson, setSelectedPerson] = useState<string>("You");
  const [tipPercent, setTipPercent] = useState(10);
  const [newPersonName, setNewPersonName] = useState("");
  const [showAddPerson, setShowAddPerson] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showTipDropdown, setShowTipDropdown] = useState(false);

  const subtotal = items.reduce((s, i) => s + i.price, 0);
  const tipAmount = subtotal * (tipPercent / 100);
  const total = subtotal + tipAmount;

  const handleUpload = () => {
    setStage("scanning");
    setTimeout(() => setStage("split"), 1500);
  };

  const toggleAssign = (itemId: number) => {
    setItems(prev =>
      prev.map(item => {
        if (item.id !== itemId) return item;
        const assigned = item.assignedTo.includes(selectedPerson)
          ? item.assignedTo.filter(p => p !== selectedPerson)
          : [...item.assignedTo, selectedPerson];
        return { ...item, assignedTo: assigned };
      })
    );
  };

  const getPersonTotal = (personName: string) => {
    let personTotal = 0;
    items.forEach(item => {
      if (item.assignedTo.includes(personName)) {
        personTotal += item.price / item.assignedTo.length;
      }
    });
    const share = personTotal / subtotal;
    return personTotal + tipAmount * share;
  };

  const addPerson = () => {
    if (newPersonName.trim() && !people.find(p => p.name === newPersonName.trim())) {
      setPeople([...people, { name: newPersonName.trim(), color: COLORS[people.length % COLORS.length] }]);
      setNewPersonName("");
      setShowAddPerson(false);
    }
  };

  const handleCopy = () => {
    const summary = people.map(p => `${p.name}: £${getPersonTotal(p.name).toFixed(2)}`).join("\n");
    navigator.clipboard.writeText(`ReceiptSplit Summary\n${items[0]?.name ? "Nando's" : "Receipt"} — £${total.toFixed(2)}\n\n${summary}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading && isConfigured) {
    return <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center"><div className="animate-pulse text-gray-400">Loading...</div></div>;
  }

  // Upload stage
  if (stage === "upload") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <TrialBanner />
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 h-14 flex items-center justify-between">
          <button onClick={() => signOut()} className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm">
            <LogOut className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center">
              <Receipt className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold">ReceiptSplit</span>
          </div>
          <Link href="/history" className="text-gray-500 hover:text-gray-700">
            <History className="w-5 h-5" />
          </Link>
        </header>

        <div className="max-w-md mx-auto px-4 pt-12">
          <h1 className="text-2xl font-bold mb-2">Scan a receipt</h1>
          <p className="text-gray-500 mb-8">Take a photo or upload an image to get started</p>

          <div className="space-y-4">
            <button
              onClick={handleUpload}
              className="w-full flex items-center gap-4 p-6 bg-white dark:bg-gray-900 rounded-2xl border-2 border-dashed border-indigo-300 dark:border-indigo-700 hover:border-indigo-500 transition group"
            >
              <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center group-hover:bg-indigo-200 transition">
                <Camera className="w-7 h-7 text-indigo-600" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-lg">Take Photo</div>
                <div className="text-sm text-gray-500">Use your camera to scan a receipt</div>
              </div>
            </button>

            <button
              onClick={handleUpload}
              className="w-full flex items-center gap-4 p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-indigo-400 transition group"
            >
              <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-indigo-100 transition">
                <Upload className="w-7 h-7 text-gray-600 group-hover:text-indigo-600" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-lg">Upload Image</div>
                <div className="text-sm text-gray-500">Select a photo from your gallery</div>
              </div>
            </button>
          </div>

          <div className="mt-12">
            <h2 className="font-semibold text-sm text-gray-400 uppercase tracking-wider mb-4">Recent Splits</h2>
            {[
              { place: "Pizza Express", date: "Yesterday", total: "£34.50", people: 3 },
              { place: "Wagamama", date: "3 days ago", total: "£52.80", people: 4 },
              { place: "Greggs", date: "Last week", total: "£8.45", people: 2 },
            ].map((s, i) => (
              <button
                key={i}
                onClick={() => { setStage("split"); }}
                className="w-full flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 px-2 rounded-lg transition"
              >
                <div className="text-left">
                  <div className="font-medium">{s.place}</div>
                  <div className="text-sm text-gray-500">{s.date} · {s.people} people</div>
                </div>
                <span className="font-semibold">{s.total}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Scanning stage
  if (stage === "scanning") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Receipt className="w-10 h-10 text-indigo-500" />
          </div>
          <h2 className="text-xl font-bold mb-2">Reading receipt...</h2>
          <p className="text-gray-500">AI is extracting items and prices</p>
          <div className="mt-6 w-48 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full animate-[loading_1.5s_ease-in-out]" style={{ animation: "loading 1.5s ease-in-out forwards" }} />
          </div>
          <style>{`@keyframes loading { from { width: 0% } to { width: 100% } }`}</style>
        </div>
      </div>
    );
  }

  // Summary / Share
  if (stage === "summary") {
    const unassigned = items.filter(i => i.assignedTo.length === 0);
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 h-14 flex items-center justify-between">
          <button onClick={() => setStage("split")} className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="font-bold">Summary</span>
          <div className="w-5" />
        </header>

        <div className="max-w-md mx-auto px-4 pt-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden mb-6">
            <div className="bg-indigo-500 px-5 py-4">
              <div className="text-white/80 text-sm">Nando&apos;s</div>
              <div className="text-white text-2xl font-bold">£{total.toFixed(2)}</div>
              <div className="text-white/60 text-xs mt-1">incl. {tipPercent}% tip (£{tipAmount.toFixed(2)})</div>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {people.map(person => {
                const personTotal = getPersonTotal(person.name);
                const personItems = items.filter(i => i.assignedTo.includes(person.name));
                return (
                  <div key={person.name} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full ${person.color} text-white flex items-center justify-center text-sm font-bold`}>
                          {person.name[0]}
                        </div>
                        <span className="font-semibold">{person.name}</span>
                      </div>
                      <span className="text-lg font-bold">£{personTotal.toFixed(2)}</span>
                    </div>
                    <div className="ml-10 space-y-1">
                      {personItems.map(item => (
                        <div key={item.id} className="flex justify-between text-sm text-gray-500">
                          <span>{item.name}{item.assignedTo.length > 1 ? ` (÷${item.assignedTo.length})` : ""}</span>
                          <span>£{(item.price / item.assignedTo.length).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {unassigned.length > 0 && (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-950 border-t border-yellow-200 dark:border-yellow-800">
                <div className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
                  ⚠️ {unassigned.length} item{unassigned.length > 1 ? "s" : ""} not assigned
                </div>
              </div>
            )}
          </div>

          {/* Share buttons */}
          <div className="space-y-3">
            <button
              onClick={() => setShowShare(true)}
              className="w-full py-3.5 bg-green-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-green-600 transition"
            >
              <MessageCircle className="w-5 h-5" />
              Share via WhatsApp
            </button>
            <button
              onClick={handleCopy}
              className="w-full py-3.5 border border-gray-300 dark:border-gray-700 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-900 transition"
            >
              {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
              {copied ? "Copied!" : "Copy Summary"}
            </button>
            <button className="w-full py-3.5 border border-gray-300 dark:border-gray-700 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-900 transition">
              <Link2 className="w-5 h-5" />
              Share Link
            </button>
          </div>

          <button
            onClick={() => { setStage("upload"); setItems(MOCK_ITEMS); }}
            className="w-full mt-6 mb-8 py-3 text-indigo-500 font-medium"
          >
            Split Another Receipt
          </button>
        </div>

        {/* Share modal */}
        {showShare && (
          <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50" onClick={() => setShowShare(false)}>
            <div className="bg-white dark:bg-gray-900 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-6" onClick={e => e.stopPropagation()}>
              <h3 className="font-bold text-lg mb-4">Share via WhatsApp</h3>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-sm font-mono whitespace-pre-line mb-4">
                {`🧾 ReceiptSplit — Nando's\nTotal: £${total.toFixed(2)}\n\n${people.map(p => `${p.name}: £${getPersonTotal(p.name).toFixed(2)}`).join("\n")}\n\nSplit with ReceiptSplit ✨`}
              </div>
              <button className="w-full py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition">
                Open WhatsApp
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Split stage (main)
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-32">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 h-14 flex items-center justify-between sticky top-0 z-40">
        <button onClick={() => setStage("upload")} className="text-gray-500 hover:text-gray-700">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="font-bold">Nando&apos;s — £{total.toFixed(2)}</span>
        <button onClick={() => setStage("summary")} className="text-indigo-500 font-medium text-sm">
          Done
        </button>
      </header>

      <div className="max-w-md mx-auto px-4 pt-4">
        {/* People selector */}
        <div className="mb-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {people.map(person => (
              <button
                key={person.name}
                onClick={() => setSelectedPerson(person.name)}
                className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                  selectedPerson === person.name
                    ? `${person.color} text-white shadow-lg`
                    : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
                }`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  selectedPerson === person.name ? "bg-white/20" : person.color + " text-white"
                }`}>
                  {person.name[0]}
                </span>
                {person.name}
              </button>
            ))}
            <button
              onClick={() => setShowAddPerson(true)}
              className="w-9 h-9 rounded-full bg-white dark:bg-gray-900 border border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center shrink-0 hover:border-indigo-400 transition"
            >
              <Plus className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1">Tap items below to assign to <strong>{selectedPerson}</strong></p>
        </div>

        {/* Add person modal */}
        {showAddPerson && (
          <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50" onClick={() => setShowAddPerson(false)}>
            <div className="bg-white dark:bg-gray-900 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-sm p-6" onClick={e => e.stopPropagation()}>
              <h3 className="font-bold text-lg mb-4">Add Person</h3>
              <input
                autoFocus
                value={newPersonName}
                onChange={e => setNewPersonName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addPerson()}
                placeholder="Name"
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 mb-4 outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button onClick={addPerson} className="w-full py-3 bg-indigo-500 text-white rounded-xl font-semibold hover:bg-indigo-600 transition">
                Add
              </button>
            </div>
          </div>
        )}

        {/* Items list */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-500">8 items detected</span>
            <div className="relative">
              <button
                onClick={() => setShowTipDropdown(!showTipDropdown)}
                className="text-sm text-indigo-500 font-medium flex items-center gap-1"
              >
                Tip: {tipPercent}% <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {showTipDropdown && (
                <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 overflow-hidden">
                  {[0, 5, 10, 12.5, 15, 20].map(t => (
                    <button
                      key={t}
                      onClick={() => { setTipPercent(t); setShowTipDropdown(false); }}
                      className={`block w-full px-4 py-2 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-800 ${tipPercent === t ? "text-indigo-500 font-medium" : ""}`}
                    >
                      {t}%{t === 0 ? " (no tip)" : ""}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {items.map(item => {
              const isAssigned = item.assignedTo.includes(selectedPerson);
              const person = people.find(p => p.name === selectedPerson);
              return (
                <button
                  key={item.id}
                  onClick={() => toggleAssign(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3.5 transition ${
                    isAssigned ? "bg-indigo-50 dark:bg-indigo-950/30" : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
                      isAssigned ? `${person?.color || "bg-indigo-500"} border-transparent` : "border-gray-300 dark:border-gray-600"
                    }`}>
                      {isAssigned && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className={`font-medium ${isAssigned ? "" : "text-gray-700 dark:text-gray-300"}`}>{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.assignedTo.length > 0 && (
                      <div className="flex -space-x-1.5">
                        {item.assignedTo.map(name => {
                          const p = people.find(pp => pp.name === name);
                          return (
                            <div key={name} className={`w-5 h-5 rounded-full ${p?.color || "bg-gray-400"} text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-gray-900`}>
                              {name[0]}
                            </div>
                          );
                        })}
                      </div>
                    )}
                    <span className="font-semibold text-sm">£{item.price.toFixed(2)}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tip & Subtotal */}
        <div className="mt-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>£{subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Tip ({tipPercent}%)</span><span>£{tipAmount.toFixed(2)}</span></div>
          <div className="flex justify-between font-bold text-base border-t border-gray-100 dark:border-gray-800 pt-2"><span>Total</span><span>£{total.toFixed(2)}</span></div>
        </div>

        {/* Per-person totals */}
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">Per person</h3>
          <div className="space-y-2">
            {people.map(person => {
              const personTotal = getPersonTotal(person.name);
              const pct = total > 0 ? (personTotal / total) * 100 : 0;
              const personColor = COLOR_LIGHT[person.color] || "bg-gray-100";
              return (
                <div key={person.name} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-full ${person.color} text-white text-xs font-bold flex items-center justify-center`}>
                        {person.name[0]}
                      </div>
                      <span className="font-medium">{person.name}</span>
                    </div>
                    <span className="font-bold">£{personTotal.toFixed(2)}</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className={`h-full ${person.color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="fixed bottom-0 inset-x-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-4 py-3 flex gap-3 max-w-md mx-auto">
        <button
          onClick={() => setStage("summary")}
          className="flex-1 py-3 bg-indigo-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-indigo-600 transition"
        >
          <Share2 className="w-4 h-4" />
          View Summary
        </button>
      </div>
    </div>
  );
}
