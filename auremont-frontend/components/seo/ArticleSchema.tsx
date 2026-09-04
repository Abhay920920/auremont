import JsonLd from "../JsonLd";

interface ArticleSchemaProps {
  title: string;
  description?: string;
  slug: string;
  coverImage?: string;
  publishedAt: string;
  modifiedAt?: string;
  authorName?: string;
}

export default function ArticleSchema({
  title,
  description,
  slug,
  coverImage,
  publishedAt,
  modifiedAt,
  authorName = "Chef Jean-Paul Laurent",
}: ArticleSchemaProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rarenuts.in';
  const articleUrl = `${siteUrl}/journal/${slug}`;
  const imageUrl = coverImage
    ? coverImage.startsWith('http')
      ? coverImage
      : `${siteUrl}${coverImage.startsWith('/') ? '' : '/'}${coverImage}`
    : `${siteUrl}/images/og-rarenuts.png`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "description": description || title,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": articleUrl
    },
    "url": articleUrl,
    "image": [imageUrl],
    "datePublished": publishedAt,
    "dateModified": modifiedAt || publishedAt,
    "author": {
      "@type": "Person",
      "name": authorName
    },
    "publisher": {
      "@type": "Organization",
      "name": "RARE NUTS",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/images/og-rarenuts.png`
      }
    }
  };

  return <JsonLd data={schema} />;
}
