"use client";

import { ArrowLeft, Receipt, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const HISTORY = [
  { id: 1, place: "Nando's", date: "Today", total: 47.80, people: ["You", "Sam", "Jordan"], yourShare: 16.45 },
  { id: 2, place: "Pizza Express", date: "Yesterday", total: 34.50, people: ["You", "Alex"], yourShare: 18.25 },
  { id: 3, place: "Wagamama", date: "3 Feb", total: 52.80, people: ["You", "Sam", "Jordan", "Alex"], yourShare: 14.20 },
  { id: 4, place: "Greggs", date: "1 Feb", total: 8.45, people: ["You", "Sam"], yourShare: 4.23 },
  { id: 5, place: "The Ivy", date: "28 Jan", total: 124.60, people: ["You", "Sam", "Jordan", "Alex", "Taylor"], yourShare: 28.50 },
  { id: 6, place: "Five Guys", date: "25 Jan", total: 38.90, people: ["You", "Jordan"], yourShare: 19.45 },
  { id: 7, place: "Pret A Manger", date: "22 Jan", total: 12.30, people: ["You", "Sam"], yourShare: 6.15 },
];

export default function HistoryPage() {
  const [search, setSearch] = useState("");
  const filtered = HISTORY.filter(h => h.place.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 h-14 flex items-center justify-between">
        <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <span className="font-bold">Split History</span>
        <div className="w-5" />
      </header>

      <div className="max-w-md mx-auto px-4 pt-4">
        <div className="relative mb-4">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search restaurants..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="text-sm text-gray-400 mb-3">{filtered.length} splits · Total saved: £{HISTORY.reduce((s, h) => s + h.total, 0).toFixed(2)}</div>

        <div className="space-y-3">
          {filtered.map(h => (
            <Link
              key={h.id}
              href="/dashboard"
              className="block bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 hover:border-indigo-300 transition"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center">
                    <Receipt className="w-5 h-5 text-indigo-500" />
                  </div>
                  <div>
                    <div className="font-semibold">{h.place}</div>
                    <div className="text-xs text-gray-500">{h.date} · {h.people.length} people</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">£{h.total.toFixed(2)}</div>
                  <div className="text-xs text-gray-500">You: £{h.yourShare.toFixed(2)}</div>
                </div>
              </div>
              <div className="flex -space-x-2">
                {h.people.map((p, i) => (
                  <div key={i} className={`w-6 h-6 rounded-full text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-gray-900 ${
                    ["bg-blue-500", "bg-emerald-500", "bg-purple-500", "bg-orange-500", "bg-pink-500"][i % 5]
                  }`}>
                    {p[0]}
                  </div>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
