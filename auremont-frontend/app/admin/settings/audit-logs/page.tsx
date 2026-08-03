"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { format } from "date-fns";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/audit').then(res => {
      setLogs(res.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/settings" className="p-2 rounded-xl bg-surface border border-divider hover:bg-secondaryBg transition-colors">
          <ArrowLeft className="w-5 h-5 text-primaryText" />
        </Link>
        <h1 className="text-3xl font-serif text-luxuryGold flex items-center gap-3">
          <ShieldAlert size={28} />
          System Audit Logs
        </h1>
      </div>

      <div className="bg-secondaryBg rounded-2xl shadow-sm border border-divider overflow-hidden">
        <div className="p-6 border-b border-divider bg-secondaryBg">
          <p className="text-sm text-secondaryText">
            Audit logs track administrative and system actions for security and compliance purposes. Showing the latest 100 entries.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface text-secondaryText text-xs uppercase tracking-wider border-b border-divider">
              <tr>
                <th className="px-6 py-4 font-medium">Timestamp</th>
                <th className="px-6 py-4 font-medium">User / Admin</th>
                <th className="px-6 py-4 font-medium">Action</th>
                <th className="px-6 py-4 font-medium">Entity</th>
                <th className="px-6 py-4 font-medium">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-divider">
              {loading ? (
                <tr><td colSpan={5} className="text-center py-8 text-mutedText">Loading audit logs...</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-mutedText">No logs recorded yet.</td></tr>
              ) : (
                logs.map(log => (
                  <tr key={log.id} className="hover:bg-surface/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-secondaryText whitespace-nowrap">
                      {format(new Date(log.createdAt), 'MMM d, yyyy HH:mm:ss')}
                    </td>
                    <td className="px-6 py-4">
                      {log.user ? (
                        <div className="flex flex-col">
                          <span className="font-medium text-primaryText">{log.user.firstName} {log.user.lastName}</span>
                          <span className="text-xs text-secondaryText">{log.user.email}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-secondaryText italic">System</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-primaryText">{log.action}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface text-secondaryText border border-divider">
                        {log.entity} {log.entityId ? `#${log.entityId.slice(0,8)}` : ''}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-secondaryText font-mono">
                      {log.ipAddress || 'Unknown'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
