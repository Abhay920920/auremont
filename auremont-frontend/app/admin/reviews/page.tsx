"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Star, CheckCircle, XCircle, AlertTriangle, ShieldCheck, Trash2, Clock, Check, X, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import api from "@/lib/axios";

interface ReviewItem {
  id: string;
  rating: number;
  title: string | null;
  review: string | null;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  product: {
    name: string;
    slug?: string;
    thumbnailUrl?: string | null;
  };
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [reviewToDelete, setReviewToDelete] = useState<ReviewItem | null>(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/reviews');
      setReviews(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
      setNotification({ type: 'error', message: 'Failed to load reviews from server' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const counts = useMemo(() => ({
    pending: reviews.filter((r) => r.status === 'pending').length,
    approved: reviews.filter((r) => r.status === 'approved').length,
    rejected: reviews.filter((r) => r.status === 'rejected').length,
    all: reviews.length,
  }), [reviews]);

  const filteredReviews = useMemo(() => {
    if (statusFilter === 'all') return reviews;
    return reviews.filter((r) => r.status === statusFilter);
  }, [reviews, statusFilter]);

  const handleAction = async (id: string, newStatus: 'pending' | 'approved' | 'rejected') => {
    const previousReviews = [...reviews];
    // Optimistic UI update
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    setActionInProgress(id);

    try {
      await api.patch(`/reviews/${id}/moderate`, { status: newStatus });
      setNotification({
        type: 'success',
        message: `Review successfully updated to ${newStatus}`,
      });
      setTimeout(() => setNotification(null), 3000);
    } catch (err: any) {
      console.error("Failed to update review status:", err);
      // Rollback on failure
      setReviews(previousReviews);
      const errMsg = err?.response?.data?.message || 'Failed to save review update to server';
      setNotification({ type: 'error', message: errMsg });
      setTimeout(() => setNotification(null), 5000);
    } finally {
      setActionInProgress(null);
    }
  };

  const handleDelete = async (id: string) => {
    setActionInProgress(id);
    try {
      await api.delete(`/reviews/${id}`);
      setReviews((prev) => prev.filter((r) => r.id !== id));
      setReviewToDelete(null);
      setNotification({
        type: 'success',
        message: 'Review permanently deleted',
      });
      setTimeout(() => setNotification(null), 3000);
    } catch (err: any) {
      console.error("Failed to delete review:", err);
      const errMsg = err?.response?.data?.message || 'Failed to delete review';
      setNotification({ type: 'error', message: errMsg });
      setTimeout(() => setNotification(null), 5000);
    } finally {
      setActionInProgress(null);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={star <= rating ? "text-yellow-400 fill-yellow-400" : "text-divider fill-divider"}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
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

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-serif text-luxuryGold">Review Moderation</h2>
          <p className="text-secondaryText text-xs mt-1">Approve authentic customer reviews, detect spam, and manage store ratings</p>
        </div>
        <button
          onClick={fetchReviews}
          disabled={loading}
          className="flex items-center gap-2 bg-secondaryBg text-secondaryText hover:text-primaryText border border-divider px-4 py-2 rounded-xl text-xs font-semibold shadow-sm hover:bg-surface transition-colors disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-divider gap-4 sm:gap-6 overflow-x-auto text-sm">
        <button
          className={`pb-3 font-medium transition-colors relative whitespace-nowrap ${
            statusFilter === 'pending' ? 'text-luxuryGold' : 'text-secondaryText hover:text-primaryText'
          }`}
          onClick={() => setStatusFilter('pending')}
        >
          <div className="flex items-center gap-2">
            Pending Queue
            <span className="bg-luxuryGold/20 text-luxuryGold text-[10px] px-2 py-0.5 rounded-full font-semibold">
              {counts.pending}
            </span>
          </div>
          {statusFilter === 'pending' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-luxuryGold rounded-t-full"></div>}
        </button>

        <button
          className={`pb-3 font-medium transition-colors relative whitespace-nowrap ${
            statusFilter === 'approved' ? 'text-emerald-400' : 'text-secondaryText hover:text-primaryText'
          }`}
          onClick={() => setStatusFilter('approved')}
        >
          <div className="flex items-center gap-2">
            Approved
            <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-semibold">
              {counts.approved}
            </span>
          </div>
          {statusFilter === 'approved' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-400 rounded-t-full"></div>}
        </button>

        <button
          className={`pb-3 font-medium transition-colors relative whitespace-nowrap ${
            statusFilter === 'rejected' ? 'text-red-400' : 'text-secondaryText hover:text-primaryText'
          }`}
          onClick={() => setStatusFilter('rejected')}
        >
          <div className="flex items-center gap-2">
            Rejected / Spam
            <span className="bg-red-500/10 text-red-400 text-[10px] px-2 py-0.5 rounded-full font-semibold">
              {counts.rejected}
            </span>
          </div>
          {statusFilter === 'rejected' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-400 rounded-t-full"></div>}
        </button>

        <button
          className={`pb-3 font-medium transition-colors relative whitespace-nowrap ${
            statusFilter === 'all' ? 'text-primaryText' : 'text-secondaryText hover:text-primaryText'
          }`}
          onClick={() => setStatusFilter('all')}
        >
          <div className="flex items-center gap-2">
            All Reviews
            <span className="bg-surface text-secondaryText text-[10px] px-2 py-0.5 rounded-full font-semibold">
              {counts.all}
            </span>
          </div>
          {statusFilter === 'all' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primaryText rounded-t-full"></div>}
        </button>
      </div>

      {/* Reviews Feed */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-secondaryText text-center py-16">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-luxuryGold border-t-transparent mb-2"></div>
            <div>Loading verified reviews from database...</div>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="bg-secondaryBg border border-divider rounded-2xl p-12 text-center">
            <ShieldCheck size={48} className="mx-auto text-divider mb-4" />
            <h3 className="text-lg font-medium text-primaryText">All caught up!</h3>
            <p className="text-secondaryText mt-1 text-xs">There are no {statusFilter === 'all' ? '' : statusFilter} reviews to show.</p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div
              key={review.id}
              className={`bg-secondaryBg rounded-2xl shadow-sm border p-6 flex flex-col md:flex-row gap-6 transition-all ${
                actionInProgress === review.id ? 'opacity-60 pointer-events-none' : ''
              } ${
                review.status === 'approved'
                  ? 'border-emerald-500/20'
                  : review.status === 'rejected'
                  ? 'border-red-500/20'
                  : 'border-divider'
              }`}
            >
              {/* Review Content */}
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    {renderStars(review.rating)}
                    <h3 className="text-lg font-medium text-primaryText mt-2">
                      {review.title || 'Product Review'}
                    </h3>
                  </div>
                  <span className="text-xs text-secondaryText bg-surface px-2.5 py-1 rounded border border-divider">
                    {review.createdAt ? format(new Date(review.createdAt), "MMM dd, yyyy") : '-'}
                  </span>
                </div>

                <p className="text-secondaryText text-sm leading-relaxed">
                  "{review.review || 'No written comment provided.'}"
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs mt-4 pt-4 border-t border-divider">
                  <div className="flex flex-col">
                    <span className="text-secondaryText uppercase text-[10px] tracking-wider mb-0.5">Author</span>
                    <span className="font-medium text-primaryText">
                      {review.user?.firstName || 'Customer'} {review.user?.lastName || ''}
                    </span>
                    <span className="text-[11px] text-secondaryText font-mono">{review.user?.email}</span>
                  </div>
                  <div className="w-px h-8 bg-divider"></div>
                  <div className="flex flex-col">
                    <span className="text-secondaryText uppercase text-[10px] tracking-wider mb-0.5">Product</span>
                    {review.product?.slug ? (
                      <Link
                        href={`/shop/${review.product.slug}`}
                        target="_blank"
                        className="font-medium text-primaryText hover:text-luxuryGold transition-colors"
                      >
                        {review.product.name}
                      </Link>
                    ) : (
                      <span className="font-medium text-primaryText">{review.product?.name || 'Product'}</span>
                    )}
                  </div>
                  <div className="w-px h-8 bg-divider"></div>
                  <div className="flex flex-col">
                    <span className="text-secondaryText uppercase text-[10px] tracking-wider mb-0.5">Status</span>
                    {review.status === 'approved' && (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <Check size={13} /> Approved
                      </span>
                    )}
                    {review.status === 'pending' && (
                      <span className="text-luxuryGold font-semibold flex items-center gap-1">
                        <Clock size={13} /> Pending Moderation
                      </span>
                    )}
                    {review.status === 'rejected' && (
                      <span className="text-red-400 font-semibold flex items-center gap-1">
                        <X size={13} /> Rejected / Spam
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions Box */}
              <div className="md:w-48 shrink-0 flex flex-col gap-2.5 justify-center border-t md:border-t-0 md:border-l border-divider pt-4 md:pt-0 md:pl-6">
                {review.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleAction(review.id, 'approved')}
                      disabled={actionInProgress === review.id}
                      className="flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl hover:bg-emerald-500/20 transition-colors font-semibold text-xs disabled:opacity-50"
                    >
                      <CheckCircle size={15} /> Approve
                    </button>
                    <button
                      onClick={() => handleAction(review.id, 'rejected')}
                      disabled={actionInProgress === review.id}
                      className="flex items-center justify-center gap-2 w-full py-2.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-colors font-semibold text-xs disabled:opacity-50"
                    >
                      <XCircle size={15} /> Reject
                    </button>
                  </>
                )}

                {review.status === 'approved' && (
                  <>
                    <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-xs justify-center mb-1">
                      <CheckCircle size={14} /> Approved & Live
                    </div>
                    <button
                      onClick={() => handleAction(review.id, 'pending')}
                      disabled={actionInProgress === review.id}
                      className="w-full py-2 text-xs text-secondaryText hover:text-luxuryGold transition-colors border border-divider hover:border-luxuryGold/40 rounded-xl disabled:opacity-50"
                    >
                      Revert to Pending
                    </button>
                    <button
                      onClick={() => handleAction(review.id, 'rejected')}
                      disabled={actionInProgress === review.id}
                      className="w-full py-2 text-xs text-secondaryText hover:text-red-400 transition-colors border border-divider hover:border-red-500/30 rounded-xl disabled:opacity-50"
                    >
                      Reject / Mark Spam
                    </button>
                  </>
                )}

                {review.status === 'rejected' && (
                  <>
                    <div className="flex items-center gap-1.5 text-red-400 font-semibold text-xs justify-center mb-1">
                      <AlertTriangle size={14} /> Rejected / Hidden
                    </div>
                    <button
                      onClick={() => handleAction(review.id, 'approved')}
                      disabled={actionInProgress === review.id}
                      className="w-full py-2 text-xs text-secondaryText hover:text-emerald-400 transition-colors border border-divider hover:border-emerald-500/30 rounded-xl disabled:opacity-50"
                    >
                      Approve & Publish
                    </button>
                    <button
                      onClick={() => handleAction(review.id, 'pending')}
                      disabled={actionInProgress === review.id}
                      className="w-full py-2 text-xs text-secondaryText hover:text-luxuryGold transition-colors border border-divider hover:border-luxuryGold/40 rounded-xl disabled:opacity-50"
                    >
                      Move to Pending
                    </button>
                  </>
                )}

                <button
                  onClick={() => setReviewToDelete(review)}
                  className="flex items-center justify-center gap-1.5 w-full py-2 text-[11px] text-red-400/80 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors mt-1"
                >
                  <Trash2 size={13} /> Delete Permanently
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {reviewToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-secondaryBg border border-red-500/30 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20 shrink-0">
                <Trash2 size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-serif font-semibold text-primaryText">Delete Review</h3>
                <p className="text-xs text-secondaryText leading-relaxed">
                  Are you sure you want to permanently delete this customer review from the database?
                </p>
              </div>
            </div>

            <div className="bg-surface/80 border border-divider rounded-xl p-3 text-xs space-y-1">
              <div className="text-primaryText font-medium">"{reviewToDelete.title || 'Review'}"</div>
              <div className="text-secondaryText">
                By {reviewToDelete.user?.firstName} {reviewToDelete.user?.lastName} ({reviewToDelete.user?.email})
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                disabled={actionInProgress === reviewToDelete.id}
                onClick={() => setReviewToDelete(null)}
                className="px-4 py-2 border border-divider rounded-xl text-xs font-medium hover:bg-surface transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={actionInProgress === reviewToDelete.id}
                onClick={() => handleDelete(reviewToDelete.id)}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-lg disabled:opacity-50"
              >
                {actionInProgress === reviewToDelete.id ? "Deleting..." : "Permanently Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
