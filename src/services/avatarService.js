// Avatar generation service
// Converts a real photo into a Notion-style cartoon avatar via /api/avatar (serverless).
// The external photo URL is fetched server-side to avoid CORS restrictions.

// Fetches a local URL and returns a Blob (only used for local assets like /notion-style.png)
const fetchLocalBlob = async (url) => {
  const res = await fetch(url);
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
  // Only fetch the local style image in the browser; external photo is fetched server-side
  const styleBlob = await fetchLocalBlob('/notion-style.png');
  const styleBase64 = await blobToBase64(styleBlob);

  const response = await fetch('/api/avatar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      photoUrl,
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
