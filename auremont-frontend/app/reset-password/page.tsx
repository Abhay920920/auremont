/* jscpd:ignore-start */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const e = params.get("email");
      const t = params.get("token");
      if (e) setEmail(e);
      if (t) setToken(t);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMsg("Passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setMsg("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setMsg("");
    try {
      await api.post("/auth/reset-password", { email, token, newPassword });
      setSuccess(true);
      setMsg("Password reset successfully. You can now login.");
    } catch (err: any) {
      setMsg(err.response?.data?.message || "Invalid or expired token.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-secondaryBg px-6">
        <div className="w-8 h-8 border-2 border-luxuryGold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!email || !token) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-secondaryBg px-6">
        <div className="card w-full max-w-md space-y-6 text-center border border-divider p-8 rounded-2xl">
          <h1 className="font-serif text-3xl text-error">Invalid Link</h1>
          <p className="text-secondaryText text-sm">
            This password reset link is invalid or missing parameters.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-secondaryBg px-6">
      <div className="card w-full max-w-md space-y-6 border border-divider p-8 rounded-2xl">
        <h1 className="font-serif text-3xl text-center">Create New Password</h1>
        
        {msg && (
          <div className={`p-3 rounded-xl text-sm text-center ${success ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-error/10 text-error border border-error/20'}`}>
            {msg}
          </div>
        )}
        
        {!success ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">New Password</label>
              <input 
                type="password" 
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-background border border-divider outline-none focus:border-luxuryGold text-primaryText"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Confirm New Password</label>
              <input 
                type="password" 
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-background border border-divider outline-none focus:border-luxuryGold text-primaryText"
              />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-luxuryGold text-background py-3 rounded-xl font-medium uppercase tracking-widest hover:bg-goldHover transition-colors disabled:opacity-50">
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        ) : (
          <button onClick={() => router.push('/login')} className="w-full bg-luxuryGold text-background py-3 rounded-xl font-medium uppercase tracking-widest hover:bg-goldHover transition-colors">
            Go to Login
          </button>
        )}
      </div>
    </div>
  );
}
