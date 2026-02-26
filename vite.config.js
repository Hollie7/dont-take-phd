import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load all .env vars (no VITE_ prefix filter) so server-side keys are available
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      {
        name: 'local-api',
        configureServer(server) {
          const AVATAR_STYLE_PROMPT =
            "Convert the first image (the photo) into the illustration style shown in the second image (the style reference). " +
            "Preserve the person's facial features and likeness. " +
            "Output: minimalist black-and-white vector portrait, flat design, clean bold outlines, no shading, plain white background."

          server.middlewares.use('/api/avatar', (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Method not allowed' }))
              return
            }

            let raw = ''
            req.on('data', chunk => { raw += chunk.toString() })
            req.on('end', async () => {
              try {
                const { photoUrl, styleBase64, styleMimeType } = JSON.parse(raw)
                const apiKey = env.OPENAI_API_KEY

                // Fetch the external photo server-side to bypass browser CORS restrictions
                const photoRes = await fetch(photoUrl)
                if (!photoRes.ok) {
                  res.statusCode = 502
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify({ error: `Failed to fetch photo: HTTP ${photoRes.status}` }))
                  return
                }
                const photoBuffer = Buffer.from(await photoRes.arrayBuffer())
                const photoMimeType = photoRes.headers.get('content-type') || 'image/jpeg'
                const styleBuffer = Buffer.from(styleBase64, 'base64')

                const formData = new FormData()
                formData.append('image[]', new Blob([photoBuffer], { type: photoMimeType || 'image/jpeg' }), 'photo.jpg')
                formData.append('image[]', new Blob([styleBuffer], { type: styleMimeType || 'image/png' }), 'notion-style.png')
                formData.append('prompt', AVATAR_STYLE_PROMPT)
                formData.append('model', 'gpt-image-1')
                formData.append('n', '1')
                formData.append('size', '1024x1024')
                formData.append('quality', 'medium')

                const upstream = await fetch('https://api.openai.com/v1/images/edits', {
                  method: 'POST',
                  headers: { Authorization: `Bearer ${apiKey}` },
                  body: formData,
                })

                const data = await upstream.json()
                res.statusCode = upstream.status
                res.setHeader('Content-Type', 'application/json')
                if (!upstream.ok) {
                  res.end(JSON.stringify(data))
                  return
                }
                res.end(JSON.stringify({ b64_json: data.data[0].b64_json }))
              } catch (err) {
                res.statusCode = 500
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ error: err.message }))
              }
            })
          })

          server.middlewares.use('/api/speak', (req, res) => {
            let raw = ''
            req.on('data', chunk => { raw += chunk.toString() })
            req.on('end', async () => {
              try {
                const { text, voice = 'shimmer', speed = 1.1 } = JSON.parse(raw)
                const upstream = await fetch('https://api.openai.com/v1/audio/speech', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${env.OPENAI_API_KEY}`,
                  },
                  body: JSON.stringify({ model: 'tts-1', input: text, voice, speed }),
                })
                if (!upstream.ok) {
                  const data = await upstream.json()
                  res.statusCode = upstream.status
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify(data))
                  return
                }
                const buffer = Buffer.from(await upstream.arrayBuffer())
                res.statusCode = 200
                res.setHeader('Content-Type', 'audio/mpeg')
                res.end(buffer)
              } catch (err) {
                res.statusCode = 500
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ error: err.message }))
              }
            })
          })

          server.middlewares.use('/api/transcribe', (req, res) => {
            let raw = ''
            req.on('data', chunk => { raw += chunk.toString() })
            req.on('end', async () => {
              try {
                const { audioBase64, mimeType = 'audio/webm' } = JSON.parse(raw)
                const audioBuffer = Buffer.from(audioBase64, 'base64')
                const formData = new FormData()
                formData.append('file', new Blob([audioBuffer], { type: mimeType }), 'audio.webm')
                formData.append('model', 'whisper-1')
                const upstream = await fetch('https://api.openai.com/v1/audio/transcriptions', {
                  method: 'POST',
                  headers: { Authorization: `Bearer ${env.OPENAI_API_KEY}` },
                  body: formData,
                })
                const data = await upstream.json()
                res.statusCode = upstream.status
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify(upstream.ok ? { text: data.text } : data))
              } catch (err) {
                res.statusCode = 500
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ error: err.message }))
              }
            })
          })

          server.middlewares.use('/api/chat', (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Method not allowed' }))
              return
            }

            let raw = ''
            req.on('data', chunk => { raw += chunk.toString() })
            req.on('end', async () => {
              try {
                const { messages, temperature = 0.7, max_tokens = 1000, response_format } = JSON.parse(raw)

                // Default to DeepSeek locally; fall back to OpenAI if only that key exists
                const useOpenAI = !env.DEEPSEEK_API_KEY && !!env.OPENAI_API_KEY
                const endpoint = useOpenAI
                  ? 'https://api.openai.com/v1/chat/completions'
                  : 'https://api.deepseek.com/v1/chat/completions'
                const apiKey = useOpenAI ? env.OPENAI_API_KEY : env.DEEPSEEK_API_KEY
                const model = useOpenAI ? 'gpt-4o-mini' : 'deepseek-chat'

                const upstream = await fetch(endpoint, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                  },
                  body: JSON.stringify({ model, messages, temperature, max_tokens, response_format }),
                })

                const data = await upstream.json()
                res.statusCode = upstream.status
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify(data))
              } catch (err) {
                res.statusCode = 500
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ error: err.message }))
              }
            })
          })
        }
      }
    ]
  }
})
