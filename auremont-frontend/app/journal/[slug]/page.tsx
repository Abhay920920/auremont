import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import JournalArticleClient from "./JournalArticleClient";
import ArticleSchema from "@/components/seo/ArticleSchema";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import { BlogArticle, FALLBACK_ARTICLES } from "@/lib/journalData";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getArticle(slug: string): Promise<BlogArticle | null> {
  const localMatch = FALLBACK_ARTICLES[slug];
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
  
  try {
    const res = await fetch(`${backendUrl}/blogs/${slug}`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      if (data) {
        return {
          ...data,
          authorName: data.authorName || localMatch?.authorName || "Chef Jean-Paul Laurent",
          authorRole: data.authorRole || localMatch?.authorRole || "Master Roaster & Confectioner",
          category: data.category || localMatch?.category || "Artisanal Chronicle",
          seoDescription: data.seoDescription || localMatch?.seoDescription || data.title,
        };
      }
    }
  } catch {
    // Silently fallback to static dictionary
  }

  return localMatch || null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getArticle(slug);

  if (!blog) {
    return {
      title: "Article Not Found | RARE NUTS Journal",
      robots: { index: false, follow: false },
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rarenuts.in';
  const canonicalUrl = `${siteUrl}/journal/${slug}`;
  const description = blog.seoDescription || `Read ${blog.title} from the RARE NUTS Journal.`;
  const imageUrl = blog.coverImage 
    ? (blog.coverImage.startsWith('http') ? blog.coverImage : `${siteUrl}${blog.coverImage.startsWith('/') ? '' : '/'}${blog.coverImage}`)
    : `${siteUrl}/images/og-rarenuts.png`;

  return {
    title: `${blog.title} | RARE NUTS Journal`,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${blog.title} | RARE NUTS Journal`,
      description,
      url: canonicalUrl,
      siteName: "RARE NUTS",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
      type: "article",
      publishedTime: blog.publishedAt,
      modifiedTime: blog.modifiedAt || blog.publishedAt,
      authors: [blog.authorName || "RARE NUTS"],
      section: blog.category,
    },
    twitter: {
      card: "summary_large_image",
      title: `${blog.title} | RARE NUTS Journal`,
      description,
      images: [imageUrl],
    },
  };
}

export default async function JournalDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const blog = await getArticle(slug);

  if (!blog) {
    notFound();
  }

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Journal", url: "/journal" },
    { name: blog.title, url: `/journal/${slug}` },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <ArticleSchema
        title={blog.title}
        description={blog.seoDescription}
        slug={blog.slug || slug}
        coverImage={blog.coverImage}
        publishedAt={blog.publishedAt}
        modifiedAt={blog.modifiedAt}
        authorName={blog.authorName}
      />
      <JournalArticleClient blog={blog} />
    </>
  );
}
