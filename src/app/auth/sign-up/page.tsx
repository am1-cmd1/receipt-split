"use client";

import { useState } from "react";
import { Receipt, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function SignUp() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { signUp, isConfigured } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConfigured) {
      router.push("/dashboard");
      return;
    }
    setLoading(true);
    setError("");
    const { error } = await signUp(email, password, fullName);
    if (error) {
      setError(error);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-8">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center">
            <Receipt className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl">ReceiptSplit</span>
        </div>
        <h1 className="text-2xl font-bold mb-2">Create account</h1>
        <p className="text-gray-500 mb-6">Start your 48-hour free trial</p>
        {success ? (
          <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-400">
            <p className="font-semibold mb-1">Check your email!</p>
            <p className="text-sm">We&apos;ve sent a confirmation link to {email}.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600">{error}</div>}
            {!isConfigured && (
              <div className="p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-xl text-sm text-yellow-700 dark:text-yellow-400">
                Supabase not configured — demo mode.
              </div>
            )}
            <input type="text" placeholder="Full name" value={fullName} onChange={e => setFullName(e.target.value)} required className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 outline-none focus:ring-2 focus:ring-indigo-500" />
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 outline-none focus:ring-2 focus:ring-indigo-500" />
            <input type="password" placeholder="Password (min 6 chars)" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 outline-none focus:ring-2 focus:ring-indigo-500" />
            <button type="submit" disabled={loading} className="w-full py-3 bg-indigo-500 text-white rounded-xl font-semibold hover:bg-indigo-600 transition disabled:opacity-50">
              {loading ? "Creating account..." : "Start Free Trial"}
            </button>
          </form>
        )}
        <p className="mt-4 text-sm text-center text-gray-500">Already have an account? <Link href="/auth/sign-in" className="text-indigo-500 hover:underline">Sign in</Link></p>
      </div>
    </div>
  );
}
