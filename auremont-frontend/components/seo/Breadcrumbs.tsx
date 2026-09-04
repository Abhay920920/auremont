"use client";

import Link from "next/link";
import React from "react";
import JsonLd from "@/components/JsonLd";

interface BreadcrumbItem {
  label: string;
  url?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rarenuts.com';

  // Construct JSON-LD
  const breadcrumbListSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": item.url ? `${siteUrl}${item.url}` : undefined,
    }))
  };

  return (
    <>
      <JsonLd data={breadcrumbListSchema} />
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs uppercase tracking-wider text-zinc-400 mb-6 sm:mb-8 font-mono">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <React.Fragment key={index}>
              {item.url && !isLast ? (
                <Link href={item.url} className="hover:text-luxuryGold transition-colors text-zinc-400">
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? "text-luxuryGold font-medium" : "text-zinc-400"}>
                  {item.label}
                </span>
              )}
              {!isLast && <span className="text-zinc-600 mx-1">/</span>}
            </React.Fragment>
          );
        })}
      </nav>
    </>
  );
}
