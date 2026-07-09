const LEGACY_STORAGE_HOST = "dev-storage.prettyfull.shop";

/**
 * Returns the correct URL for a media asset.
 * Appends ?view=1 only for legacy Garage S3 URLs that require it.
 */
export const getMediaUrl = (url?: string | null): string | undefined => {
  if (!url) return undefined;
  if (url.includes(LEGACY_STORAGE_HOST) && !url.includes("?")) {
    return `${url}`;
  }
  return url;
};
