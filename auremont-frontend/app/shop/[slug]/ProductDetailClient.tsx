"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";

// Modular Components
import ImageGallery from "@/components/shop/ImageGallery";
import ProductInfo from "@/components/shop/ProductInfo";
import StickyPurchasePanel from "@/components/shop/StickyPurchasePanel";
import AccordionDetails from "@/components/shop/AccordionDetails";
import RelatedProducts from "@/components/shop/RelatedProducts";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { Star } from "lucide-react";

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star key={star} size={size} fill={star <= rating ? "currentColor" : "none"} className={star <= rating ? "text-luxuryGold" : "text-divider"} strokeWidth={1} />
      ))}
    </div>
  );
}

export default function ProductDetailClient() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { user } = useAuthStore();

  const [product, setProduct] = useState<any | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [reviewForm, setReviewForm] = useState({ rating: 5, title: "", review: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [isReviewDrawerOpen, setIsReviewDrawerOpen] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const load = async () => {
      try {
        const prodRes = await api.get(`/products/${slug}`);
        const rawData = prodRes.data;
        const p = (rawData && rawData.data && !Array.isArray(rawData.data)) ? rawData.data : rawData;
        setProduct(p);
        if (p?.reviews && Array.isArray(p.reviews)) {
          setReviews(p.reviews);
        } else if (p?.id) {
          try {
            const rr = await api.get(`/reviews/product/${p.id}`);
            setReviews(rr.data || []);
          } catch { /* no reviews */ }
        }
      } catch (err) {
        console.error("Failed to load product", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { router.push('/login'); return; }
    setSubmittingReview(true);
    setReviewError("");
    try {
      await api.post('/reviews', { productId: product!.id, ...reviewForm });
      setReviewSuccess(true);
      setReviewForm({ rating: 5, title: "", review: "" });
      const rr = await api.get(`/reviews/product/${product!.id}`);
      setReviews(rr.data || []);
    } catch (err: any) {
      setReviewError(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-[1400px] mx-auto px-6 py-32 grid grid-cols-1 lg:grid-cols-2 gap-16 animate-pulse">
        <div className="aspect-[4/5] bg-secondaryBg border border-divider" />
        <div className="space-y-6 pt-12">
          <div className="h-12 bg-secondaryBg rounded w-3/4" />
          <div className="h-8 bg-secondaryBg rounded w-1/4" />
          <div className="h-6 bg-secondaryBg rounded w-full mt-12" />
          <div className="h-6 bg-secondaryBg rounded w-5/6" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <h1 className="font-serif text-3xl text-primaryText">Product Not Found</h1>
        <Link href="/shop" className="luxury-link text-sm">← Back to Shop</Link>
      </div>
    );
  }

  const allImages = [
    ...(product.thumbnailUrl ? [product.thumbnailUrl] : []),
    ...(product.images?.map((i: any) => i.imageUrl) || []),
  ].filter((v, i, a) => a.indexOf(v) === i);

  const avgRating = reviews.length > 0
    ? Math.round(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length)
    : 0;

  return (
    <div className="w-full bg-background pt-32 pb-24 md:pb-super">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Breadcrumb */}
        <Breadcrumbs items={[
          { label: "Home", url: "/" },
          { label: "Shop", url: "/shop" },
          ...(product.category ? [{ label: product.category.name, url: `/category/${product.category.slug}` }] : []),
          { label: product.name }
        ]} />

        {/* Main Layout: Sticky Left, Scrolling Right */}
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 relative">
          
          {/* LEFT COLUMN: Sticky Gallery */}
          <div className="w-full lg:w-1/2">
            <ImageGallery images={allImages} />
          </div>

          {/* RIGHT COLUMN: Scrolling Details */}
          <div className="w-full lg:w-1/2 flex flex-col space-y-8 animate-slide-up">
            
            <ProductInfo product={product} reviews={reviews} avgRating={avgRating} />
            <StickyPurchasePanel product={product} />
            <AccordionDetails product={product} />

            {/* Reviews Section */}
            <div className="space-y-10 pt-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-divider pb-6">
                <div>
                  <h2 className="font-serif text-3xl text-primaryText mb-1">Client Reviews</h2>
                  {reviews.length > 0 && (
                    <div className="flex items-center gap-3">
                      <StarRating rating={avgRating} size={16} />
                      <span className="text-secondaryText text-xs font-mono tracking-wide">{avgRating}.0 / 5.0 · ({reviews.length} Verified Reviews)</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    if (!user) { router.push('/login'); return; }
                    setIsReviewDrawerOpen(true);
                  }}
                  className="luxury-button-outline text-xs py-3 px-6 inline-flex items-center gap-2 self-start sm:self-auto"
                >
                  <Star size={14} className="text-luxuryGold" />
                  <span>Write A Review</span>
                </button>
              </div>

              {/* Review List */}
              <div className="space-y-8">
                {reviews.length === 0 ? (
                  <div className="p-8 border border-dashed border-divider rounded-card text-center space-y-3">
                    <p className="text-secondaryText text-sm font-light">No client reviews yet. Be the first to share your experience with {product.name}.</p>
                    <button
                      onClick={() => {
                        if (!user) { router.push('/login'); return; }
                        setIsReviewDrawerOpen(true);
                      }}
                      className="text-xs text-luxuryGold uppercase tracking-widest font-mono hover:underline inline-block"
                    >
                      Write First Review →
                    </button>
                  </div>
                ) : (
                  reviews.map(r => (
                    <div key={r.id} className="border-b border-divider pb-8 last:border-0 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <StarRating rating={r.rating} size={14} />
                          <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-mono bg-emerald-950/40 px-2 py-0.5 border border-emerald-500/30 rounded-full inline-block">
                            Verified Purchaser
                          </span>
                        </div>
                        <span className="text-xs text-mutedText font-light">{new Date(r.createdAt).toLocaleDateString()}</span>
                      </div>
                      {r.title && <h4 className="font-serif text-lg text-primaryText">{r.title}</h4>}
                      {r.review && <p className="text-secondaryText text-sm leading-relaxed font-light">{r.review}</p>}
                      <p className="text-xs text-mutedText uppercase tracking-widest">— {r.user?.firstName || "Discerning"} {r.user?.lastName || "Client"}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Sliding Verified Review Drawer Modal */}
            {isReviewDrawerOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                <div className="bg-background border border-luxuryGold/40 rounded-card p-6 md:p-8 max-w-lg w-full space-y-6 shadow-2xl relative animate-scale-up">
                  <div className="flex justify-between items-center border-b border-divider pb-4">
                    <h3 className="font-serif text-2xl text-primaryText flex items-center gap-2">
                      Review Experience
                      <Star size={18} className="text-luxuryGold fill-luxuryGold" />
                    </h3>
                    <button onClick={() => setIsReviewDrawerOpen(false)} className="text-secondaryText hover:text-luxuryGold text-xl font-mono">✕</button>
                  </div>

                  {reviewSuccess ? (
                    <div className="p-6 bg-luxuryGold/10 border border-luxuryGold/30 text-luxuryGold text-sm text-center space-y-4">
                      <p className="font-serif text-lg">Thank You!</p>
                      <p className="text-xs font-light text-secondaryText">Your verified review has been submitted and published.</p>
                      <button onClick={() => { setReviewSuccess(false); setIsReviewDrawerOpen(false); }} className="luxury-button text-xs py-2 px-6">Done</button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitReview} className="space-y-5">
                      {reviewError && <p className="text-error text-xs">{reviewError}</p>}
                      
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest font-mono text-secondaryText block">Overall Rating</label>
                        <div className="flex gap-3 bg-secondaryBg p-3 rounded-card border border-divider justify-center">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button key={star} type="button" onClick={() => setReviewForm(p => ({ ...p, rating: star }))}
                              className={`text-3xl transition-transform hover:scale-125 ${star <= reviewForm.rating ? 'text-luxuryGold' : 'text-divider'}`}>★</button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest font-mono text-secondaryText block">Headline Title</label>
                        <input
                          type="text"
                          required
                          className="w-full bg-secondaryBg border border-divider rounded-card px-4 py-3 text-xs text-primaryText focus:outline-none focus:border-luxuryGold transition-colors"
                          value={reviewForm.title}
                          onChange={e => setReviewForm(p => ({ ...p, title: e.target.value }))}
                          placeholder="Summarize your experience..."
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest font-mono text-secondaryText block">Detailed Comments</label>
                        <textarea
                          required
                          rows={4}
                          className="w-full bg-secondaryBg border border-divider rounded-card px-4 py-3 text-xs text-primaryText focus:outline-none focus:border-luxuryGold transition-colors resize-none"
                          value={reviewForm.review}
                          onChange={e => setReviewForm(p => ({ ...p, review: e.target.value }))}
                          placeholder="Describe the aroma, crunch, packaging, and overall impression..."
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={submittingReview}
                        className="luxury-button w-full text-xs py-4"
                      >
                        {submittingReview ? 'Publishing Review...' : 'Publish Verified Review'}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <RelatedProducts categoryId={product.categoryId} currentProductId={product.id} />
      </div>
    </div>
  );
}
