// Avatar generation service
// Converts a real photo into a Notion-style cartoon avatar via /api/avatar (serverless).
// Images are sent as base64 JSON so the OpenAI key never reaches the browser.

// Public CORS proxy used as a fallback for cross-origin image fetches
const CORS_PROXY = 'https://corsproxy.io/?url=';

// Fetches a URL and returns a Blob.
// For external URLs, tries direct fetch first; falls back to CORS proxy if blocked.
const fetchImageAsBlob = async (url) => {
  if (url.startsWith('/')) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.blob();
  }

  try {
    const res = await fetch(url);
    if (res.ok) return res.blob();
  } catch {
    // CORS or network error — fall through to proxy
  }

  const res = await fetch(CORS_PROXY + encodeURIComponent(url));
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.blob();
};

// Converts a Blob to a base64 string (without the data URL prefix)
const blobToBase64 = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

/**
 * Generates a Notion-style cartoon avatar from a photo URL.
 * @param {string} photoUrl - URL of the advisor's profile photo
 * @returns {Promise<string>} base64 data URL of the generated avatar (data:image/png;base64,...)
 */
export const generateCartoonAvatar = async (photoUrl) => {
  // Fetch both images in the browser (no API key needed here)
  const [photoBlob, styleBlob] = await Promise.all([
    fetchImageAsBlob(photoUrl),
    fetchImageAsBlob('/notion-style.png'),
  ]);

  const [photoBase64, styleBase64] = await Promise.all([
    blobToBase64(photoBlob),
    blobToBase64(styleBlob),
  ]);

  const response = await fetch('/api/avatar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      photoBase64,
      photoMimeType: photoBlob.type || 'image/jpeg',
      styleBase64,
      styleMimeType: styleBlob.type || 'image/png',
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Avatar generation failed (${response.status}): ${err}`);
  }

  const data = await response.json();
  return `data:image/png;base64,${data.b64_json}`;
};
