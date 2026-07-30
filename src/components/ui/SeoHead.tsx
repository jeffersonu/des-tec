import React, { useEffect } from 'react';

interface SeoProps {
  title: string;
  description: string;
  canonicalPath?: string;
  keywords?: string[];
  ogImage?: string;
  schemaJson?: object;
}

export default function SeoHead({
  title,
  description,
  canonicalPath = '',
  keywords = [
    'Des-Tec',
    'desarrollo web colombia',
    'desarrollo de software bogota',
    'automatizacion n8n',
    'chatbots whatsapp api',
    'sistemas CRM a medida',
    'desarrollo react nodejs',
    'agencia de software colombia',
    'integracion de inteligencia artificial',
    'desarrollo saas'
  ],
  ogImage = 'https://des-tec.co/logo.jpg',
  schemaJson,
}: SeoProps) {
  useEffect(() => {
    // 1. Format document title cleanly
    const fullTitle = title.includes('Des-Tec') 
      ? title 
      : `${title} | Des-Tec - Desarrollo Web, Automatización & CRM`;
    document.title = fullTitle;

    // 2. Helper to set meta tag
    const setMetaTag = (selector: string, attrName: string, attrValue: string, content: string) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Meta Description & Author
    setMetaTag('meta[name="description"]', 'name', 'description', description);
    setMetaTag('meta[name="author"]', 'name', 'author', 'Des-Tec - Desarrollo y Tecnología');
    setMetaTag('meta[name="keywords"]', 'name', 'keywords', keywords.join(', '));
    setMetaTag('meta[name="robots"]', 'name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    setMetaTag('meta[name="googlebot"]', 'name', 'googlebot', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');

    // OpenGraph Tags
    const fullCanonicalUrl = `https://des-tec.co${canonicalPath}`;
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', fullTitle);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', ogImage);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', 'website');
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', fullCanonicalUrl);
    setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', 'Des-Tec');
    setMetaTag('meta[property="og:locale"]', 'property', 'og:locale', 'es_CO');

    // Twitter Card Tags
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', ogImage);

    // 3. Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', fullCanonicalUrl);

    // 4. Schema.org JSON-LD Structured Data
    const defaultSchema = {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: 'Des-Tec',
      url: fullCanonicalUrl,
      description,
      logo: 'https://des-tec.co/logo.jpg',
      image: ogImage,
      telephone: '+573192078407',
      email: 'informacion.destec@gmail.com',
      priceRange: '$$$',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Bogotá',
        addressRegion: 'Bogotá D.C.',
        addressCountry: 'CO'
      },
      areaServed: ['Colombia', 'España', 'United States', 'Mexico', 'América Latina'],
      knowsAbout: [
        'Desarrollo de Software A Medida',
        'Desarrollo Web React y Node.js',
        'Automatización de Procesos con n8n',
        'Chatbots de WhatsApp Business API',
        'Sistemas CRM Personalizados',
        'Integración de Inteligencia Artificial'
      ]
    };

    let schemaScript = document.querySelector('#seo-schema-jsonld');
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.setAttribute('id', 'seo-schema-jsonld');
      schemaScript.setAttribute('type', 'application/ld+json');
      document.head.appendChild(schemaScript);
    }
    schemaScript.textContent = JSON.stringify(schemaJson || defaultSchema);
  }, [title, description, canonicalPath, keywords, ogImage, schemaJson]);

  return null;
}

