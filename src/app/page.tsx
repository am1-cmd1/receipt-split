"use client";

import { Camera, Receipt, Users, Share2, Check, Star, ArrowRight, Zap, Shield, Clock } from "lucide-react";
import Link from "next/link";

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-950/80 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
              <Receipt className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg">ReceiptSplit</span>
          </div>
          <Link
            href="/auth/sign-in"
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg font-medium hover:bg-indigo-600 transition text-sm"
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-sm mb-6">
          <Zap className="w-3.5 h-3.5" />
          No more awkward bill math
        </div>
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6 leading-tight">
          Snap the receipt.<br />
          <span className="text-indigo-500">Split in seconds.</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10">
          Take a photo of any receipt, tap to assign items to friends, and share the breakdown instantly. No more spreadsheets, no more arguments.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/dashboard"
            className="px-8 py-3.5 bg-indigo-500 text-white rounded-xl font-semibold hover:bg-indigo-600 transition text-lg inline-flex items-center justify-center gap-2"
          >
            Start Splitting <ArrowRight className="w-5 h-5" />
          </Link>
          <a
            href="#how-it-works"
            className="px-8 py-3.5 border border-gray-300 dark:border-gray-700 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-900 transition text-lg"
          >
            See How It Works
          </a>
        </div>

        {/* Mock Screenshot */}
        <div className="mt-16 max-w-sm mx-auto">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xl overflow-hidden">
            <div className="bg-indigo-500 px-4 py-3 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-white" />
              <span className="text-white font-medium text-sm">Nando&apos;s — £47.80</span>
            </div>
            <div className="p-4 space-y-2 text-sm">
              {[
                { item: "Peri Peri Chicken", price: "£12.50", person: "Alex", color: "bg-blue-100 text-blue-700" },
                { item: "Halloumi Sticks", price: "£5.50", person: "Sam", color: "bg-green-100 text-green-700" },
                { item: "Butterfly Burger", price: "£11.25", person: "Jordan", color: "bg-purple-100 text-purple-700" },
                { item: "Garlic Bread", price: "£3.95", person: "Shared", color: "bg-orange-100 text-orange-700" },
                { item: "Drinks x3", price: "£8.85", person: "Shared", color: "bg-orange-100 text-orange-700" },
              ].map((r, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                  <span className="text-gray-700 dark:text-gray-300">{r.item}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{r.price}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${r.color}`}>{r.person}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 flex items-center justify-between text-sm">
              <span className="text-gray-500">Incl. tip & tax</span>
              <span className="font-bold text-indigo-600">Ready to share ✓</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-gray-50 dark:bg-gray-900/50 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Three steps. Zero drama.</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Camera, title: "1. Snap", desc: "Take a photo of the receipt or upload from gallery" },
              { icon: Users, title: "2. Assign", desc: "Tap items to assign them to people — shared items split evenly" },
              { icon: Share2, title: "3. Share", desc: "Send the breakdown via WhatsApp, link, or text" },
            ].map((step, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 text-center">
                <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="font-bold text-xl mb-2">{step.title}</h3>
                <p className="text-gray-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Why ReceiptSplit?</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Zap, title: "Instant OCR", desc: "AI reads receipts in under 2 seconds" },
            { icon: Users, title: "Group-friendly", desc: "Works for 2 people or 20" },
            { icon: Shield, title: "Privacy-first", desc: "Receipts processed on-device when possible" },
            { icon: Clock, title: "Split history", desc: "Never lose track of who owes what" },
            { icon: Share2, title: "Easy sharing", desc: "WhatsApp, link, or copy to clipboard" },
            { icon: Star, title: "Tip & tax", desc: "Customizable split for service charges" },
          ].map((f, i) => (
            <div key={i} className="flex gap-4 p-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center shrink-0">
                <f.icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-gray-50 dark:bg-gray-900/50 py-20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Simple pricing</h2>
          <p className="text-center text-gray-500 mb-12">Try free for 48 hours. Then just £2.99/month.</p>
          <div className="max-w-sm mx-auto">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border-2 border-indigo-500 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-indigo-500 text-white text-xs font-bold rounded-full">
                7-DAY FREE TRIAL
              </div>
              <h3 className="font-bold text-xl mb-2">Pro</h3>
              <div className="text-4xl font-bold mb-1">£2.99<span className="text-lg font-normal text-gray-500">/mo</span></div>
              <p className="text-sm text-gray-500 mb-6">after 48-hour free trial</p>
              <ul className="space-y-3 mb-8">
                {["Unlimited scans", "Unlimited people", "WhatsApp sharing", "Unlimited history", "Export to CSV", "Priority support"].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500" /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/auth/sign-up" className="block text-center py-3 bg-indigo-500 text-white rounded-xl font-semibold hover:bg-indigo-600 transition">
                Start Free Trial
              </Link>
              <p className="text-xs text-gray-400 text-center mt-3">No credit card required to start</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center text-sm text-gray-500 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-6 h-6 rounded bg-indigo-500 flex items-center justify-center">
            <Receipt className="w-3 h-3 text-white" />
          </div>
          <span className="font-semibold text-gray-700 dark:text-gray-300">ReceiptSplit</span>
        </div>
        <p>© 2025 ReceiptSplit. Split smarter, not harder.</p>
      </footer>
    </div>
  );
}
