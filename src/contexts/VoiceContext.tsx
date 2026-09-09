import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAccessibility } from './AccessibilityContext';
import { sanitizeTextForSpeech } from '../services/speechSanitizer';
import { getBrowserVoiceLangTag, getVoiceProfileById } from '../services/voiceRegistry';

interface VoiceContextType {
  isSpeaking: boolean;
  isListening: boolean;
  transcript: string;
  speak: (text: string) => void;
  stopSpeaking: () => void;
  startListening: (onResult?: (text: string) => void) => void;
  stopListening: () => void;
  hasSpeechSupport: boolean;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export const VoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings } = useAccessibility();
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [hasSpeechSupport, setHasSpeechSupport] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setHasSpeechSupport(true);
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  const speakWithBrowser = useCallback((cleanText: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const voiceSettings = settings.voiceSettings;
    
    utterance.rate = voiceSettings?.speechSpeed || settings.speechSpeed || 0.85;
    utterance.pitch = voiceSettings?.voiceGender === 'FEMALE' ? 1.05 : 0.95;
    utterance.volume = voiceSettings?.speechVolume || 1.0;

    // Pick best browser language tag for the patient's language
    const langTag = getBrowserVoiceLangTag(settings.language || 'en');
    utterance.lang = langTag;

    // Try finding matching Indian voice if available
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(v => 
      v.lang.toLowerCase().startsWith(langTag.toLowerCase()) || 
      (v.lang.includes('IN') && (voiceSettings?.voiceGender === 'FEMALE' ? v.name.includes('Female') || v.name.includes('Zira') : true))
    );
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [settings]);

  const speak = useCallback(async (text: string) => {
    if (!settings.voiceEnabled || !text) return;

    // CRITICAL: ALWAYS sanitize text before speech synthesis. Emojis must NEVER be spoken aloud!
    const cleanText = sanitizeTextForSpeech(text);
    if (!cleanText) return;

    stopSpeaking();

    // Check if ElevenLabs is explicitly enabled in voice settings
    const voiceSettings = settings.voiceSettings;
    if (voiceSettings?.useElevenLabs) {
      try {
        const profile = getVoiceProfileById(voiceSettings.voiceProfileId);
        const res = await fetch('/api/voice/synthesize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: cleanText,
            voiceProfileId: profile.id,
            elevenLabsVoiceId: profile.elevenLabsVoiceId,
            language: settings.language
          })
        });

        if (res.ok) {
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          if (!audioRef.current) {
            audioRef.current = new Audio();
          }
          audioRef.current.src = url;
          audioRef.current.onplay = () => setIsSpeaking(true);
          audioRef.current.onended = () => {
            setIsSpeaking(false);
            URL.revokeObjectURL(url);
          };
          audioRef.current.onerror = () => {
            // Fallback to browser if audio fails
            speakWithBrowser(cleanText);
          };
          await audioRef.current.play();
          return;
        }
      } catch {
        // Graceful fallback to browser speech synthesis if backend/ElevenLabs is unavailable
      }
    }

    // Default: Browser Speech Synthesis with Indian accent and speed adjustment
    speakWithBrowser(cleanText);
  }, [settings, stopSpeaking, speakWithBrowser]);

  const startListening = useCallback((onResult?: (text: string) => void) => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Touch buttons are always available!");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = getBrowserVoiceLangTag(settings.language || 'en');

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('');
      };

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const text = event.results[current][0].transcript;
        setTranscript(text);
        if (event.results[current].isFinal && onResult) {
          onResult(text);
        }
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch {
      setIsListening(false);
    }
  }, [settings]);

  const stopListening = useCallback(() => {
    setIsListening(false);
  }, []);

  return (
    <VoiceContext.Provider value={{
      isSpeaking,
      isListening,
      transcript,
      speak,
      stopSpeaking,
      startListening,
      stopListening,
      hasSpeechSupport
    }}>
      {children}
    </VoiceContext.Provider>
  );
};

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return context;
};
