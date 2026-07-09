const LEGACY_STORAGE_HOST = "dev-storage.prettyfull.shop";

export const getMediaUrl = (url?: string | null): string | undefined => {
  if (!url) return undefined;
  if (url.includes(LEGACY_STORAGE_HOST) && !url.includes("?")) {
    return `${url}?view=1`;
  }
  return url;
};
