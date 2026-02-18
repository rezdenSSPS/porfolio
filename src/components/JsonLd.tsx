import { useEffect } from 'react';
import {
  organizationData,
  personData,
  websiteData,
  SITE_URL,
} from '@/lib/schema';

export function JsonLd() {
  useEffect(() => {
    const schemas = [
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        ...organizationData,
        address: organizationData.address ? {
          '@type': 'PostalAddress',
          addressLocality: organizationData.address.locality,
          addressCountry: organizationData.address.country,
        } : undefined,
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Person',
        ...personData,
        address: personData.address ? {
          '@type': 'PostalAddress',
          addressLocality: personData.address.locality,
          addressCountry: personData.address.country,
        } : undefined,
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        ...websiteData,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${SITE_URL}/projects`,
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        name: 'Tvorba Webových Stránek',
        description: 'Profesionální tvorba webových stránek a aplikací na míru',
        provider: {
          '@type': 'Person',
          name: 'Denis Řezníček',
        },
        url: SITE_URL,
        areaServed: {
          '@type': 'Country',
          name: 'Czech Republic',
        },
      },
    ];

    const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
    existingScripts.forEach(script => script.remove());

    schemas.forEach(schema => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    });

    return () => {
      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      scripts.forEach(script => script.remove());
    };
  }, []);

  return null;
}
