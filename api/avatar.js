// Vercel Serverless Function — generates a cartoon avatar via OpenAI image edits API.
// Accepts base64-encoded images in JSON to avoid exposing the API key in the browser.

const AVATAR_STYLE_PROMPT =
  "Convert the first image (the photo) into the illustration style shown in the second image (the style reference). " +
  "Preserve the person's facial features and likeness. " +
  "Output: minimalist black-and-white vector portrait, flat design, clean bold outlines, no shading, plain white background.";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'OpenAI API key not configured' });
  }

  const { photoUrl, styleBase64, styleMimeType } = req.body;

  // Fetch the external photo server-side to bypass browser CORS restrictions
  const photoRes = await fetch(photoUrl);
  if (!photoRes.ok) {
    return res.status(502).json({ error: `Failed to fetch photo: HTTP ${photoRes.status}` });
  }
  const photoBuffer = Buffer.from(await photoRes.arrayBuffer());
  const photoMimeType = photoRes.headers.get('content-type') || 'image/jpeg';

  const styleBuffer = Buffer.from(styleBase64, 'base64');

  const formData = new FormData();
  formData.append('image[]', new Blob([photoBuffer], { type: photoMimeType || 'image/jpeg' }), 'photo.jpg');
  formData.append('image[]', new Blob([styleBuffer], { type: styleMimeType || 'image/png' }), 'notion-style.png');
  formData.append('prompt', AVATAR_STYLE_PROMPT);
  formData.append('model', 'gpt-image-1');
  formData.append('n', '1');
  formData.append('size', '1024x1024');
  formData.append('quality', 'medium');

  try {
    const upstream = await fetch('https://api.openai.com/v1/images/edits', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
      body: formData,
    });

    const data = await upstream.json();

    if (!upstream.ok) {
      return res.status(upstream.status).json(data);
    }

    return res.status(200).json({ b64_json: data.data[0].b64_json });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
