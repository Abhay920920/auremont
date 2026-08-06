"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star, CheckCircle, XCircle, AlertTriangle, ShieldCheck } from "lucide-react";
import { format } from "date-fns";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("pending");

  useEffect(() => {
    // Stubbing API call for reviews
    setTimeout(() => {
      setReviews([
        {
          id: '1',
          product: { name: 'Premium California Badam' },
          user: { firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
          rating: 5,
          title: 'Absolutely delicious!',
          review: 'These almonds are so fresh and crunchy. Will definitely buy again.',
          status: 'pending',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        },
        {
          id: '2',
          product: { name: 'Roasted & Salted Almonds' },
          user: { firstName: 'Sarah', lastName: 'Smith', email: 'sarah@example.com' },
          rating: 2,
          title: 'Too salty',
          review: 'I felt these had way too much salt on them for my liking.',
          status: 'pending',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        },
        {
          id: '3',
          product: { name: 'Chocolate Coated Almonds' },
          user: { firstName: 'Spammer', lastName: 'Bot', email: 'seo@spam.com' },
          rating: 5,
          title: 'Buy cheap shoes here!',
          review: 'Click my link for cheap shoes http://spam.xyz',
          status: 'rejected',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        },
        {
          id: '4',
          product: { name: 'Premium California Badam' },
          user: { firstName: 'Rahul', lastName: 'S', email: 'rahul@example.com' },
          rating: 4,
          title: 'Good quality',
          review: 'Nice packaging and good quality nuts.',
          status: 'approved',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
        }
      ]);
      setLoading(false);
    }, 600);
  }, []);

  const filteredReviews = reviews.filter(r => r.status === statusFilter);

  const handleAction = (id: string, newStatus: string) => {
    setReviews(reviews.map(r => (r.id === id ? { ...r, status: newStatus } : r)));
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
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
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-serif text-luxuryGold">Review Moderation</h2>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-divider gap-6">
        <button 
          className={`pb-3 font-medium text-sm transition-colors relative ${statusFilter === 'pending' ? 'text-luxuryGold' : 'text-secondaryText hover:text-primaryText'}`}
          onClick={() => setStatusFilter('pending')}
        >
          <div className="flex items-center gap-2">
            Pending Queue
            <span className="bg-luxuryGold/20 text-luxuryGold text-[10px] px-2 py-0.5 rounded-full">
              {reviews.filter(r => r.status === 'pending').length}
            </span>
          </div>
          {statusFilter === 'pending' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-luxuryGold rounded-t-full"></div>}
        </button>
        <button 
          className={`pb-3 font-medium text-sm transition-colors relative ${statusFilter === 'approved' ? 'text-emerald-400' : 'text-secondaryText hover:text-primaryText'}`}
          onClick={() => setStatusFilter('approved')}
        >
          Approved
          {statusFilter === 'approved' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-400 rounded-t-full"></div>}
        </button>
        <button 
          className={`pb-3 font-medium text-sm transition-colors relative ${statusFilter === 'rejected' ? 'text-red-400' : 'text-secondaryText hover:text-primaryText'}`}
          onClick={() => setStatusFilter('rejected')}
        >
          Rejected / Spam
          {statusFilter === 'rejected' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-400 rounded-t-full"></div>}
        </button>
      </div>

      {/* Reviews Feed */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-secondaryText text-center py-12 animate-pulse">Loading reviews...</div>
        ) : filteredReviews.length === 0 ? (
          <div className="bg-secondaryBg border border-divider rounded-2xl p-12 text-center">
            <ShieldCheck size={48} className="mx-auto text-divider mb-4" />
            <h3 className="text-lg font-medium text-primaryText">All caught up!</h3>
            <p className="text-secondaryText mt-1">There are no {statusFilter} reviews to show.</p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div key={review.id} className="bg-secondaryBg rounded-2xl shadow-sm border border-divider p-6 flex flex-col md:flex-row gap-6">
              
              {/* Review Content */}
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    {renderStars(review.rating)}
                    <h3 className="text-lg font-medium text-primaryText mt-2">{review.title}</h3>
                  </div>
                  <span className="text-xs text-secondaryText bg-surface px-2 py-1 rounded border border-divider">
                    {format(new Date(review.createdAt), "MMM dd, yyyy")}
                  </span>
                </div>
                
                <p className="text-secondaryText text-sm leading-relaxed">"{review.review}"</p>
                
                <div className="flex flex-wrap items-center gap-4 text-xs mt-4 pt-4 border-t border-divider">
                  <div className="flex flex-col">
                    <span className="text-secondaryText uppercase tracking-wider mb-0.5">Author</span>
                    <span className="font-medium text-primaryText">
                      {review.user.firstName} {review.user.lastName}
                    </span>
                  </div>
                  <div className="w-px h-6 bg-divider"></div>
                  <div className="flex flex-col">
                    <span className="text-secondaryText uppercase tracking-wider mb-0.5">Product</span>
                    <Link href={`/shop/${review.product.slug}`} target="_blank" className="font-medium text-primaryText hover:text-luxuryGold transition-colors">
                      {review.product.name}
                    </Link>
                  </div>
                </div>
              </div>

              {/* Actions Box */}
              <div className="md:w-48 shrink-0 flex flex-col gap-3 justify-center border-t md:border-t-0 md:border-l border-divider pt-4 md:pt-0 md:pl-6">
                {review.status === 'pending' && (
                  <>
                    <button 
                      onClick={() => handleAction(review.id, 'approved')}
                      className="flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl hover:bg-emerald-500/20 transition-colors font-medium text-sm"
                    >
                      <CheckCircle size={16} /> Approve
                    </button>
                    <button 
                      onClick={() => handleAction(review.id, 'rejected')}
                      className="flex items-center justify-center gap-2 w-full py-2.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-colors font-medium text-sm"
                    >
                      <XCircle size={16} /> Reject
                    </button>
                  </>
                )}
                
                {review.status === 'approved' && (
                  <>
                    <div className="flex items-center gap-2 text-emerald-400 font-medium text-sm justify-center mb-2">
                      <CheckCircle size={16} /> Approved
                    </div>
                    <button 
                      onClick={() => handleAction(review.id, 'rejected')}
                      className="w-full py-2 text-xs text-secondaryText hover:text-red-400 transition-colors"
                    >
                      Revert to Rejected
                    </button>
                  </>
                )}
                
                {review.status === 'rejected' && (
                  <>
                    <div className="flex items-center gap-2 text-red-400 font-medium text-sm justify-center mb-2">
                      <AlertTriangle size={16} /> Rejected
                    </div>
                    <button 
                      onClick={() => handleAction(review.id, 'approved')}
                      className="w-full py-2 text-xs text-secondaryText hover:text-emerald-400 transition-colors"
                    >
                      Revert to Approved
                    </button>
                  </>
                )}
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}
