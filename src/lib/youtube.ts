const YOUTUBE_EMBED_RE = /^https:\/\/www\.youtube\.com\/embed\/([\w-]{11})$/;

/**
 * Extracts the YouTube video ID from a valid embed URL.
 * Returns null if the URL does not match the expected pattern.
 */
export function extractYoutubeId(url: string): string | null {
  return YOUTUBE_EMBED_RE.exec(url)?.[1] ?? null;
}

/**
 * Returns true only for well-formed YouTube embed URLs.
 */
export function isValidYoutubeEmbedUrl(url: string): boolean {
  return YOUTUBE_EMBED_RE.test(url);
}
