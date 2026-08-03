"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";

interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  coverImage?: string;
  publishedAt: string;
}

const FEATURED_STORIES: Blog[] = [
  {
    id: "featured-1",
    title: "The Art of Slow Roasting: Perfection in Every Kernel",
    slug: "art-of-slow-roasting",
    content: "Discover how Auremont master artisans slowly roast hand-selected California almonds in micro-batches to unlock deep aromatic notes and unmatched crunch.",
    coverImage: "/images/roasted-almonds-jar.png",
    publishedAt: new Date().toISOString()
  },
  {
    id: "featured-2",
    title: "California Sourcing: Orchards of Gold",
    slug: "california-sourcing-orchards-of-gold",
    content: "Journey to the sun-drenched valleys of Central California where the world's finest almonds are cultivated under ideal microclimates and sustainable stewardship.",
    coverImage: "/images/california-almonds-250g.png",
    publishedAt: new Date().toISOString()
  },
  {
    id: "featured-3",
    title: "Bespoke Packaging & European Heritage Craftsmanship",
    slug: "bespoke-packaging-heritage",
    content: "An inside look at our handcrafted oak presentation cases, magnetic closures, and velvet lining created for extraordinary gifting moments.",
    coverImage: "/images/royal-almonds-wooden-box.png",
    publishedAt: new Date().toISOString()
  }
];

export default function JournalPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/blogs')
      .then((res) => {
        const data = res.data?.data || res.data || [];
        setBlogs(Array.isArray(data) && data.length > 0 ? data : FEATURED_STORIES);
      })
      .catch(() => {
        setBlogs(FEATURED_STORIES);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const displayBlogs = blogs.length > 0 ? blogs : FEATURED_STORIES;

  return (
    <div className="w-full bg-background pt-32 pb-24 min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif text-luxuryGold mb-6 tracking-tight uppercase">The Auremont Journal</h1>
          <p className="text-secondaryText text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Discover stories about our craft, the provenance of our ingredients, and the inspiration behind our collections.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex flex-col gap-4">
                <div className="aspect-[4/3] bg-secondaryBg rounded-2xl w-full border border-divider"></div>
                <div className="h-4 bg-secondaryBg w-1/3 rounded"></div>
                <div className="h-6 bg-secondaryBg w-3/4 rounded"></div>
                <div className="h-4 bg-secondaryBg w-full rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {displayBlogs.map(blog => (
              <Link href={`/journal/${blog.slug}`} key={blog.id} className="group flex flex-col gap-5 cursor-pointer">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-secondaryBg border border-divider">
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
                      <span className="font-serif italic text-2xl">Auremont</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-medium tracking-widest text-luxuryGold uppercase">
                    {format(new Date(blog.publishedAt), 'MMMM d, yyyy')}
                  </p>
                  <h2 className="text-2xl font-serif text-primaryText group-hover:text-luxuryGold transition-colors leading-tight">
                    {blog.title}
                  </h2>
                  <p className="text-secondaryText text-sm line-clamp-3 leading-relaxed font-light">
                    {blog.content.replace(/<[^>]*>?/gm, '')}
                  </p>
                  <span className="text-luxuryGold text-xs font-medium uppercase tracking-wider mt-2 group-hover:underline underline-offset-4 flex items-center gap-1">
                    Read Story &rarr;
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
