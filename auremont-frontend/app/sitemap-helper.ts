import { NextResponse } from "next/server";

export function generateSitemapResponse(sitemapXml: string) {
  return new NextResponse(sitemapXml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}

export function generateSitemapError() {
  return new NextResponse(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
