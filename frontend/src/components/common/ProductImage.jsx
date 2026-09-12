import React, { useState } from 'react';

const FALLBACK_BY_CATEGORY = {
  'Fertilizers': '/images/products/fallback_fertilizer.svg',
  'Pesticides': '/images/products/fallback_pesticide.svg',
  'Seeds': '/images/products/fallback_seed.svg',
  'Farming Equipment': '/images/products/fallback_equipment.svg',
  'Equipment': '/images/products/fallback_equipment.svg'
};

const DEFAULT_FALLBACK = '/images/products/fallback_pesticide.svg';

export default function ProductImage({
  src,
  alt = 'Agricultural Product',
  className = 'w-full h-full object-cover',
  category = '',
  loading = 'lazy',
  ...props
}) {
  const [currentSrc, setCurrentSrc] = useState(src || getFallback(category));
  const [hasError, setHasError] = useState(false);

  // Sync if src prop changes
  React.useEffect(() => {
    if (src) {
      setCurrentSrc(src);
      setHasError(false);
    }
  }, [src]);

  function getFallback(cat) {
    if (!cat) return DEFAULT_FALLBACK;
    return FALLBACK_BY_CATEGORY[cat] || DEFAULT_FALLBACK;
  }

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      const fallback = getFallback(category);
      // Avoid infinite loop if fallback itself fails
      if (currentSrc !== fallback) {
        setCurrentSrc(fallback);
      }
    }
  };

  return (
    <img
      src={currentSrc || getFallback(category)}
      alt={alt}
      className={className}
      loading={loading}
      onError={handleError}
      {...props}
    />
  );
}
