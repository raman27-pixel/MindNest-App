import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Sparkles, Trash2, PauseCircle, PlayCircle, Volume2, Bot } from 'lucide-react';
import { ClayCard } from '../../components/ui/ClayCard';
import { useVoice } from '../../contexts/VoiceContext';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { db } from '../../services/db';
import { GeminiClient } from '../../services/geminiClient';
import { ReminiscenceMessage } from '../../types';

export const MemoryCompanionPage: React.FC = () => {
  const navigate = useNavigate();
  const { speak } = useVoice();
  const { settings } = useAccessibility();
  const lang = settings.language;
  const patient = db.getPatientProfile();

  const [messages, setMessages] = useState<ReminiscenceMessage[]>([
    {
      id: 'msg-1',
      sender: 'COMPANION',
      text: `Hello ${patient.preferredName || patient.name}. It is so lovely to spend a peaceful moment together. You can ask me anything about your childhood home in Tezpur, son Gaurav, or beloved Bihu celebrations.`,
      timestamp: new Date().toISOString(),
      topic: 'Welcome Greeting'
    }
  ]);

  const [inputText, setInputText] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isPaused) return;

    const userMsg: ReminiscenceMessage = {
      id: `msg-${Date.now()}`,
      sender: 'PATIENT',
      text: textToSend.trim(),
      timestamp: new Date().toISOString()
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputText('');
    setIsGenerating(true);

    try {
      const approvedMemories = db.getAiApprovedMemories();
      const replyData = await GeminiClient.generateCompanionReply(
        patient.preferredName || patient.name || 'Rita',
        newHistory.map(m => ({ sender: m.sender, text: m.text })),
        approvedMemories,
        lang
      );

      const companionMsg: ReminiscenceMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'COMPANION',
        text: replyData.message,
        timestamp: new Date().toISOString(),
        topic: replyData.topic || 'Gemini Memory Conversation'
      };

      setMessages(prev => [...prev, companionMsg]);

      // Speak reply aloud with speech synthesis in Hindi or patient preferred voice
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(replyData.message);
        u.lang = 'hi-IN';
        u.rate = 0.88;
        window.speechSynthesis.speak(u);
      } else if (settings.voiceEnabled) {
        speak(replyData.message);
      }
    } catch (err) {
      console.error('Companion error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClearHistory = () => {
    if (confirm("Clear memory conversation history?")) {
      setMessages([
        {
          id: `msg-${Date.now()}`,
          sender: 'COMPANION',
          text: `Hello ${patient.preferredName || patient.name}. I am right here with you. What would you like to talk about today?`,
          timestamp: new Date().toISOString(),
          topic: 'Welcome Greeting'
        }
      ]);
    }
  };

  const playSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'hi-IN';
      u.rate = 0.88;
      window.speechSynthesis.speak(u);
    } else {
      speak(text);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] pb-32 pt-4 px-4 md:px-8 max-w-3xl mx-auto flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/patient/home')}
          className="w-12 h-12 rounded-[18px] bg-white shadow-clay-sm border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-all active:scale-95"
          aria-label="Back to home"
        >
          <ArrowLeft className="w-6 h-6 text-[#0E8765]" />
        </button>

        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-clay-sm border border-slate-100">
          <Sparkles className="w-4 h-4 text-[#0E8765]" />
          <span className="text-xs font-black text-slate-800 font-heading">
            Gemini Memory Companion
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`px-3 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 transition-colors ${
              isPaused ? 'bg-amber-100 text-amber-800' : 'bg-white shadow-clay-sm text-slate-600 hover:bg-slate-50'
            }`}
            title="Pause Memory Companion"
          >
            {isPaused ? <PlayCircle className="w-4 h-4 text-amber-700" /> : <PauseCircle className="w-4 h-4" />}
            <span>{isPaused ? 'Paused' : 'Pause'}</span>
          </button>

          <button
            onClick={handleClearHistory}
            className="w-10 h-10 rounded-[16px] bg-white shadow-clay-sm border border-slate-200 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors"
            title="Clear conversation history"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Chat Box */}
      <ClayCard padding="lg" className="border border-white shadow-clay-card flex-1 flex flex-col justify-between min-h-[520px]">
        {/* Messages List */}
        <div className="flex flex-col gap-4 overflow-y-auto max-h-[56vh] pr-1">
          {messages.map((msg) => {
            const isCompanion = msg.sender === 'COMPANION';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isCompanion ? 'justify-start' : 'justify-end'} animate-fade-in`}
              >
                {isCompanion && (
                  <div className="w-11 h-11 rounded-[18px] bg-[#0E8765] text-white flex items-center justify-center shadow-clay-primary shrink-0 mt-1">
                    <Sparkles className="w-5 h-5" />
                  </div>
                )}

                <div className={`flex flex-col max-w-[84%] sm:max-w-[75%] ${isCompanion ? 'items-start' : 'items-end'}`}>
                  <div
                    className={`p-4 sm:p-5 rounded-[26px] text-base sm:text-lg font-bold leading-relaxed shadow-sm ${
                      isCompanion 
                        ? 'bg-[#E6F5EF]/60 text-slate-900 rounded-tl-sm border border-emerald-100/60' 
                        : 'bg-[#0E8765] text-white rounded-tr-sm shadow-clay-primary'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {isCompanion && (
                    <button
                      onClick={() => playSpeech(msg.text)}
                      className="text-xs font-black text-[#0E8765] hover:underline mt-1.5 flex items-center gap-1.5 ml-2"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Listen Aloud (बोलकर सुनें)</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {isGenerating && (
            <div className="flex items-center gap-3 animate-pulse p-2">
              <div className="w-10 h-10 rounded-2xl bg-[#E6F5EF] text-[#0E8765] flex items-center justify-center">
                <Sparkles className="w-5 h-5 animate-spin" />
              </div>
              <span className="text-sm font-bold text-slate-500">
                Gemini is recalling your memories with warmth...
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Familiar Prompts */}
        <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
          <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
            Tap a familiar memory to ask:
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleSendMessage("Tell me about my childhood home in Tezpur.")}
              className="px-3.5 py-2 rounded-xl text-xs font-extrabold bg-slate-50 hover:bg-emerald-50 hover:text-[#0E8765] text-slate-700 border border-slate-200 transition-colors"
            >
              🏡 Childhood Home in Tezpur
            </button>
            <button
              onClick={() => handleSendMessage("Who is my son Gaurav and what does he do?")}
              className="px-3.5 py-2 rounded-xl text-xs font-extrabold bg-slate-50 hover:bg-emerald-50 hover:text-[#0E8765] text-slate-700 border border-slate-200 transition-colors"
            >
              👨 My Son Gaurav
            </button>
            <button
              onClick={() => handleSendMessage("What songs did we listen to during Rongali Bihu?")}
              className="px-3.5 py-2 rounded-xl text-xs font-extrabold bg-slate-50 hover:bg-emerald-50 hover:text-[#0E8765] text-slate-700 border border-slate-200 transition-colors"
            >
              🎵 Bihu Songs & Festival
            </button>
            <button
              onClick={() => handleSendMessage("How did grandmother prepare hot til pitha?")}
              className="px-3.5 py-2 rounded-xl text-xs font-extrabold bg-slate-50 hover:bg-emerald-50 hover:text-[#0E8765] text-slate-700 border border-slate-200 transition-colors"
            >
              🥟 Til Pitha Delicacy
            </button>
          </div>
        </div>

        {/* Input Form */}
        <div className="pt-3 mt-1">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputText);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isPaused || isGenerating}
              placeholder={isPaused ? "Companion is paused..." : "Ask anything about your memories or family..."}
              className="flex-1 clay-input text-base sm:text-lg font-bold min-h-[56px] px-5 rounded-[22px]"
            />

            <button
              type="submit"
              disabled={!inputText.trim() || isPaused || isGenerating}
              className={`w-14 h-14 rounded-[22px] flex items-center justify-center transition-all cursor-pointer ${
                inputText.trim() && !isPaused && !isGenerating
                  ? 'bg-[#0E8765] text-white shadow-clay-primary hover:bg-[#0B6D52] active:scale-95'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-6 h-6" />
            </button>
          </form>
        </div>
      </ClayCard>
    </div>
  );
};

export default MemoryCompanionPage;
