"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import Link from "next/link";
import { ArrowLeft, Clock, Share2, Check } from "lucide-react";
import Image from "next/image";
import DOMPurify from 'isomorphic-dompurify';
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { BlogArticle, FALLBACK_ARTICLES } from "@/lib/journalData";

export default function JournalArticleClient({ blog }: { blog: BlogArticle }) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Curate related articles
  const otherStories = Object.values(FALLBACK_ARTICLES).filter(a => a.slug !== blog.slug).slice(0, 2);

  return (
    <div className="w-full bg-background min-h-screen pt-32 pb-24 text-primaryText">
      <div className="site-container-reading">
        
        {/* Navigation & Breadcrumbs */}
        <div className="mb-8">
          <Breadcrumbs items={[
            { label: "Home", url: "/" }, 
            { label: "Journal", url: "/journal" }, 
            { label: blog.title }
          ]} />
          
          <Link 
            href="/journal" 
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-secondaryText hover:text-luxuryGold transition-colors mt-6 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span>Return to All Chronicles</span>
          </Link>
        </div>

        {/* Article Header */}
        <header className="space-y-6 mb-12">
          {blog.category && (
            <span className="inline-block text-[10px] uppercase tracking-ultra text-luxuryGold font-medium bg-luxuryGold/10 px-3.5 py-1 rounded-full border border-luxuryGold/20">
              {blog.category}
            </span>
          )}

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif text-primaryText leading-[1.15] tracking-tight">
            {blog.title}
          </h1>

          {/* Byline Metadata & Share Action */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-divider/60 text-xs text-secondaryText">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-surface border border-luxuryGold/30 flex items-center justify-center text-luxuryGold font-serif text-sm">
                {blog.authorName ? blog.authorName.charAt(0) : "A"}
              </div>
              <div>
                <p className="text-primaryText font-medium">{blog.authorName || "RARE NUTS"}</p>
                <p className="text-[10px] text-mutedText">{blog.authorRole || "Culinary Directorate"}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-[11px] font-mono">
              <span>{format(new Date(blog.publishedAt || Date.now()), 'MMMM d, yyyy')}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock size={12} /> 5 min read
              </span>
              <button 
                onClick={handleShare}
                aria-label="Share article"
                className="flex items-center gap-1.5 px-3 py-1 rounded border border-divider hover:border-luxuryGold/50 text-luxuryGold transition-colors ml-2"
              >
                {copied ? (
                  <>
                    <Check size={12} />
                    <span className="text-[10px]">Link Copied</span>
                  </>
                ) : (
                  <>
                    <Share2 size={12} />
                    <span className="text-[10px]">Share</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Hero Cover Image */}
        {blog.coverImage && (
          <div className="relative aspect-[16/9] w-full rounded-card overflow-hidden border border-divider shadow-2xl mb-14 bg-secondaryBg">
            <Image 
              src={blog.coverImage} 
              alt={blog.title} 
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 896px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
          </div>
        )}

        {/* Rich Article Body Content */}
        <article className="prose prose-invert max-w-none text-secondaryText font-light text-base sm:text-lg leading-relaxed space-y-6
          prose-headings:font-serif prose-headings:text-primaryText prose-headings:font-normal
          prose-h2:text-2xl prose-h2:sm:text-3xl prose-h2:text-luxuryGold prose-h2:mt-10 prose-h2:mb-4
          prose-h3:text-xl prose-h3:sm:text-2xl prose-h3:text-primaryText prose-h3:mt-8 prose-h3:mb-3
          prose-blockquote:border-l-2 prose-blockquote:border-luxuryGold prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-primaryText prose-blockquote:bg-surface/40 prose-blockquote:py-3 prose-blockquote:rounded-r
          prose-strong:text-primaryText prose-strong:font-medium
          prose-em:text-luxuryGold
          prose-ul:space-y-2 prose-li:text-secondaryText"
        >
          <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content || '') }} />
        </article>

        {/* Author Bio Card */}
        <div className="mt-16 p-8 bg-secondaryBg border border-divider rounded-card flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-surface border border-luxuryGold/40 flex items-center justify-center text-luxuryGold font-serif text-2xl flex-shrink-0">
            {blog.authorName ? blog.authorName.charAt(0) : "M"}
          </div>
          <div className="space-y-1">
            <span className="text-[9px] uppercase tracking-widest text-luxuryGold font-mono">Article Contributor</span>
            <h3 className="text-xl font-serif text-primaryText">{blog.authorName || "RARE NUTS Directorate"}</h3>
            <p className="text-xs text-mutedText font-mono">{blog.authorRole || "Editorial Fellow"}</p>
            <p className="text-xs text-secondaryText font-light pt-1 leading-relaxed">
              Dedicated to chronicling the botanical nuances, culinary science, and fine dining traditions of single-origin tree nuts for RARE NUTS.
            </p>
          </div>
        </div>

        {/* Continue Reading Other Stories */}
        <div className="mt-20 pt-16 border-t border-divider">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-serif text-primaryText">Continue Reading</h2>
            <Link href="/journal" className="text-xs uppercase tracking-widest text-luxuryGold hover:underline font-medium">
              View All Articles &rarr;
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            {otherStories.map((story) => (
              <Link 
                href={`/journal/${story.slug}`} 
                key={story.slug}
                className="group flex flex-col justify-between bg-surface/60 hover:bg-surface p-5 rounded-card border border-divider hover:border-luxuryGold/40 transition-all duration-300"
              >
                <div className="space-y-3">
                  <div className="relative aspect-[16/9] w-full rounded overflow-hidden border border-divider/60">
                    <Image 
                      src={story.coverImage || '/images/roasted-almonds-jar.png'} 
                      alt={story.title} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                  <span className="text-[9px] uppercase tracking-widest text-luxuryGold font-mono block">
                    {story.category}
                  </span>
                  <h3 className="font-serif text-lg text-primaryText group-hover:text-luxuryGold transition-colors line-clamp-2">
                    {story.title}
                  </h3>
                </div>
                <div className="pt-4 mt-3 border-t border-divider/60 flex items-center justify-between text-xs text-secondaryText">
                  <span>{story.authorName}</span>
                  <span className="text-luxuryGold font-medium">Read &rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
