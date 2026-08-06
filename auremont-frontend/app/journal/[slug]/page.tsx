"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { format } from "date-fns";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";

interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  coverImage?: string;
  publishedAt: string;
}

export default function JournalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.slug) return;
    api.get(`/blogs/${params.slug}`).then((res) => {
      setBlog(res.data);
    }).catch(err => {
      console.error(err);
      if (err.response?.status === 404) {
        router.replace('/journal');
      }
    }).finally(() => {
      setLoading(false);
    });
  }, [params.slug, router]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 animate-pulse">
        <div className="h-6 w-32 bg-brand-100 rounded mb-8"></div>
        <div className="h-12 bg-brand-100 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-brand-100 rounded w-1/4 mb-12"></div>
        <div className="aspect-[21/9] bg-brand-100 rounded-2xl w-full mb-12"></div>
        <div className="space-y-4">
          <div className="h-4 bg-brand-100 rounded w-full"></div>
          <div className="h-4 bg-brand-100 rounded w-full"></div>
          <div className="h-4 bg-brand-100 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (!blog) return null;

  return (
    <article className="pb-24">
      {/* Header section */}
      <div className="max-w-3xl mx-auto px-6 pt-16 pb-12">
        <Link href="/journal" className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-brand-500 hover:text-brand-900 transition-colors mb-10">
          <ArrowLeft className="w-4 h-4" /> Back to Journal
        </Link>
        <h1 className="text-4xl md:text-5xl font-serif text-brand-900 leading-tight mb-6">{blog.title}</h1>
        <p className="text-sm font-medium tracking-widest text-brand-500 uppercase">
          Published {format(new Date(blog.publishedAt), 'MMMM d, yyyy')}
        </p>
      </div>

      {/* Hero Image */}
      {blog.coverImage && (
        <div className="w-full max-w-5xl mx-auto px-6 mb-16">
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl bg-brand-50 shadow-sm">
            <Image 
              src={blog.coverImage} 
              alt={blog.title} 
              fill
              className="object-cover"
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6 prose prose-brand prose-lg prose-headings:font-serif prose-a:text-brand-900 hover:prose-a:text-brand-600">
        {/* Sanitize HTML content to prevent XSS script injection */}
        <div dangerouslySetInnerHTML={{ 
          __html: (blog.content || '')
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/on\w+="[^"]*"/gi, '')
            .replace(/on\w+='[^']*'/gi, '')
        }} />
      </div>
    </article>
  );
}
