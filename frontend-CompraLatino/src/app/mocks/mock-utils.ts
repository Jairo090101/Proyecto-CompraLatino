/** Builds an optimized Unsplash URL for mock images. */
export const unsplash = (photoId: string, width = 800): string =>
  `https://images.unsplash.com/photo-${photoId}?w=${width}&q=70&auto=format&fit=crop`;
