"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/axios";

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const e = searchParams.get("email");
    const t = searchParams.get("token");
    if (e) setEmail(e);
    if (t) setToken(t);
  }, [searchParams]);

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

  if (!email || !token) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-secondaryBg px-6">
        <div className="card w-full max-w-md space-y-6 text-center">
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
      <div className="card w-full max-w-md space-y-6">
        <h1 className="font-serif text-3xl text-center">Create New Password</h1>
        
        {msg && (
          <div className={`p-3 rounded text-sm text-center ${success ? 'bg-green-500/10 text-green-500' : 'bg-error/10 text-error'}`}>
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
                className="w-full h-11 px-4 rounded-input bg-background border border-divider outline-none focus:border-luxuryGold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Confirm New Password</label>
              <input 
                type="password" 
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-11 px-4 rounded-input bg-background border border-divider outline-none focus:border-luxuryGold"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        ) : (
          <button onClick={() => router.push('/login')} className="btn-primary w-full py-3">
            Go to Login
          </button>
        )}
      </div>
    </div>
  );
}
