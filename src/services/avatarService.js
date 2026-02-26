// Avatar generation service
// Converts a real photo into a Notion-style cartoon avatar using OpenAI gpt-image-1.

const AVATAR_STYLE_PROMPT =
  "Convert the first image (the photo) into the illustration style shown in the second image (the style reference). " +
  "Preserve the person's facial features and likeness. " +
  "Output: minimalist black-and-white vector portrait, flat design, clean bold outlines, no shading, plain white background.";

// Public CORS proxy used as a fallback for cross-origin image fetches
const CORS_PROXY = 'https://corsproxy.io/?url=';

// Fetches a URL and returns a Blob.
// For external URLs, tries direct fetch first; falls back to CORS proxy if blocked.
const fetchImageAsBlob = async (url) => {
  // Same-origin URLs (e.g. /notion-style.png) don't need a proxy
  if (url.startsWith('/')) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.blob();
  }

  // Try direct fetch first
  try {
    const res = await fetch(url);
    if (res.ok) return await res.blob();
  } catch {
    // CORS or network error — fall through to proxy
  }

  // Fall back to CORS proxy
  try {
    const res = await fetch(CORS_PROXY + encodeURIComponent(url));
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.blob();
  } catch (err) {
    throw new Error(`Photo is not publicly accessible (${err.message}). Using default avatar instead.`);
  }
};

/**
 * Generates a Notion-style cartoon avatar from a photo URL.
 * @param {string} photoUrl - URL of the advisor's profile photo
 * @returns {Promise<string>} base64 data URL of the generated avatar (data:image/png;base64,...)
 */
export const generateCartoonAvatar = async (photoUrl) => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) throw new Error('OpenAI API key not configured');

  // Fetch the source photo and the Notion-style reference image in parallel
  const [photoBlob, styleBlob] = await Promise.all([
    fetchImageAsBlob(photoUrl),
    fetchImageAsBlob('/notion-style.png'),
  ]);

  const formData = new FormData();
  // First image = content (the real photo), second = style reference
  formData.append('image[]', photoBlob, 'photo.jpg');
  formData.append('image[]', styleBlob, 'notion-style.png');
  formData.append('prompt', AVATAR_STYLE_PROMPT);
  formData.append('model', 'gpt-image-1');
  formData.append('n', '1');
  formData.append('size', '1024x1024');
  formData.append('quality', 'medium');

  const response = await fetch('https://api.openai.com/v1/images/edits', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Avatar generation failed (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const base64 = data.data[0].b64_json;
  return `data:image/png;base64,${base64}`;
};
