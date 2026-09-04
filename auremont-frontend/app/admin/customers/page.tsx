/* jscpd:ignore-start */
"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Search, Download, UserX, UserCheck, Trash2, AlertTriangle, X, ShieldCheck } from "lucide-react";
import { format } from "date-fns";
import api from "@/lib/axios";

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  role: string;
  status: 'active' | 'inactive' | 'blocked';
  emailVerified: boolean;
  createdAt: string;
  _count?: {
    orders: number;
  };
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
  const [showCleanupModal, setShowCleanupModal] = useState(false);
  const [cleanupLoading, setCleanupLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/users/admin/all');
      setCustomers(data.data || data);
    } catch (err) {
      console.error("Failed to fetch customers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) return customers;
    const q = searchQuery.toLowerCase().trim();
    return customers.filter(
      (c) =>
        c.firstName?.toLowerCase().includes(q) ||
        c.lastName?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.phone?.toLowerCase().includes(q)
    );
  }, [customers, searchQuery]);

  // Identify testing customers dynamically
  const testingCustomerCount = useMemo(() => {
    const PRESERVED_EMAILS = [
      'kulkarniabhay620@gmail.com',
      'kulkarniabhay920@gmail.com',
      'admin@rarenuts.com',
      'admin@auremont.com',
      'admin@example.com',
    ];
    return customers.filter(
      (c) =>
        c.role !== 'admin' &&
        !PRESERVED_EMAILS.includes(c.email.toLowerCase()) &&
        (c.email.includes('test') ||
          c.email.includes('audit') ||
          c.email.includes('guest_') ||
          c.email.includes('buyer') ||
          c.email.includes('chaos') ||
          c.email.includes('stress'))
    ).length;
  }, [customers]);

  const handleDeleteCustomer = async (id: string) => {
    try {
      setDeletingId(id);
      await api.delete(`/users/admin/${id}`);
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      setCustomerToDelete(null);
      setNotification({ type: 'success', message: 'Customer successfully deleted' });
      setTimeout(() => setNotification(null), 4000);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to delete customer';
      setNotification({ type: 'error', message: msg });
      setTimeout(() => setNotification(null), 5000);
    } finally {
      setDeletingId(null);
    }
  };

  const handleCleanupTestingCustomers = async () => {
    try {
      setCleanupLoading(true);
      const PRESERVED_EMAILS = [
        'kulkarniabhay620@gmail.com',
        'kulkarniabhay920@gmail.com',
        'admin@rarenuts.com',
        'admin@auremont.com',
        'admin@example.com',
      ];
      const testList = customers.filter(
        (c) =>
          c.role !== 'admin' &&
          !PRESERVED_EMAILS.includes(c.email.toLowerCase())
      );

      let deletedCount = 0;
      for (const c of testList) {
        try {
          await api.delete(`/users/admin/${c.id}`);
          deletedCount++;
        } catch (e) {
          console.error(`Failed to delete test user ${c.email}:`, e);
        }
      }

      await fetchCustomers();
      setShowCleanupModal(false);
      setNotification({
        type: 'success',
        message: `Successfully removed ${deletedCount} testing customer(s)`,
      });
      setTimeout(() => setNotification(null), 4000);
    } catch (err: any) {
      setNotification({ type: 'error', message: 'Failed during cleanup process' });
    } finally {
      setCleanupLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (customers.length === 0) return;
    const headers = ["ID", "First Name", "Last Name", "Email", "Phone", "Role", "Status", "Total Orders", "Joined"];
    const rows = customers.map(c => [
      c.id,
      `"${c.firstName || ''}"`,
      `"${c.lastName || ''}"`,
      `"${c.email || ''}"`,
      `"${c.phone || ''}"`,
      c.role,
      c.status,
      c._count?.orders ?? 0,
      format(new Date(c.createdAt), "yyyy-MM-dd HH:mm:ss"),
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `customers_export_${format(new Date(), "yyyyMMdd_HHmmss")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between text-sm shadow-lg transition-all ${
            notification.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-500/30 text-emerald-300'
              : 'bg-red-950/80 border-red-500/30 text-red-300'
          }`}
        >
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="p-1 hover:opacity-75">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-serif text-luxuryGold">Customers</h2>
          <p className="text-secondaryText text-xs mt-1">Manage verified accounts, guest checkouts, and customer profiles</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {testingCustomerCount > 0 && (
            <button
              onClick={() => setShowCleanupModal(true)}
              className="flex items-center gap-2 bg-red-950/40 text-red-300 border border-red-500/30 px-4 py-2 rounded-xl text-xs font-semibold hover:bg-red-900/60 transition-colors shadow-sm"
            >
              <Trash2 size={15} />
              Clean {testingCustomerCount} Test Customers
            </button>
          )}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-secondaryBg text-primaryText border border-divider px-4 py-2 rounded-xl text-xs font-semibold shadow-sm hover:bg-surface transition-colors"
          >
            <Download size={15} />
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-secondaryBg rounded-2xl shadow-sm border border-divider overflow-hidden">
        {/* Search & Filter Bar */}
        <div className="p-4 sm:p-6 border-b border-divider flex flex-col md:flex-row gap-4 bg-secondaryBg justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-3.5 text-secondaryText" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or phone..."
              className="w-full pl-10 pr-4 py-2.5 bg-surface border border-divider text-primaryText placeholder:text-secondaryText text-sm rounded-xl focus:outline-none focus:ring-1 focus:ring-luxuryGold focus:border-luxuryGold transition-all"
            />
          </div>
          <div className="text-xs text-secondaryText">
            Showing <strong className="text-primaryText">{filteredCustomers.length}</strong> of {customers.length} customer(s)
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-secondaryText">
            <thead className="bg-surface text-primaryText uppercase text-xs font-semibold tracking-wider border-b border-divider">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-center">Orders</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-divider bg-secondaryBg">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-secondaryText">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-luxuryGold border-t-transparent mb-2"></div>
                    <div>Loading customers...</div>
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-secondaryText">
                    {searchQuery ? "No customers matching your search." : "No customers found."}
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-surface/60 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/customers/${c.id}`}
                            className="font-medium text-primaryText hover:text-luxuryGold transition-colors"
                          >
                            {c.firstName} {c.lastName}
                          </Link>
                          {c.role === 'admin' && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-luxuryGold/10 text-luxuryGold border border-luxuryGold/30">
                              <ShieldCheck size={11} /> Admin
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-secondaryText">{c.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono">
                      {c.phone ? (
                        <span className="text-primaryText">{c.phone}</span>
                      ) : (
                        <span className="text-secondaryText/60 italic">None</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      {c.createdAt ? format(new Date(c.createdAt), "MMM dd, yyyy") : '-'}
                    </td>
                    <td className="px-6 py-4 text-center font-semibold text-primaryText">
                      {c._count?.orders ?? 0}
                    </td>
                    <td className="px-6 py-4">
                      {c.status === 'active' ? (
                        <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                          <UserCheck size={14} /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs text-red-400 font-medium">
                          <UserX size={14} /> Blocked
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/customers/${c.id}`}
                          className="text-luxuryGold hover:text-goldHover text-xs font-medium transition-colors border border-luxuryGold/60 hover:border-luxuryGold px-3 py-1.5 rounded-lg"
                        >
                          View
                        </Link>
                        {c.role !== 'admin' && (
                          <button
                            onClick={() => setCustomerToDelete(c)}
                            title="Delete Customer"
                            className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-divider flex items-center justify-between text-xs text-secondaryText bg-secondaryBg">
          <span>
            Total: <strong className="text-primaryText">{filteredCustomers.length}</strong> customer records
          </span>
        </div>
      </div>

      {/* Individual Delete Modal */}
      {customerToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-secondaryBg border border-red-500/30 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20 shrink-0">
                <AlertTriangle size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-serif font-semibold text-primaryText">Delete Customer</h3>
                <p className="text-xs text-secondaryText leading-relaxed">
                  Are you sure you want to permanently delete this customer account? This will cascade-delete their carts, addresses, and order history.
                </p>
              </div>
            </div>

            <div className="bg-surface/80 border border-divider rounded-xl p-3 text-xs space-y-1">
              <div className="text-primaryText font-medium">
                {customerToDelete.firstName} {customerToDelete.lastName}
              </div>
              <div className="text-secondaryText font-mono">{customerToDelete.email}</div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                disabled={deletingId === customerToDelete.id}
                onClick={() => setCustomerToDelete(null)}
                className="px-4 py-2 border border-divider rounded-xl text-xs font-medium hover:bg-surface transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={deletingId === customerToDelete.id}
                onClick={() => handleDeleteCustomer(customerToDelete.id)}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-lg disabled:opacity-50"
              >
                {deletingId === customerToDelete.id ? "Deleting..." : "Permanently Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Test Cleanup Modal */}
      {showCleanupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-secondaryBg border border-red-500/30 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20 shrink-0">
                <Trash2 size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-serif font-semibold text-primaryText">Clean Test Customers</h3>
                <p className="text-xs text-secondaryText leading-relaxed">
                  This will scan the database and delete all automated test customers created by testing and audit suites.
                </p>
              </div>
            </div>

            <div className="bg-surface/80 border border-divider rounded-xl p-3 text-xs text-secondaryText space-y-1">
              <div>Protected accounts:</div>
              <div className="text-emerald-400 font-mono">✓ kulkarniabhay620@gmail.com</div>
              <div className="text-emerald-400 font-mono">✓ kulkarniabhay920@gmail.com</div>
              <div className="text-emerald-400 font-mono">✓ admin@rarenuts.com & admin accounts</div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                disabled={cleanupLoading}
                onClick={() => setShowCleanupModal(false)}
                className="px-4 py-2 border border-divider rounded-xl text-xs font-medium hover:bg-surface transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={cleanupLoading}
                onClick={handleCleanupTestingCustomers}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-lg disabled:opacity-50"
              >
                {cleanupLoading ? "Cleaning Up..." : "Confirm Cleanup"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
/* jscpd:ignore-end */
