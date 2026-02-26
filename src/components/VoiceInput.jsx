import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Square, Mic, AlertTriangle } from 'lucide-react';
import { transcribeAudio } from '../services/voiceService';
import { useLanguage } from '../contexts/LanguageContext';

const COUNTDOWN_SEC = 45;
// How many consecutive silent checks (each 400ms) before showing warning
const SILENT_THRESHOLD = 8; // ~3.2 seconds

export const VoiceInput = ({ onTranscribed, onError }) => {
  const [phase, setPhase] = useState('recording'); // 'recording' | 'transcribing'
  const [countdown, setCountdown] = useState(COUNTDOWN_SEC);
  const [audioLevel, setAudioLevel] = useState(0); // 0–1, for visual meter
  const [micWarning, setMicWarning] = useState(false);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const stoppedRef = useRef(false);
  const audioContextRef = useRef(null);
  const levelIntervalRef = useRef(null);
  const silentCountRef = useRef(0);
  const pausedRef = useRef(false); // countdown paused while mic warning is active

  const { t } = useLanguage();

  const stopRecording = useCallback(() => {
    if (stoppedRef.current) return;
    stoppedRef.current = true;
    clearInterval(timerRef.current);
    clearInterval(levelIntervalRef.current);
    audioContextRef.current?.close();
    const mr = mediaRecorderRef.current;
    if (mr && mr.state !== 'inactive') mr.stop();
    mr?.stream?.getTracks().forEach(track => track.stop());
    setPhase('transcribing');
  }, []);

  // Start AnalyserNode to monitor live audio levels
  const startLevelMonitoring = useCallback((stream) => {
    try {
      const ctx = new AudioContext();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      ctx.createMediaStreamSource(stream).connect(analyser);
      audioContextRef.current = ctx;

      const data = new Uint8Array(analyser.frequencyBinCount);
      levelIntervalRef.current = setInterval(() => {
        analyser.getByteFrequencyData(data);
        const avg = data.reduce((a, b) => a + b, 0) / data.length;
        const level = Math.min(avg / 40, 1); // normalize: 40 ≈ typical speech
        setAudioLevel(level);

        if (level < 0.03) {
          silentCountRef.current += 1;
          if (silentCountRef.current >= SILENT_THRESHOLD) {
            setMicWarning(true);
            pausedRef.current = true; // pause countdown while mic is silent
          }
        } else {
          silentCountRef.current = 0;
          setMicWarning(false);
          pausedRef.current = false; // resume countdown when audio detected
        }
      }, 400);
    } catch {
      // AudioContext not supported — skip monitoring, no-op
    }
  }, []);

  useEffect(() => {
    let mr;
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        chunksRef.current = [];
        mr = new MediaRecorder(stream);
        mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
        mr.onstop = async () => {
          const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
          const audioUrl = URL.createObjectURL(blob);
          try {
            const text = await transcribeAudio(blob);
            onTranscribed(text, audioUrl);
          } catch (err) {
            URL.revokeObjectURL(audioUrl);
            onError?.(err.message);
          }
        };
        mr.start();
        mediaRecorderRef.current = mr;
        startLevelMonitoring(stream);
      })
      .catch(err => onError?.(err.message));

    timerRef.current = setInterval(() => {
      if (pausedRef.current) return; // skip tick while mic warning is active
      setCountdown(prev => {
        if (prev <= 1) { stopRecording(); return 0; }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timerRef.current);
      clearInterval(levelIntervalRef.current);
      audioContextRef.current?.close();
      if (mr && mr.state !== 'inactive') mr.stop();
      mr?.stream?.getTracks().forEach(track => track.stop());
    };
  }, []); // run once on mount

  const progress = (countdown / COUNTDOWN_SEC) * 100;

  if (phase === 'transcribing') {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center gap-3 text-gray-500 text-sm">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
          {t('voice.transcribing')}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
      <div className="flex gap-3 items-center">
        {/* Mic icon — pulses red, dims when silent warning */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border transition-colors ${
          micWarning
            ? 'bg-amber-50 border-amber-300'
            : 'bg-red-50 border-red-200'
        }`}>
          <Mic className={`w-5 h-5 animate-pulse ${micWarning ? 'text-amber-500' : 'text-red-500'}`} />
        </div>

        {/* Center: countdown bar + live level meter */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between text-xs text-gray-500 mb-1.5">
            <span>{t('voice.recording')}</span>
            <span className="font-mono tabular-nums">{countdown}s</span>
          </div>
          {/* Countdown bar */}
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-1.5">
            <div
              className="h-full bg-red-400 rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
          {/* Live audio level bar */}
          <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-100 ${micWarning ? 'bg-amber-300' : 'bg-green-400'}`}
              style={{ width: `${audioLevel * 100}%` }}
            />
          </div>
        </div>

        {/* Done button */}
        <button
          onClick={stopRecording}
          className="flex-shrink-0 bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Square className="w-3.5 h-3.5 fill-current" />
          {t('voice.done')}
        </button>
      </div>

      {/* Mic warning — shown after ~3s of silence */}
      {micWarning ? (
        <div className="mt-3 flex items-center gap-2 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
          {t('voice.micWarning')}
        </div>
      ) : (
        <p className="text-gray-400 text-xs mt-3">{t('voice.hint')}</p>
      )}
    </div>
  );
};
