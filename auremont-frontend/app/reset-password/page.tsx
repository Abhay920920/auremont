"use client";

import dynamic from "next/dynamic";

const ResetPasswordClient = dynamic(() => import("./ResetPasswordClient"), {
  ssr: false,
  loading: () => (
    <div className="min-h-[70vh] flex items-center justify-center bg-secondaryBg px-6">
      <div className="w-8 h-8 border-2 border-luxuryGold border-t-transparent rounded-full animate-spin" />
    </div>
  )
});

export default function ResetPasswordPage() {
  return <ResetPasswordClient />;
}
