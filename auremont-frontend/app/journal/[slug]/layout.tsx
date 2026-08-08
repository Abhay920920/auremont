/* eslint-disable max-lines-per-function, complexity */
import { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const res = await fetch(`${apiUrl}/blogs/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Blog not found');
    const blog = await res.json();
    
    const imageUrl = blog.imageUrl || '/images/og-rarenuts.png';
    const plainTextDescription = blog.content ? blog.content.replace(/<[^>]+>/g, '').substring(0, 160) : `Read ${blog.title} at RARE NUTS Journal.`;

    return {
      title: blog.seoTitle || blog.title,
      description: blog.seoDescription || plainTextDescription,
      keywords: blog.focusKeyword ? [blog.focusKeyword] : [],
      alternates: {
        canonical: blog.canonicalUrl || `${siteUrl}/journal/${slug}`,
      },
      robots: blog.isIndexable === false ? { index: false, follow: false } : { index: true, follow: true },
      openGraph: {
        title: blog.seoTitle || blog.title,
        description: blog.seoDescription || plainTextDescription,
        url: `${siteUrl}/journal/${slug}`,
        type: 'article',
        publishedTime: blog.createdAt,
        modifiedTime: blog.updatedAt,
        authors: [blog.authorName || (blog.author?.firstName ? `${blog.author.firstName} ${blog.author.lastName}` : 'RARE NUTS Editorial')],
        images: [
          {
            url: blog.ogImageUrl || imageUrl,
            width: 1200,
            height: 630,
            alt: blog.title,
          }
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: blog.seoTitle || blog.title,
        description: blog.seoDescription || plainTextDescription,
        images: [blog.ogImageUrl || imageUrl],
      }
    };
  } catch (error) {
    return {
      title: 'Article Not Found',
    };
  }
}

export default async function JournalArticleLayout({ children, params }: { children: React.ReactNode, params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let articleJsonLd = null;
  
  try {
    const res = await fetch(`${apiUrl}/blogs/${slug}`, { next: { revalidate: 60 } });
    if (res.ok) {
      const blog = await res.json();
      const imageUrl = blog.imageUrl || `${siteUrl}/images/og-rarenuts.png`;
      
      articleJsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": blog.seoTitle || blog.title,
        "description": blog.seoDescription || undefined,
        "image": [blog.ogImageUrl || imageUrl],
        "datePublished": blog.createdAt,
        "dateModified": blog.updatedAt || blog.createdAt,
        "author": [{
          "@type": "Person",
          "name": blog.authorName || (blog.author?.firstName ? `${blog.author.firstName} ${blog.author.lastName}` : 'RARE NUTS Editorial'),
          "jobTitle": blog.authorRole || undefined,
          "url": `${siteUrl}/about`
        }],
        "publisher": {
          "@type": "Organization",
          "name": "RARE NUTS",
          "logo": {
            "@type": "ImageObject",
            "url": `${siteUrl}/images/og-rarenuts.png`
          }
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": blog.canonicalUrl || `${siteUrl}/journal/${slug}`
        }
      };

      if (blog.schemaOverride) {
        articleJsonLd = { ...articleJsonLd, ...blog.schemaOverride };
      }
    }
  } catch (e) {
    // silently fail JSON-LD on error
  }

  return (
    <>
      {articleJsonLd && <JsonLd data={articleJsonLd} />}
      {children}
    </>
  );
}
