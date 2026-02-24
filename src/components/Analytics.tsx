import { useEffect } from 'react';

const ANALYTICS_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

export function Analytics() {
  useEffect(() => {
    if (!ANALYTICS_ID) return;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    }
    gtag('js', new Date());
    gtag('config', ANALYTICS_ID);

    return () => {
      window.dataLayer = window.dataLayer.filter((d: unknown) => d !== 'config');
    };
  }, []);

  return null;
}

declare global {
  interface Window {
    dataLayer: unknown[];
  }
}
