import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  schema?: Record<string, unknown> | Array<Record<string, unknown>>;
  keywords?: string;
  noindex?: boolean;
}

const DEFAULT_TITLE = 'Beautiva - Premium Salon & Beauty Services at Home';
const DEFAULT_DESCRIPTION =
  'Beautiva offers doorstep salon, luxury facial, skincare, hair styling, bridal makeup, and certified beauty school courses across Lucknow, Patna, and beyond.';
const DEFAULT_IMAGE = '/images/beautiva_hero_luxury_1792923326581.jpg';
const BASE_URL = 'https://beautiva.in';

export const SEO: React.FC<SEOProps> = ({
  title,
  description = DEFAULT_DESCRIPTION,
  canonical,
  image = DEFAULT_IMAGE,
  type = 'website',
  schema,
  keywords,
  noindex = false,
}) => {
  const location = useLocation();

  useEffect(() => {
    // 1. Page Title
    const formattedTitle = title
      ? `${title} | Beautiva`
      : DEFAULT_TITLE;
    document.title = formattedTitle;

    // Helper to safely set or create meta tag
    const setMetaTag = (selector: string, attr: string, value: string) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        if (selector.startsWith('meta[name=')) {
          const name = selector.match(/name="([^"]+)"/)?.[1];
          if (name) element.setAttribute('name', name);
        } else if (selector.startsWith('meta[property=')) {
          const prop = selector.match(/property="([^"]+)"/)?.[1];
          if (prop) element.setAttribute('property', prop);
        }
        document.head.appendChild(element);
      }
      element.setAttribute(attr, value);
    };

    // 2. Standard Meta Tags
    setMetaTag('meta[name="description"]', 'content', description);
    if (keywords) {
      setMetaTag('meta[name="keywords"]', 'content', keywords);
    }
    setMetaTag('meta[name="robots"]', 'content', noindex ? 'noindex, nofollow' : 'index, follow');

    // 3. Canonical Link
    const currentUrl = canonical || `${BASE_URL}${location.pathname}${location.search}`;
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', currentUrl);

    // 4. OpenGraph Tags
    const fullImageUrl = image.startsWith('http') ? image : `${BASE_URL}${image}`;
    setMetaTag('meta[property="og:title"]', 'content', formattedTitle);
    setMetaTag('meta[property="og:description"]', 'content', description);
    setMetaTag('meta[property="og:url"]', 'content', currentUrl);
    setMetaTag('meta[property="og:type"]', 'content', type);
    setMetaTag('meta[property="og:image"]', 'content', fullImageUrl);

    // 5. Twitter Card Tags
    setMetaTag('meta[name="twitter:card"]', 'content', 'summary_large_image');
    setMetaTag('meta[name="twitter:title"]', 'content', formattedTitle);
    setMetaTag('meta[name="twitter:description"]', 'content', description);
    setMetaTag('meta[name="twitter:image"]', 'content', fullImageUrl);

    // 6. Dynamic JSON-LD Structured Data
    const scriptId = 'page-schema-jsonld';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (schema) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = scriptId;
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(
        Array.isArray(schema)
          ? { '@context': 'https://schema.org', '@graph': schema }
          : { '@context': 'https://schema.org', ...schema }
      );
    } else if (scriptTag) {
      scriptTag.remove();
    }

    return () => {
      // Clean up page-specific schema on unmount
      const sTag = document.getElementById(scriptId);
      if (sTag) sTag.remove();
    };
  }, [title, description, canonical, image, type, schema, keywords, noindex, location]);

  return null;
};
