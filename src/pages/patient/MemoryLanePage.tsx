import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Volume2, ChevronLeft, ChevronRight, Mic, FastForward } from 'lucide-react';
import { db } from '../../services/db';
import { MemoryItem } from '../../types';
import { sanitizeTextForSpeech } from '../../services/speechSanitizer';

export const MemoryLanePage: React.FC = () => {
  const navigate = useNavigate();
  const approvedMemories = db.getApprovedMemories();
  const [currentIndex, setCurrentIndex] = useState<number>(1); // Index 1 is 'My Village' house from reference
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [patientResponse, setPatientResponse] = useState<string | null>(null);

  if (approvedMemories.length === 0) {
    return (
      <div className="min-h-screen bg-[#F4F7FB] p-6 flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-black text-slate-800">No Memories Available</h2>
        <button onClick={() => navigate('/patient/home')} className="clay-btn-primary mt-4">
          Go Home
        </button>
      </div>
    );
  }

  const memory: MemoryItem = approvedMemories[currentIndex] || approvedMemories[0];

  const handlePrev = () => {
    setPatientResponse(null);
    setCurrentIndex((prev) => (prev - 1 + approvedMemories.length) % approvedMemories.length);
  };

  const handleNext = () => {
    setPatientResponse(null);
    setCurrentIndex((prev) => (prev + 1) % approvedMemories.length);
  };

  const handleSpeak = () => {
    setIsSpeaking(true);
    // Simulate speech recognition / prompt
    setTimeout(() => {
      setIsSpeaking(false);
      setPatientResponse(`"This was our village home in Nagaon where we lived."`);
    }, 1500);
  };

  const questionPrompt = memory.title.includes('Village')
    ? 'Do you remember this house?'
    : `Do you remember ${memory.title}?`;

  const playVoicePrompt = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const clean = sanitizeTextForSpeech(questionPrompt);
      const u = new SpeechSynthesisUtterance(clean);
      u.rate = 0.85;
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] pb-24 pt-3 px-3 sm:px-6 max-w-md mx-auto flex flex-col justify-between">
      {/* Top Header with Back Arrow matching Screen 4 */}
      <div className="flex items-center justify-between py-2">
        <button
          onClick={() => navigate('/patient/home')}
          className="w-10 h-10 rounded-full bg-white shadow-clay-sm flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-all"
          aria-label="Go Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <span className="text-xs font-black uppercase text-[#0E8765] tracking-wider font-heading">
          Memory Lane ({currentIndex + 1} of {approvedMemories.length})
        </span>

        <div className="w-10" />
      </div>

      {/* Main Memory Frame matching Screen 4 */}
      <div className="flex flex-col gap-4 my-auto">
        {/* Large Photo of traditional Assam house on stilts */}
        <div className="w-full aspect-[4/3] rounded-[28px] overflow-hidden bg-slate-200 shadow-clay-card border-2 border-white relative">
          <img
            src={memory.imageUrl}
            alt={memory.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Audio question prompt bubble */}
        <div 
          onClick={playVoicePrompt}
          className="bg-white rounded-[24px] p-4 shadow-clay-card border border-white flex items-center gap-3 cursor-pointer hover:bg-slate-50 transition-colors"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#E6F5EF] text-[#0E8765] flex items-center justify-center shrink-0 shadow-sm">
            <Volume2 className="w-5 h-5" />
          </div>
          <span className="text-lg sm:text-xl font-black text-slate-800 font-heading">
            {questionPrompt}
          </span>
        </div>

        {/* Optional recognized patient voice transcript */}
        {patientResponse && (
          <div className="bg-[#E6F5EF] border border-[#0E8765]/20 p-4 rounded-[22px] text-center text-slate-800 font-bold text-sm animate-fade-in">
            {patientResponse}
          </div>
        )}

        {/* Navigation & Central Tap to Speak Button matching Screen 4 */}
        <div className="flex items-center justify-between px-4 pt-2">
          {/* Left Arrow Button */}
          <button
            onClick={handlePrev}
            className="w-14 h-14 rounded-2xl bg-white shadow-clay-card border border-white flex items-center justify-center text-slate-700 hover:bg-slate-100 active:scale-95 transition-all"
            aria-label="Previous Memory"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>

          {/* Large Teal Central Mic Button */}
          <div className="flex flex-col items-center gap-1.5">
            <button
              onClick={handleSpeak}
              className={`w-20 h-20 rounded-full bg-[#0E8765] hover:bg-[#0B6D52] active:scale-95 text-white flex items-center justify-center shadow-clay-primary border-4 border-white transition-all cursor-pointer ${
                isSpeaking ? 'ring-4 ring-[#0E8765]/40 animate-pulse' : ''
              }`}
              aria-label="Tap to speak"
            >
              <Mic className="w-9 h-9" />
            </button>
            <span className="text-xs font-black text-slate-600 font-heading">
              {isSpeaking ? 'Listening...' : 'Tap to speak'}
            </span>
          </div>

          {/* Right Arrow Button */}
          <button
            onClick={handleNext}
            className="w-14 h-14 rounded-2xl bg-white shadow-clay-card border border-white flex items-center justify-center text-slate-700 hover:bg-slate-100 active:scale-95 transition-all"
            aria-label="Next Memory"
          >
            <ChevronRight className="w-7 h-7" />
          </button>
        </div>

        {/* Skip Button matching Screen 4 */}
        <div className="flex justify-center pt-2">
          <button
            onClick={handleNext}
            className="px-6 py-2.5 rounded-full bg-white hover:bg-slate-100 shadow-clay-sm text-xs font-black text-slate-600 flex items-center gap-1.5 transition-all"
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>Skip</span>
          </button>
        </div>
      </div>
    </div>
  );
};
