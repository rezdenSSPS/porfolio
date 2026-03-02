import { useState, useRef, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  fallback?: string;
  sizes?: string;
}

// Helper to optimize Cloudinary URLs
function getOptimizedCloudinaryUrl(url: string, width: number): string {
  if (!url || !url.includes('cloudinary.com')) return url;
  
  // Insert transformation parameters after /upload/
  return url.replace(
    '/upload/',
    `/upload/f_auto,q_auto,w_${width}/`
  );
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
  onLoad,
  fallback = 'https://via.placeholder.com/800x500?text=No+Image',
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(loading === 'eager');
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (loading === 'eager') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' } // Increased for earlier loading
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [loading]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
  };

  // Generate responsive srcSet for Cloudinary images
  const isCloudinary = src?.includes('cloudinary.com');
  const srcSet = isCloudinary && !hasError
    ? `${getOptimizedCloudinaryUrl(src, 400)} 400w, ${getOptimizedCloudinaryUrl(src, 800)} 800w, ${getOptimizedCloudinaryUrl(src, 1200)} 1200w`
    : undefined;

  const optimizedSrc = isCloudinary && !hasError
    ? getOptimizedCloudinaryUrl(src, width || 800)
    : src;

  return (
    <img
      ref={imgRef}
      src={isInView ? (hasError ? fallback : optimizedSrc) : undefined}
      srcSet={isInView && srcSet ? srcSet : undefined}
      sizes={isInView && srcSet ? sizes : undefined}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      decoding="async"
      fetchPriority={loading === 'eager' ? 'high' : 'auto'}
      onLoad={handleLoad}
      onError={handleError}
      className={`${className} ${!isLoaded && !hasError ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
      style={{
        aspectRatio: width && height ? `${width}/${height}` : undefined,
        contentVisibility: 'auto',
      }}
    />
  );
}
