import { isValidYoutubeEmbedUrl } from "./youtube";

export type VideoPlatform = "youtube" | "tiktok";

const TIKTOK_PLAYER_RE = /^https:\/\/www\.tiktok\.com\/player\/v1\/(\d{10,25})$/;

/**
 * Query params applied at render time (the stored URL stays plain).
 * `rel=0` makes TikTok suggest only the current author's videos instead of
 * recommended ones. TikTok has no param to turn suggestions off entirely.
 */
const TIKTOK_PLAYER_PARAMS = "rel=0&description=0&music_info=0&loop=0&autoplay=0";

/**
 * Extracts the TikTok post ID from a valid player URL, or null.
 */
export function extractTikTokId(url: string): string | null {
  return TIKTOK_PLAYER_RE.exec(url)?.[1] ?? null;
}

export function isValidTikTokPlayerUrl(url: string): boolean {
  return TIKTOK_PLAYER_RE.test(url);
}

/**
 * Detects the platform from the stored URL. Returns null for anything that
 * is not a well-formed embed URL of a supported platform.
 */
export function getPlatform(url: string): VideoPlatform | null {
  if (isValidYoutubeEmbedUrl(url)) return "youtube";
  if (isValidTikTokPlayerUrl(url)) return "tiktok";
  return null;
}

export function isValidEmbedUrl(url: string): boolean {
  return getPlatform(url) !== null;
}

/**
 * URL actually loaded in the iframe (stored URL + platform params).
 */
export function getIframeSrc(url: string): string | null {
  switch (getPlatform(url)) {
    case "youtube":
      return `${url}?rel=0`;
    case "tiktok":
      return `${url}?${TIKTOK_PLAYER_PARAMS}`;
    default:
      return null;
  }
}
