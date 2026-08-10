import JsonLd from "../JsonLd";

export default function WebSiteSchema() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rarenuts.in';

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        "url": siteUrl,
        "name": "RARE NUTS",
        "alternateName": "RARE NUTS Luxury Almonds & Gifting",
        "description": "Purveyors of exceptionally sourced California almonds and bespoke luxury gifting.",
        "publisher": {
          "@type": "Organization",
          "@id": `${siteUrl}/#organization`
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${siteUrl}/shop?q={search_term_string}`
          },
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        "name": "RARE NUTS",
        "legalName": "RARE NUTS Private Limited",
        "url": siteUrl,
        "logo": {
          "@type": "ImageObject",
          "url": `${siteUrl}/images/og-rarenuts.png`,
          "caption": "RARE NUTS Logo"
        },
        "sameAs": [
          "https://instagram.com/rarenuts",
          "https://facebook.com/rarenuts",
          "https://linkedin.com/company/rarenuts"
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "email": "concierge@rarenuts.com",
          "contactType": "customer service",
          "availableLanguage": ["English", "Hindi"]
        }
      }
    ]
  };

  return <JsonLd data={schema} />;
}
