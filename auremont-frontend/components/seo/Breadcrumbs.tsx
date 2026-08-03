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
  // Construct JSON-LD
  const breadcrumbListSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": item.url ? `http://localhost:3000${item.url}` : undefined,
    }))
  };

  return (
    <>
      <JsonLd data={breadcrumbListSchema} />
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-secondaryText mb-8">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <React.Fragment key={index}>
              {item.url && !isLast ? (
                <Link href={item.url} className="hover:text-luxuryGold transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? "text-primaryText font-medium" : "text-mutedText"}>
                  {item.label}
                </span>
              )}
              {!isLast && <span className="text-divider mx-1">/</span>}
            </React.Fragment>
          );
        })}
      </nav>
    </>
  );
}
