"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { format } from "date-fns";

export default function AdminSupportPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = () => {
    api.get('/contact').then(res => {
      setMessages(res.data);
      return null;
    }).catch(console.error).finally(() => setLoading(false)).catch(console.error);
  };

  const markResolved = async (id: string, currentStatus: string) => {
    if (currentStatus === 'resolved') return;
    try {
      await api.patch(`/contact/${id}/status`, { status: 'resolved' });
      fetchMessages();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-serif text-luxuryGold mb-6">Support Inquiries</h1>
      
      <div className="bg-secondaryBg rounded-2xl shadow-sm border border-divider overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface text-secondaryText text-xs uppercase tracking-wider border-b border-divider">
              <tr>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Subject</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-divider">
              {loading ? (
                <tr><td colSpan={5} className="text-center py-8 text-mutedText">Loading messages...</td></tr>
              ) : messages.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-mutedText">No support messages found.</td></tr>
              ) : (
                messages.map(msg => (
                  <React.Fragment key={msg.id}>
                    <tr className="hover:bg-surface/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-primaryText">{msg.name}</div>
                        <div className="text-sm text-secondaryText">{msg.email}</div>
                      </td>
                      <td className="px-6 py-4 font-medium text-primaryText">{msg.subject}</td>
                      <td className="px-6 py-4 text-secondaryText">{format(new Date(msg.createdAt), 'MMM d, h:mm a')}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium tracking-wide
                          ${msg.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}
                        >
                          {msg.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-3">
                        {msg.status === 'new' && (
                          <button 
                            onClick={() => markResolved(msg.id, msg.status)}
                            className="text-secondaryText hover:text-emerald-400 font-medium text-sm transition-colors"
                          >
                            Mark Resolved
                          </button>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={5} className="px-6 pb-6 pt-2 bg-surface/30">
                        <p className="text-sm text-secondaryText italic border-l-2 border-divider pl-4">{msg.message}</p>
                      </td>
                    </tr>
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
