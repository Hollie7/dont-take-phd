// Vercel Serverless Function — proxies AI API calls server-side so keys are never exposed to the browser.
// API keys are read from server environment variables (set in Vercel dashboard).

const OPENAI_COUNTRIES = ['US', 'JP', 'KR', 'IN', 'SG'];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Vercel automatically sets x-vercel-ip-country on every request
  const country = req.headers['x-vercel-ip-country'] || '';
  const useOpenAI = OPENAI_COUNTRIES.includes(country);

  const endpoint = useOpenAI
    ? 'https://api.openai.com/v1/chat/completions'
    : 'https://api.deepseek.com/v1/chat/completions';
  const apiKey = useOpenAI
    ? process.env.OPENAI_API_KEY
    : process.env.DEEPSEEK_API_KEY;
  const model = useOpenAI ? 'gpt-4o-mini' : 'deepseek-chat';

  const { messages, temperature = 0.7, max_tokens = 1000, response_format } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured on server' });
  }

  try {
    const upstream = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model, messages, temperature, max_tokens, response_format }),
    });

    const data = await upstream.json();
    return res.status(upstream.status).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
