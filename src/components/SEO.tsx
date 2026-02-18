import { useEffect } from 'react';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'profile';
  noindex?: boolean;
}

const SITE_NAME = 'Denis Řezníček Portfolio';
const DEFAULT_TITLE = 'Denis Řezníček | Web Designer & Developer';
const DEFAULT_DESCRIPTION = 'Profesionální tvorba moderních webových stránek a aplikací na míru. React, Next.js, TypeScript. Pomáhám firmám růst v digitálním světě.';
const DEFAULT_KEYWORDS = 'web designer, web developer, tvorba webových stránek, React, Next.js, TypeScript, Praha';
const DEFAULT_OG_IMAGE = '/logo-dark.png';
const SITE_URL = 'https://www.reznicek.xyz';

export function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  noindex = false,
}: SEOProps) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
    const canonicalUrl = canonical || `${SITE_URL}${window.location.pathname}`;
    const fullOgImage = ogImage.startsWith('http') ? ogImage : `${SITE_URL}${ogImage}`;

    document.title = fullTitle;

    const updateMeta = (name: string, content: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        if (isProperty) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    updateMeta('description', description);
    updateMeta('keywords', keywords);
    updateMeta('robots', noindex ? 'noindex, nofollow' : 'index, follow');
    
    updateMeta('og:title', fullTitle, true);
    updateMeta('og:description', description, true);
    updateMeta('og:image', fullOgImage, true);
    updateMeta('og:url', canonicalUrl, true);
    updateMeta('og:type', ogType, true);
    
    updateMeta('twitter:title', fullTitle);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', fullOgImage);

    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [title, description, keywords, canonical, ogImage, ogType, noindex]);

  return null;
}
