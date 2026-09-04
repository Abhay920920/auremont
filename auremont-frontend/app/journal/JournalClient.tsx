"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { BookOpen, Clock } from "lucide-react";
import Breadcrumbs from "@/components/seo/Breadcrumbs";

interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  coverImage?: string;
  publishedAt: string;
  authorName?: string;
  authorRole?: string;
  category?: string;
}

const PRODUCTION_JOURNAL_ARTICLES: Blog[] = [
  {
    id: "journal-1",
    title: "The Art of Slow Roasting: Perfection in Every Kernel",
    slug: "the-art-of-slow-roasting",
    category: "The Craft",
    authorName: "Chef Jean-Paul Laurent",
    authorRole: "Master Roaster & Confectioner",
    content: "Discover how RARE NUTS master artisans slowly roast hand-selected California almonds in micro-batches over cured almond wood to unlock deep aromatic depth and an airy, resonant crunch.",
    coverImage: "/images/roasted-almonds-jar.png",
    publishedAt: new Date("2025-01-15T09:00:00Z").toISOString()
  },
  {
    id: "journal-2",
    title: "California Sourcing: The 36th Parallel Terroir",
    slug: "the-california-terroir",
    category: "Terroir & Harvest",
    authorName: "Elena Vance",
    authorRole: "Botanical Agronomist",
    content: "Journey to the alluvial soils of California’s San Joaquin Valley where Sierra Nevada snowmelt and Mediterranean sun create the supreme Nonpareil reserve.",
    coverImage: "/images/california-almonds-250g.png",
    publishedAt: new Date("2025-01-28T11:30:00Z").toISOString()
  },
  {
    id: "journal-3",
    title: "Mastering the Fine Nut Pairing: From Grand Cru to Vintage Tea",
    slug: "mastering-the-fine-nut-pairing",
    category: "Pairings & Taste",
    authorName: "Sommelier Marcus Thorne",
    authorRole: "Cellar Master & Sensory Director",
    content: "Elevate your tasting salon with our curated guide pairing slow-roasted sea salt almonds with Blanc de Blancs Champagne, peated single malts, and first-flush Darjeeling.",
    coverImage: "/images/luxury-gift-box-unboxing.png",
    publishedAt: new Date("2025-02-10T14:00:00Z").toISOString()
  },
  {
    id: "journal-4",
    title: "Heirloom Presentation & The Architecture of Bespoke Gifting",
    slug: "heirloom-packaging-and-the-art-of-gifting",
    category: "Gifting",
    authorName: "Claire DeWitt",
    authorRole: "Creative Director of Presentation",
    content: "An inside look at our handcrafted solid mahogany presentation cases, mortise-and-tenon joints, and midnight velvet inlays designed for lifetime keepsake display.",
    coverImage: "/images/royal-almonds-wooden-box.png",
    publishedAt: new Date("2025-02-18T16:45:00Z").toISOString()
  },
  {
    id: "journal-5",
    title: "Botanical Vitality: The Science Behind Raw Reserve Almonds",
    slug: "nutritional-supremacy-of-unprocessed-almonds",
    category: "Botanical Science",
    authorName: "Dr. Aris Thorne",
    authorRole: "Nutritional Biochemist",
    content: "Clinical insights into alpha-tocopherol Vitamin E, polyphenols, heart-healthy monounsaturates, and clean non-chemical steam pasteurization in California almonds.",
    coverImage: "/images/almonds-pouch-window.png",
    publishedAt: new Date("2025-02-25T10:15:00Z").toISOString()
  }
];

export default function JournalClient() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "The Craft", "Terroir & Harvest", "Pairings & Taste", "Gifting", "Botanical Science"];

  useEffect(() => {
    api.get('/blogs')
      .then((res) => {
        const data = res.data?.data || res.data || [];
        if (Array.isArray(data) && data.length > 0) {
          const enriched = data.map((b: any, idx: number) => ({
            ...b,
            category: b.category || PRODUCTION_JOURNAL_ARTICLES[idx % PRODUCTION_JOURNAL_ARTICLES.length]?.category || "The Craft",
            authorName: b.authorName || PRODUCTION_JOURNAL_ARTICLES[idx % PRODUCTION_JOURNAL_ARTICLES.length]?.authorName || "RARE NUTS Editorial",
            authorRole: b.authorRole || PRODUCTION_JOURNAL_ARTICLES[idx % PRODUCTION_JOURNAL_ARTICLES.length]?.authorRole || "Culinary Directorate",
          }));
          setBlogs(enriched);
        } else {
          setBlogs(PRODUCTION_JOURNAL_ARTICLES);
        }
        return null;
      })
      .catch(() => {
        setBlogs(PRODUCTION_JOURNAL_ARTICLES);
        return null;
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const displayBlogs = (blogs.length > 0 ? blogs : PRODUCTION_JOURNAL_ARTICLES).filter(blog => {
    if (selectedCategory === "All") return true;
    return blog.category?.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <div className="w-full bg-background pt-32 pb-24 min-h-screen text-primaryText">
      <div className="site-container">
        <Breadcrumbs items={[{ label: "Home", url: "/" }, { label: "The Journal" }]} />

        {/* Page Header */}
        <div className="text-center my-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-luxuryGold/25 bg-luxuryGold/5 text-luxuryGold text-[10px] uppercase tracking-ultra">
            <BookOpen size={12} />
            <span>RARE NUTS Chronicles</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-serif text-primaryText tracking-tight">
            The RARE NUTS <span className="text-luxuryGold italic">Journal</span>
          </h1>
          <p className="text-secondaryText text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Essays on terroir, the culinary science of wood-convection roasting, sommelier pairing salons, and the philosophy of heirloom luxury.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-14">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs transition-all duration-300 ${
                selectedCategory === cat
                  ? "bg-luxuryGold text-background font-medium shadow-lg"
                  : "bg-surface text-secondaryText border border-divider hover:border-luxuryGold/40 hover:text-primaryText"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex flex-col gap-4 bg-secondaryBg p-4 rounded-card border border-divider">
                <div className="aspect-[4/3] bg-surface rounded-card w-full"></div>
                <div className="h-4 bg-surface w-1/3 rounded"></div>
                <div className="h-6 bg-surface w-3/4 rounded"></div>
                <div className="h-4 bg-surface w-full rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {displayBlogs.map(blog => (
              <Link 
                href={`/journal/${blog.slug}`} 
                key={blog.id || blog.slug} 
                className="group flex flex-col justify-between bg-secondaryBg/70 hover:bg-secondaryBg border border-divider hover:border-luxuryGold/50 rounded-card p-4 sm:p-5 transition-all duration-500 shadow-md cursor-pointer"
              >
                <div>
                  {/* Article Thumbnail */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-card bg-surface border border-divider mb-5">
                    {blog.coverImage ? (
                      <Image 
                        src={blog.coverImage} 
                        alt={blog.title} 
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-luxuryGold/40">
                        <span className="font-serif italic text-2xl">RARE NUTS</span>
                      </div>
                    )}
                    
                    {/* Category pill on image */}
                    <div className="absolute top-3 left-3 bg-background/90 backdrop-blur-md border border-luxuryGold/30 text-luxuryGold text-[9px] uppercase tracking-widest px-2.5 py-1 rounded font-medium">
                      {blog.category || "Editorial"}
                    </div>
                  </div>

                  {/* Date & Reading Info */}
                  <div className="flex items-center justify-between text-[10px] text-mutedText font-mono uppercase tracking-wider mb-2">
                    <span>{format(new Date(blog.publishedAt || Date.now()), 'MMMM d, yyyy')}</span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} /> 5 min read
                    </span>
                  </div>

                  {/* Article Title */}
                  <h2 className="text-xl font-serif text-primaryText group-hover:text-luxuryGold transition-colors leading-tight mb-3 line-clamp-2">
                    {blog.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-secondaryText text-xs sm:text-sm line-clamp-3 leading-relaxed font-light mb-4">
                    {blog.content.replace(/<[^>]*>?/gm, '')}
                  </p>
                </div>

                {/* Author & Read Action Footer */}
                <div className="pt-4 border-t border-divider/60 flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-surface border border-luxuryGold/30 flex items-center justify-center text-luxuryGold text-[10px] font-serif">
                      {blog.authorName ? blog.authorName.charAt(0) : "R"}
                    </div>
                    <div>
                      <p className="text-xs text-primaryText font-medium line-clamp-1">{blog.authorName || "RARE NUTS"}</p>
                      <p className="text-[9px] text-mutedText line-clamp-1">{blog.authorRole || "Editorial Bureau"}</p>
                    </div>
                  </div>

                  <span className="text-luxuryGold text-xs uppercase tracking-wider flex items-center gap-1 font-medium group-hover:translate-x-1 transition-transform">
                    Read &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
