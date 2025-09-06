import { logEvent } from "./loggingMiddleware";

let urlMappings = {};

export function createShortUrl({ longUrl, validityMins = 30, preferredShortcode }) {
  if (!/^https?:\/\/.+$/.test(longUrl)) throw new Error("Malformed URL");
  if (typeof validityMins !== "number" || validityMins < 1) throw new Error("Invalid validity minutes");

  let shortcode = preferredShortcode;
  if (shortcode) {
    if (!/^[a-zA-Z0-9]{3,15}$/.test(shortcode)) throw new Error("Shortcode must be alphanumeric and 3-15 characters");
    if (urlMappings[shortcode]) throw new Error("Shortcode collision");
  } else {
    do {
      shortcode = Math.random().toString(36).substring(2, 8);
    } while (urlMappings[shortcode]);
  }

  const expiresAt = Date.now() + validityMins * 60 * 1000;

  urlMappings[shortcode] = {
    longUrl,
    createdAt: Date.now(),
    expiresAt,
    clicks: []
  };

  logEvent("CREATE", { shortcode, longUrl, expiresAt });
  return { shortcode, longUrl, createdAt: urlMappings[shortcode].createdAt, expiresAt };
}

export function getAllShortenedUrls() {
  return Object.entries(urlMappings).map(([shortcode, info]) => ({
    shortcode,
    ...info
  }));
}

export function addClick(shortcode, source, geo) {
  if (urlMappings[shortcode]) {
    urlMappings[shortcode].clicks.push({
      timestamp: new Date().toISOString(),
      source,
      geo
    });
    logEvent("CLICK", { shortcode, source, geo });
  }
}

export function getStats(shortcode) {
  const entry = urlMappings[shortcode];
  if (entry) {
    return {
      totalClicks: entry.clicks.length,
      clickDetails: entry.clicks,
      ...entry
    };
  }
  throw new Error("Shortcode not found");
}

export function getLongUrl(shortcode) {
  const entry = urlMappings[shortcode];
  if (entry && Date.now() < entry.expiresAt) {
    return entry.longUrl;
  }
  return null;
}
