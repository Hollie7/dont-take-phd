// Voice service — TTS and STT utilities for the voice conversation mode.

const VOICE_MAP = { male: 'onyx', female: 'shimmer' };
const SPEED = 1.1;

export const getVoiceForGender = (gender) => VOICE_MAP[gender] || 'shimmer';

// Calls /api/speak and returns an object URL for the audio blob
export const speakText = async (text, gender) => {
  const res = await fetch('/api/speak', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, voice: getVoiceForGender(gender), speed: SPEED }),
  });
  if (!res.ok) throw new Error(`TTS error: ${res.status}`);
  const blob = await res.blob();
  return URL.createObjectURL(blob);
};

// Converts an audio Blob to base64 and sends to /api/transcribe
export const transcribeAudio = async (audioBlob) => {
  const arrayBuffer = await audioBlob.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  // Convert in chunks to avoid stack overflow on large audio
  let binary = '';
  for (let i = 0; i < bytes.length; i += 8192) {
    binary += String.fromCharCode(...bytes.slice(i, Math.min(i + 8192, bytes.length)));
  }
  const audioBase64 = btoa(binary);

  const res = await fetch('/api/transcribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ audioBase64, mimeType: audioBlob.type || 'audio/webm' }),
  });
  if (!res.ok) throw new Error(`Transcription error: ${res.status}`);
  const data = await res.json();
  return data.text;
};
