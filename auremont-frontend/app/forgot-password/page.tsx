"use client";

import { useState } from "react";
import api from "@/lib/axios";
import Link from "next/link";
import SquirrelLogo from "@/components/ui/SquirrelLogo";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const res = await api.post("/auth/forgot-password", { email });
      setMsg(res.data.message || "If an account exists, a reset link has been sent.");
    } catch (err: any) {
      setMsg(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-secondaryBg px-6 pt-32 pb-16">
      <div className="card w-full max-w-md space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <SquirrelLogo size={48} variant="icon" />
          <h1 className="font-serif text-3xl text-luxuryGold">Reset Password</h1>
          <p className="text-secondaryText text-sm">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
        
        {msg && (
          <div className="p-3 bg-luxuryGold/10 text-luxuryGold rounded text-sm text-center">
            {msg}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 px-4 rounded-input bg-background border border-divider outline-none focus:border-luxuryGold"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        
        <div className="text-center">
          <Link href="/login" className="text-sm text-luxuryGold hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
