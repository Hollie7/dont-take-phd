// Serverless function — fetches raw HTML of a URL server-side and extracts <img> src values.
// Running server-side avoids browser CORS restrictions on the target page.

export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'url required' });

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; bot/1.0)' },
      redirect: 'follow',
    });

    if (!response.ok) {
      return res.status(200).json({ imgs: [] });
    }

    const html = await response.text();
    const base = new URL(url);

    const imgs = [];
    const imgRegex = /<img[^>]+src=["']([^"'>\s]+)["']/gi;
    let match;
    while ((match = imgRegex.exec(html)) !== null) {
      try {
        const absUrl = new URL(match[1], base).href;
        if (/\.(jpg|jpeg|png|webp|gif)/i.test(absUrl)) {
          imgs.push(absUrl);
        }
      } catch {
        // skip malformed URLs
      }
    }

    return res.status(200).json({ imgs: [...new Set(imgs)] });
  } catch (error) {
    // Return empty list on error so the caller can continue without a photo
    return res.status(200).json({ imgs: [] });
  }
}
