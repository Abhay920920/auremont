import React from 'react';
import { render } from '@testing-library/react';
import ProductSchema from '@/components/seo/ProductSchema';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import ArticleSchema from '@/components/seo/ArticleSchema';
import FAQSchema from '@/components/seo/FAQSchema';
import WebSiteSchema from '@/components/seo/WebSiteSchema';
import robots from '@/app/robots';

describe('SEO & Structured Data Regression Test Suite', () => {
  describe('ProductSchema Structured Data', () => {
    it('should generate valid Product JSON-LD without fabricated reviews when none provided', () => {
      const { container } = render(
        <ProductSchema
          name="California Reserve Raw Almonds 250g"
          description="Single-origin California reserve almonds."
          sku="ALM-RAW-250"
          image="/images/california-almonds-250g.png"
          price={799}
          currency="INR"
          inStock={true}
          slug="california-reserve-raw"
        />
      );

      const script = container.querySelector('script[type="application/ld+json"]');
      expect(script).not.toBeNull();

      const schema = JSON.parse(script!.textContent || '{}');
      expect(schema['@type']).toBe('Product');
      expect(schema.name).toBe('California Reserve Raw Almonds 250g');
      expect(schema.offers.price).toBe(799);
      expect(schema.offers.priceCurrency).toBe('INR');
      expect(schema.offers.availability).toBe('https://schema.org/InStock');
      // Must NOT contain fabricated aggregateRating
      expect(schema.aggregateRating).toBeUndefined();
    });

    it('should include aggregateRating only when valid reviews and ratings are present', () => {
      const { container } = render(
        <ProductSchema
          name="Slow-Roasted Sea Salt Almonds 500g"
          description="Artisanal slow-roasted California almonds."
          sku="ALM-RST-500"
          image="/images/roasted-almonds-jar.png"
          price={1299}
          currency="INR"
          inStock={true}
          ratingValue={4.8}
          reviewCount={15}
          slug="roasted-sea-salt-almonds"
        />
      );

      const script = container.querySelector('script[type="application/ld+json"]');
      const schema = JSON.parse(script!.textContent || '{}');
      expect(schema.aggregateRating).toBeDefined();
      expect(schema.aggregateRating['@type']).toBe('AggregateRating');
      expect(schema.aggregateRating.ratingValue).toBe(4.8);
      expect(schema.aggregateRating.reviewCount).toBe(15);
    });

    it('should correctly set OutOfStock availability schema when stock is 0', () => {
      const { container } = render(
        <ProductSchema
          name="Sold Out Almonds"
          description="Out of stock test"
          sku="ALM-OOS"
          image="/images/test.png"
          price={999}
          currency="INR"
          inStock={false}
          slug="sold-out-almonds"
        />
      );

      const script = container.querySelector('script[type="application/ld+json"]');
      const schema = JSON.parse(script!.textContent || '{}');
      expect(schema.offers.availability).toBe('https://schema.org/OutOfStock');
    });
  });

  describe('BreadcrumbSchema Structured Data', () => {
    it('should generate valid BreadcrumbList JSON-LD hierarchy', () => {
      const breadcrumbs = [
        { name: 'Home', url: '/' },
        { name: 'Shop', url: '/shop' },
        { name: 'Raw Reserve', url: '/shop?category=raw-reserve' },
        { name: 'California Reserve Raw', url: '/shop/california-reserve-raw' },
      ];

      const { container } = render(<BreadcrumbSchema items={breadcrumbs} />);
      const script = container.querySelector('script[type="application/ld+json"]');
      expect(script).not.toBeNull();

      const schema = JSON.parse(script!.textContent || '{}');
      expect(schema['@type']).toBe('BreadcrumbList');
      expect(schema.itemListElement.length).toBe(4);
      expect(schema.itemListElement[0].name).toBe('Home');
      expect(schema.itemListElement[0].position).toBe(1);
      expect(schema.itemListElement[3].name).toBe('California Reserve Raw');
      expect(schema.itemListElement[3].position).toBe(4);
    });
  });

  describe('ArticleSchema Structured Data', () => {
    it('should generate valid BlogPosting JSON-LD for journal articles', () => {
      const { container } = render(
        <ArticleSchema
          title="The Art of Slow Roasting"
          description="Discover convective almond-wood roasting."
          slug="the-art-of-slow-roasting"
          coverImage="/images/roasted-almonds-jar.png"
          publishedAt="2025-01-15T09:00:00Z"
          authorName="Chef Jean-Paul Laurent"
        />
      );

      const script = container.querySelector('script[type="application/ld+json"]');
      const schema = JSON.parse(script!.textContent || '{}');
      expect(schema['@type']).toBe('BlogPosting');
      expect(schema.headline).toBe('The Art of Slow Roasting');
      expect(schema.author.name).toBe('Chef Jean-Paul Laurent');
      expect(schema.publisher.name).toBe('RARE NUTS');
    });
  });

  describe('FAQSchema Structured Data', () => {
    it('should generate valid FAQPage JSON-LD', () => {
      const faqs = [
        { question: 'What makes RARE NUTS almonds special?', answer: 'Extra Large Nonpareil from 36th parallel.' },
        { question: 'Do you ship to Mumbai?', answer: 'Yes, next-day delivery available.' },
      ];

      const { container } = render(<FAQSchema items={faqs} />);
      const script = container.querySelector('script[type="application/ld+json"]');
      const schema = JSON.parse(script!.textContent || '{}');
      expect(schema['@type']).toBe('FAQPage');
      expect(schema.mainEntity.length).toBe(2);
      expect(schema.mainEntity[0].name).toBe('What makes RARE NUTS almonds special?');
      expect(schema.mainEntity[0].acceptedAnswer.text).toBe('Extra Large Nonpareil from 36th parallel.');
    });
  });

  describe('WebSiteSchema Graph', () => {
    it('should render WebSite and Organization schema graph with SearchAction', () => {
      const { container } = render(<WebSiteSchema />);
      const script = container.querySelector('script[type="application/ld+json"]');
      const schema = JSON.parse(script!.textContent || '{}');
      expect(schema['@graph']).toBeDefined();
      const website = schema['@graph'].find((item: any) => item['@type'] === 'WebSite');
      const org = schema['@graph'].find((item: any) => item['@type'] === 'Organization');
      expect(website).toBeDefined();
      expect(website.potentialAction['@type']).toBe('SearchAction');
      expect(org).toBeDefined();
      expect(org.name).toBe('RARE NUTS');
    });
  });

  describe('Robots.txt Directives', () => {
    it('should allow public storefront routes and disallow sensitive/private paths', () => {
      const robotsConfig = robots();
      expect(robotsConfig.rules).toBeDefined();

      const rule = Array.isArray(robotsConfig.rules) ? robotsConfig.rules[0] : robotsConfig.rules;
      const allowList = rule.allow as string[];
      const disallowList = rule.disallow as string[];

      // Verify public indexable routes are allowed
      expect(allowList).toContain('/');
      expect(allowList).toContain('/shop');
      expect(allowList).toContain('/journal');
      expect(allowList).toContain('/about');
      expect(allowList).toContain('/faq');
      expect(allowList).toContain('/corporate-gifts');

      // Verify private/authenticated routes are strictly disallowed
      expect(disallowList).toContain('/admin/');
      expect(disallowList).toContain('/cart');
      expect(disallowList).toContain('/checkout');
      expect(disallowList).toContain('/account/');
      expect(disallowList).toContain('/login');
      expect(disallowList).toContain('/register');
      expect(disallowList).toContain('/forgot-password');
      expect(disallowList).toContain('/reset-password');
      expect(disallowList).toContain('/api/');

      // Verify sitemap declarations
      expect(robotsConfig.sitemap).toBeDefined();
    });
  });
});
