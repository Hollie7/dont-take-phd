// Vercel Serverless Function — Text-to-Speech via OpenAI TTS API.
// Returns raw MP3 audio so the browser can play it directly.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'OpenAI API key not configured' });
  }

  const { text, voice = 'shimmer', speed = 1.1 } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'text is required' });
  }

  try {
    const upstream = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model: 'tts-1', input: text, voice, speed }),
    });

    if (!upstream.ok) {
      const data = await upstream.json();
      return res.status(upstream.status).json(data);
    }

    const buffer = Buffer.from(await upstream.arrayBuffer());
    res.setHeader('Content-Type', 'audio/mpeg');
    res.statusCode = 200;
    res.end(buffer);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
