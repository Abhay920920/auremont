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

  useEffect(() => {
    if (!slug) return;
    const load = async () => {
      try {
        const prodRes = await api.get(`/products/${slug}`);
        const rawData = prodRes.data;
        const p = (rawData && rawData.data && !Array.isArray(rawData.data)) ? rawData.data : rawData;
        setProduct(p);
        try {
          const rr = await api.get(`/reviews/product/${p.id}`);
          setReviews(rr.data || []);
        } catch { /* no reviews */ }
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
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
                <h2 className="font-serif text-3xl text-primaryText">Client Reviews</h2>
                {reviews.length > 0 && (
                  <div className="flex items-center gap-3">
                    <StarRating rating={avgRating} size={16} />
                    <span className="text-secondaryText text-sm tracking-wide">{avgRating}/5 · {reviews.length} Reviews</span>
                  </div>
                )}
              </div>

              {/* Write a review */}
              <div className="bg-secondaryBg border border-divider p-8 space-y-6">
                <h3 className="font-serif text-xl">Share Your Experience</h3>
                {!user ? (
                  <p className="text-secondaryText text-sm font-light">
                    <Link href="/login" className="text-luxuryGold hover:underline transition-colors">Sign in</Link> to leave a review.
                  </p>
                ) : reviewSuccess ? (
                  <div className="p-4 bg-luxuryGold/10 border border-luxuryGold/30 text-luxuryGold text-sm">
                    Thank you. Your review has been submitted for curation.
                  </div>
                ) : (
                  <form onSubmit={handleSubmitReview} className="space-y-6">
                    {reviewError && <p className="text-error text-sm">{reviewError}</p>}
                    <div className="space-y-3">
                      <label className="text-xs uppercase tracking-widest font-medium text-secondaryText">Rating</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button key={star} type="button" onClick={() => setReviewForm(p => ({ ...p, rating: star }))}
                            className={`text-2xl transition-transform hover:scale-110 ${star <= reviewForm.rating ? 'text-luxuryGold' : 'text-divider'}`}>★</button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest font-medium text-secondaryText">Title</label>
                      <input
                        type="text"
                        required
                        className="w-full bg-background border border-divider rounded-input px-4 py-3 text-sm focus:outline-none focus:border-luxuryGold transition-colors"
                        value={reviewForm.title}
                        onChange={e => setReviewForm(p => ({ ...p, title: e.target.value }))}
                        placeholder="Sum up your experience"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest font-medium text-secondaryText">Review</label>
                      <textarea
                        required
                        rows={4}
                        className="w-full bg-background border border-divider rounded-input px-4 py-3 text-sm focus:outline-none focus:border-luxuryGold transition-colors resize-none"
                        value={reviewForm.review}
                        onChange={e => setReviewForm(p => ({ ...p, review: e.target.value }))}
                        placeholder="Tell us what you think..."
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="luxury-button w-full"
                    >
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                )}
              </div>

              {/* Review List */}
              <div className="space-y-8">
                {reviews.length === 0 ? (
                  <p className="text-secondaryText text-sm font-light italic">No reviews yet. Be the first to share your experience.</p>
                ) : (
                  reviews.map(r => (
                    <div key={r.id} className="border-b border-divider pb-8 last:border-0 space-y-3">
                      <div className="flex items-center justify-between">
                        <StarRating rating={r.rating} size={14} />
                        <span className="text-xs text-mutedText font-light">{new Date(r.createdAt).toLocaleDateString()}</span>
                      </div>
                      {r.title && <h4 className="font-serif text-lg text-primaryText">{r.title}</h4>}
                      {r.review && <p className="text-secondaryText text-sm leading-relaxed font-light">{r.review}</p>}
                      <p className="text-xs text-mutedText uppercase tracking-widest">— {r.user.firstName} {r.user.lastName}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <RelatedProducts categoryId={product.categoryId} currentProductId={product.id} />
      </div>
    </div>
  );
}
