import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mic, MicOff, StopCircle, Sparkles, Send, Keyboard } from 'lucide-react';
import { sanitizeTextForSpeech } from '../../services/speechSanitizer';
import { GeminiClient } from '../../services/geminiClient';
import { db } from '../../services/db';

interface ChatMessage {
  id: number;
  sender: 'PATIENT' | 'COMPANION';
  text: string;
  time: string;
}

const LANGUAGES = [
  { code: 'hi-IN', label: 'Hindi', short: 'HI' },
  { code: 'as-IN', label: 'Assamese', short: 'AS' },
  { code: 'bn-IN', label: 'Bengali', short: 'BN' },
  { code: 'ta-IN', label: 'Tamil', short: 'TA' },
  { code: 'en-IN', label: 'English', short: 'EN' },
];

const GREETING = 'Namaste Rita ji! Main aapki saheli hoon. Aap mujhse apne ghar, bachpan ya parivaar ke baare mein kuch bhi keh sakti hain.';

// Auto-detect language from user input text
const detectLanguage = (text: string): string => {
  if (/[\u0900-\u097F]/.test(text)) return 'hi';        // Hindi / Devanagari
  if (/[\u0980-\u09FF]/.test(text)) return 'bn';        // Bengali / Assamese
  if (/[\u0B80-\u0BFF]/.test(text)) return 'ta';        // Tamil
  if (/[\u0C00-\u0C7F]/.test(text)) return 'te';        // Telugu
  if (/[\u0A80-\u0AFF]/.test(text)) return 'gu';        // Gujarati
  if (/[\u0A00-\u0A7F]/.test(text)) return 'pa';        // Punjabi
  return 'en';                                           // Default English
};

// Delay in ms before auto-sending after mic stops
const AUTO_SEND_DELAY = 1500;

export const VoiceCompanionPage: React.FC = () => {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text');
  const recognitionRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const greetedRef = useRef(false);
  const msgIdRef = useRef(0);
  const autoSendTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getTime = () => new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const clean = sanitizeTextForSpeech(text);
      const utt = new SpeechSynthesisUtterance(clean);
      utt.lang = selectedLang.code;
      utt.rate = 0.88;
      utt.pitch = 1.0;
      utt.onstart = () => setIsSpeaking(true);
      utt.onend = () => setIsSpeaking(false);
      utt.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utt);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const addMessage = (sender: 'PATIENT' | 'COMPANION', text: string) => {
    msgIdRef.current += 1;
    const msg: ChatMessage = { id: msgIdRef.current, sender, text, time: getTime() };
    setChatHistory(prev => [...prev, msg]);
    return msg;
  };

  const generateReply = async (input: string) => {
    if (!input.trim()) return;
    addMessage('PATIENT', input);
    setIsThinking(true);

    // Auto-detect language from what the user typed/spoke
    const detectedLang = detectLanguage(input);

    try {
      const approvedMemories = db.getAiApprovedMemories();
      const patient = db.getPatientProfile();
      const history = chatHistory.map(m => ({ sender: m.sender, text: m.text }));
      history.push({ sender: 'PATIENT', text: input });

      const geminiReply = await GeminiClient.generateCompanionReply(
        patient.preferredName || patient.name || 'Rita',
        history,
        approvedMemories,
        detectedLang   // pass detected language so Gemini replies in same language
      );

      setIsThinking(false);
      addMessage('COMPANION', geminiReply.message);
      speak(geminiReply.message);
    } catch {
      setIsThinking(false);
      const fallback = detectedLang === 'hi'
        ? 'आप बिल्कुल सुरक्षित हैं। मैं आपके साथ हूँ। क्या आप अपने घर या परिवार के बारे में बात करना चाहेंगी?'
        : 'I hear you with all my heart. You are safe and surrounded by love. Tell me more.';
      addMessage('COMPANION', fallback);
      speak(fallback);
    }
  };

  useEffect(() => {
    // Greet only once
    if (!greetedRef.current) {
      greetedRef.current = true;
      setTimeout(() => {
        addMessage('COMPANION', GREETING);
        speak(GREETING);
      }, 600);
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;      // keep listening continuously
      recognition.interimResults = true;  // show words live as you speak
      recognition.lang = selectedLang.code;

      recognition.onresult = (event: any) => {
        // Build full interim + final transcript
        let interim = '';
        let final = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        // Put spoken words directly into the text input box
        setTextInput(prev => {
          const base = prev.replace(/\s*🎙️.*$/, '').trim(); // remove old interim marker
          if (final) return (base + ' ' + final).trim();
          if (interim) return (base + (base ? ' ' : '') + '🎙️' + interim).trim();
          return prev;
        });

        // Reset auto-send timer on every new result
        if (autoSendTimerRef.current) clearTimeout(autoSendTimerRef.current);
        if (final) {
          autoSendTimerRef.current = setTimeout(() => {
            // clean up mic marker then auto-send
            setTextInput(prev => {
              const clean = prev.replace(/\s*🎙️.*$/, '').trim();
              if (clean) {
                // trigger send after state settles
                setTimeout(() => {
                  setTextInput(t => {
                    const toSend = t.replace(/\s*🎙️.*$/, '').trim();
                    if (toSend) generateReply(toSend);
                    return '';
                  });
                }, 50);
              }
              return clean;
            });
          }, AUTO_SEND_DELAY);
        }
      };

      recognition.onerror = (e: any) => {
        if (e.error !== 'aborted') setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        // Clean up mic marker in input
        setTextInput(prev => prev.replace(/\s*🎙️.*$/, '').trim());
      };

      recognitionRef.current = recognition;
    }

    return () => {
      recognitionRef.current?.stop();
      window.speechSynthesis?.cancel();
      if (autoSendTimerRef.current) clearTimeout(autoSendTimerRef.current);
    };
  }, [selectedLang.code]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isThinking]);

  const toggleMic = () => {
    if (isListening) {
      if (autoSendTimerRef.current) clearTimeout(autoSendTimerRef.current);
      recognitionRef.current?.stop();
      setIsListening(false);
      // Clean up mic marker
      setTextInput(prev => prev.replace(/\s*🎙️.*$/, '').trim());
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
        setInputMode('voice');
      } catch {
        // mic unavailable
      }
    }
  };

  const handleTextSend = () => {
    const input = textInput.trim();
    if (!input) return;
    setTextInput('');
    generateReply(input);
  };

  return (
    <div className="h-screen bg-[#F4F7FB] flex flex-col max-w-lg mx-auto overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between py-3 px-4 bg-[#F4F7FB] sticky top-0 z-10 border-b border-slate-100">
        <button
          onClick={() => navigate('/patient/home')}
          className="w-10 h-10 rounded-2xl bg-white shadow-clay-sm border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-all"
          aria-label="Go Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 bg-white px-4 py-1.5 rounded-full shadow-clay-sm border border-slate-100">
          <Sparkles className="w-4 h-4 text-[#0E8765]" />
          <span className="text-xs font-black uppercase text-[#0E8765] tracking-wider font-heading">
            AI Voice Companion
          </span>
        </div>

        {/* Stop Speaking Button */}
        <button
          onClick={stopSpeaking}
          className={`w-10 h-10 rounded-2xl bg-white shadow-clay-sm border border-slate-200 flex items-center justify-center transition-all ${
            isSpeaking ? 'text-rose-500 ring-2 ring-rose-400 animate-pulse' : 'text-slate-400'
          }`}
          aria-label="Stop Speaking"
          title="Stop Speaking"
        >
          <StopCircle className="w-5 h-5" />
        </button>
      </div>

      {/* Compact avatar */}
      <div className="flex flex-col items-center gap-2 pt-4 pb-2 px-4">
        <div className="relative flex items-center justify-center">
          {/* Sound waves left */}
          <div className="flex items-center gap-1 mr-3">
            {[1, 2, 3].map(i => (
              <span key={i} className={`w-1.5 bg-[#0E8765]/${i * 20 + 20} rounded-full transition-all duration-300 ${
                isListening || isSpeaking ? `h-${4 + i * 3} animate-pulse` : 'h-2'
              }`} style={{ opacity: 0.4 + i * 0.2 }} />
            ))}
          </div>

          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-clay-card bg-[#E6F5EF]">
            <img
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80"
              alt="Voice Companion"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Sound waves right */}
          <div className="flex items-center gap-1 ml-3">
            {[3, 2, 1].map(i => (
              <span key={i} className={`w-1.5 rounded-full transition-all duration-300 ${
                isListening || isSpeaking ? `h-${4 + i * 3} animate-pulse` : 'h-2'
              }`} style={{ backgroundColor: '#0E8765', opacity: 0.4 + i * 0.2 }} />
            ))}
          </div>
        </div>

        <span className="text-xs font-black text-slate-500 tracking-wide">
          {isListening ? '🎙️ Listening...' : isSpeaking ? '🗣️ Speaking...' : isThinking ? '🤔 Thinking...' : 'Saathi is here for you'}
        </span>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto px-4 flex flex-col gap-3 pb-2">
        {chatHistory.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'PATIENT' ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            <div className={`max-w-[80%] rounded-[20px] px-4 py-3 shadow-sm ${
              msg.sender === 'PATIENT'
                ? 'bg-[#0E8765] text-white rounded-br-md'
                : 'bg-white text-slate-800 border border-slate-100 rounded-bl-md'
            }`}>
              <p className={`text-sm font-bold leading-snug ${msg.sender === 'PATIENT' ? 'text-white' : 'text-slate-800'}`}>
                {msg.text}
              </p>
              <span className={`text-[10px] mt-1 block ${msg.sender === 'PATIENT' ? 'text-emerald-200' : 'text-slate-400'}`}>
                {msg.time}
              </span>
            </div>
          </div>
        ))}

        {/* Thinking indicator */}
        {isThinking && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-100 rounded-[20px] rounded-bl-md px-4 py-3 shadow-sm">
              <div className="flex gap-1 items-center">
                <span className="w-2 h-2 rounded-full bg-[#0E8765] animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-[#0E8765] animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-[#0E8765] animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Topics */}
      <div className="flex gap-2 px-4 pb-2 overflow-x-auto">
        {[
          { emoji: '🏡', label: 'Home', text: 'Tell me about my childhood home in Tezpur' },
          { emoji: '👨', label: 'Gaurav', text: 'Tell me about my son Gaurav' },
          { emoji: '🎵', label: 'Music', text: 'Tell me about my favourite music' },
          { emoji: '🎉', label: 'Bihu', text: 'Tell me about Bihu festival' },
        ].map(topic => (
          <button
            key={topic.label}
            onClick={() => generateReply(topic.text)}
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white shadow-clay-sm border border-slate-100 text-xs font-black text-slate-700 hover:bg-emerald-50 hover:text-[#0E8765] transition-all"
          >
            <span>{topic.emoji}</span>
            <span>{topic.label}</span>
          </button>
        ))}
      </div>

      {/* Mic listening hint */}
      {isListening && (
        <div className="mx-4 mb-2 bg-rose-50 border border-rose-200 rounded-2xl px-4 py-2 text-sm font-bold text-rose-700 animate-pulse flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          Listening... speak now. Words appear in the box below.
        </div>
      )}

      {/* Bottom Controls — Text Input + Mic */}
      <div className="px-4 pb-6 pt-2 border-t border-slate-100 bg-[#F4F7FB] sticky bottom-0 flex flex-col gap-3">
        {/* Text Input Row — mic icon inside + send button outside */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            {/* Mic icon inside the input on the LEFT */}
            <button
              onClick={toggleMic}
              className={`absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all z-10 ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse shadow-md'
                  : 'bg-slate-100 text-slate-500 hover:bg-rose-100 hover:text-rose-500'
              }`}
              aria-label="Toggle Microphone"
              title={isListening ? 'Stop listening' : 'Tap to speak'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={textInput}
              onChange={e => { setTextInput(e.target.value); setInputMode('text'); }}
              onKeyDown={e => e.key === 'Enter' && handleTextSend()}
              placeholder={isListening ? '🎙️ Speak now — words appear here...' : 'Type or tap 🎙️ to speak...'}
              className={`w-full border rounded-[20px] pl-12 pr-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none transition-all placeholder-slate-400 ${
                isListening
                  ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-200'
                  : 'bg-white border-slate-200 focus:ring-2 focus:ring-[#0E8765]'
              }`}
            />
          </div>

          {/* Send button */}
          <button
            onClick={handleTextSend}
            disabled={!textInput.replace(/🎙️.*$/, '').trim()}
            className="w-11 h-11 rounded-full bg-[#0E8765] text-white flex items-center justify-center shadow-lg disabled:opacity-40 transition-all active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Language Pills Row — compact */}
        <div className="flex gap-1.5 justify-center">
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => setSelectedLang(lang)}
              className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all ${
                selectedLang.code === lang.code
                  ? 'bg-[#0E8765] text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              {lang.short}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VoiceCompanionPage;
