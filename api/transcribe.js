// Vercel Serverless Function — Speech-to-Text via OpenAI Whisper API.
// Accepts base64-encoded audio in JSON (avoids multipart parsing complexity).

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'OpenAI API key not configured' });
  }

  const { audioBase64, mimeType = 'audio/webm' } = req.body;

  if (!audioBase64) {
    return res.status(400).json({ error: 'audioBase64 is required' });
  }

  try {
    const audioBuffer = Buffer.from(audioBase64, 'base64');

    const formData = new FormData();
    formData.append('file', new Blob([audioBuffer], { type: mimeType }), 'audio.webm');
    formData.append('model', 'whisper-1');

    const upstream = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
      body: formData,
    });

    const data = await upstream.json();

    if (!upstream.ok) {
      return res.status(upstream.status).json(data);
    }

    return res.status(200).json({ text: data.text });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
