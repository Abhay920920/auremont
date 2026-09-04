import React from 'react';

export default function JsonLd({ data }: { data: Record<string, unknown> | Array<unknown> }) {
  const jsonString = JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e');
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonString }}
    />
  );
}
