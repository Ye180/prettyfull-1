// src/shared/lib/lang.ts
export const getLang = () => {
  if (typeof window === "undefined") return "fr";
  return navigator.language?.split("-")[0] || "fr";
};
