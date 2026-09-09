import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Volume2, Mic, MicOff, Settings, Sparkles, MessageCircle, Heart, RefreshCw } from 'lucide-react';
import { sanitizeTextForSpeech } from '../../services/speechSanitizer';
import { GeminiClient } from '../../services/geminiClient';
import { db } from '../../services/db';

// Dementia-friendly empathetic reminiscence responses
const COMPANION_RESPONSES: Record<string, { hi: string; en: string }> = {
  home: {
    hi: 'आपका तेजपुर वाला घर बहुत शांत और सुंदर था। लकड़ी का बरामदा, हरी चाय की पत्तियां और ब्रह्मपुत्र की ठंडी हवा। क्या आपको वह आंगन याद है?',
    en: 'Your childhood home was so serene. The wooden veranda, green tea bushes, and the cool Brahmaputra breeze. Do you remember the courtyard?'
  },
  family: {
    hi: 'आपका बेटा गौरव आपको बहुत प्यार करता है। वह हमेशा आपके लिए असम की ताज़ी चाय और मीठे पीठा लाना पसंद करता है।',
    en: 'Your son Gaurav loves you dearly. He always enjoys bringing you fresh tea and sweet pitha from Assam.'
  },
  music: {
    hi: 'संगीत आत्मा को सुकून देता है। भूपेन हजारिका जी और लक्ष्मीनाथ बेजबरुआ के मधुर गीत आपके दिल के बहुत करीब रहे हैं।',
    en: 'Music brings so much comfort. Songs by Bhupen Hazarika and regional melodies have always brought peace to your heart.'
  },
  festival: {
    hi: 'रोंगाली बिहू में आप सब मिलकर ढोल और पेपा की धुन पर नाचते थे। नया गमछा और खुशी का माहौल कितना सुंदर होता था!',
    en: 'During Rongali Bihu, everyone danced to dhol and pepa. New gamosas and joyful family laughter were everywhere.'
  },
  default: {
    hi: 'मैं आपकी बात ध्यान से सुन रही हूँ। आप बहुत अच्छे और प्यारे इंसान हैं। मुझे आपके साथ बात करके बहुत शांति और खुशी मिलती है।',
    en: 'I am listening to you with all my heart. You are deeply cherished, and talking with you brings so much warmth.'
  }
};

export const VoiceCompanionPage: React.FC = () => {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [companionReply, setCompanionReply] = useState<{ hi: string; en: string }>({
    hi: 'नमस्ते रीता जी! मैं आपकी सहेली हूँ। आप मुझसे अपने घर, बचपन या परिवार के बारे में कुछ भी कह सकती हैं।',
    en: 'Namaste Rita ji! I am your gentle companion. You can talk with me about your home, childhood, or family.'
  });
  const [selectedLanguage, setSelectedLanguage] = useState<string>('Hindi');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initial greeting aloud in Hindi
    speakReply(companionReply.hi);

    // Initialize Web Speech API if available
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = selectedLanguage === 'Hindi' ? 'hi-IN' : selectedLanguage === 'Assamese' ? 'as-IN' : 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const text = event.results[current][0].transcript;
        setTranscript(text);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        // Process speech
        if (transcript.trim()) {
          generateAndSpeakResponse(transcript);
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speakReply = (textToSpeak: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const clean = sanitizeTextForSpeech(textToSpeak);
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.88;
      utterance.pitch = 1.0;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const generateAndSpeakResponse = async (input: string) => {
    try {
      const approvedMemories = db.getAiApprovedMemories();
      const patient = db.getPatientProfile();
      const geminiReply = await GeminiClient.generateCompanionReply(
        patient.preferredName || patient.name || 'Rita',
        [{ sender: 'PATIENT', text: input }],
        approvedMemories,
        selectedLanguage === 'Hindi' ? 'hi' : 'en'
      );

      const reply = {
        hi: geminiReply.message,
        en: geminiReply.message
      };
      setCompanionReply(reply);
      speakReply(reply.hi);
    } catch {
      const lower = input.toLowerCase();
      let reply = COMPANION_RESPONSES.default;

      if (lower.includes('घर') || lower.includes('home') || lower.includes('place') || lower.includes('tezpur')) {
        reply = COMPANION_RESPONSES.home;
      } else if (lower.includes('बेटा') || lower.includes('family') || lower.includes('gaurav') || lower.includes('son') || lower.includes('बच्चे')) {
        reply = COMPANION_RESPONSES.family;
      } else if (lower.includes('गाना') || lower.includes('song') || lower.includes('music') || lower.includes('धुन')) {
        reply = COMPANION_RESPONSES.music;
      } else if (lower.includes('त्योहार') || lower.includes('bihu') || lower.includes('festival') || lower.includes('पूजा')) {
        reply = COMPANION_RESPONSES.festival;
      }

      setCompanionReply(reply);
      speakReply(reply.hi);
    }
  };

  const toggleMic = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      setTranscript('');
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsListening(true);
        } catch (e) {
          // Fallback simulation if browser blocks permission
          simulateVoiceInput();
        }
      } else {
        simulateVoiceInput();
      }
    }
  };

  const simulateVoiceInput = () => {
    setIsListening(true);
    setTimeout(() => {
      const simulatedSamples = [
        'मुझे मेरा पुराना घर याद आ रहा है...',
        'गौरव कब आएगा घर?',
        'कोई पुराना मधुर गीत सुनाइए ना'
      ];
      const picked = simulatedSamples[Math.floor(Math.random() * simulatedSamples.length)];
      setTranscript(picked);
      setIsListening(false);
      generateAndSpeakResponse(picked);
    }, 2500);
  };

  const handleQuickTopic = (topicKey: 'home' | 'family' | 'music' | 'festival') => {
    const reply = COMPANION_RESPONSES[topicKey];
    setCompanionReply(reply);
    setTranscript(
      topicKey === 'home' ? 'मुझे मेरे बचपन के घर के बारे में बताइए...' :
      topicKey === 'family' ? 'मेरे परिवार के बारे में बताइए...' :
      topicKey === 'music' ? 'कोई प्यारा संगीत सुनाइए...' :
      'बिहू त्योहार की याद दिलाइए...'
    );
    speakReply(reply.hi);
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] pb-24 pt-3 px-4 max-w-lg mx-auto flex flex-col justify-between">
      {/* Top Bar */}
      <div className="flex items-center justify-between py-2">
        <button
          onClick={() => navigate('/patient/home')}
          className="w-11 h-11 rounded-2xl bg-white shadow-clay-sm border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-all active:scale-95"
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

        <button
          onClick={() => speakReply(companionReply.hi)}
          className={`w-11 h-11 rounded-2xl bg-white shadow-clay-sm border border-slate-200 flex items-center justify-center text-[#0E8765] hover:bg-slate-50 transition-all ${
            isSpeaking ? 'ring-2 ring-[#0E8765] animate-pulse' : ''
          }`}
          aria-label="Repeat Audio Prompt"
        >
          <Volume2 className="w-5 h-5" />
        </button>
      </div>

      {/* Center Avatar with sound waves */}
      <div className="flex flex-col items-center gap-4 my-auto">
        <div className="relative flex items-center justify-center">
          {/* Sound waves visualization on left */}
          <div className="flex items-center gap-1.5 mr-4">
            <span className={`w-1.5 bg-[#0E8765]/40 rounded-full transition-all duration-300 ${isListening || isSpeaking ? 'h-7 animate-pulse' : 'h-3'}`} />
            <span className={`w-1.5 bg-[#0E8765]/60 rounded-full transition-all duration-300 ${isListening || isSpeaking ? 'h-11 animate-pulse delay-75' : 'h-4'}`} />
            <span className={`w-1.5 bg-[#0E8765] rounded-full transition-all duration-300 ${isListening || isSpeaking ? 'h-16 animate-pulse delay-150' : 'h-6'}`} />
          </div>

          {/* Friendly Companion Avatar */}
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-clay-card bg-[#E6F5EF] relative">
            <img
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80"
              alt="Voice Companion"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Sound waves visualization on right */}
          <div className="flex items-center gap-1.5 ml-4">
            <span className={`w-1.5 bg-[#0E8765] rounded-full transition-all duration-300 ${isListening || isSpeaking ? 'h-16 animate-pulse delay-150' : 'h-6'}`} />
            <span className={`w-1.5 bg-[#0E8765]/60 rounded-full transition-all duration-300 ${isListening || isSpeaking ? 'h-11 animate-pulse delay-75' : 'h-4'}`} />
            <span className={`w-1.5 bg-[#0E8765]/40 rounded-full transition-all duration-300 ${isListening || isSpeaking ? 'h-7 animate-pulse' : 'h-3'}`} />
          </div>
        </div>

        {/* Listening / Speaking indicator */}
        <span className="text-sm font-black text-slate-600 font-heading tracking-wide">
          {isListening ? '🎙️ Listening to you...' : isSpeaking ? '🗣️ Speaking softly...' : 'Tap red button to speak'}
        </span>

        {/* Patient Speech Transcript if present */}
        {transcript && (
          <div className="w-full bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-center animate-fade-in">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">
              You said:
            </span>
            <p className="text-base font-bold text-emerald-950 font-heading">
              "{transcript}"
            </p>
          </div>
        )}

        {/* Companion Speech Bubble with Hindi Script & English Support */}
        <div className="w-full bg-white rounded-[28px] p-5 shadow-clay-card border border-white flex flex-col gap-2 text-center">
          <p className="text-xl sm:text-2xl font-black text-slate-800 font-heading leading-snug">
            {companionReply.hi}
          </p>
          <p className="text-xs font-semibold text-slate-400">
            {companionReply.en}
          </p>
        </div>

        {/* Quick Tap Topics for Patient */}
        <div className="w-full flex flex-wrap justify-center gap-2 pt-1">
          <button
            onClick={() => handleQuickTopic('home')}
            className="px-3.5 py-2 rounded-xl bg-white shadow-clay-sm border border-slate-100 text-xs font-black text-slate-700 hover:bg-emerald-50 hover:text-[#0E8765] transition-all"
          >
            🏡 Childhood Home
          </button>
          <button
            onClick={() => handleQuickTopic('family')}
            className="px-3.5 py-2 rounded-xl bg-white shadow-clay-sm border border-slate-100 text-xs font-black text-slate-700 hover:bg-emerald-50 hover:text-[#0E8765] transition-all"
          >
            👨 Son Gaurav
          </button>
          <button
            onClick={() => handleQuickTopic('music')}
            className="px-3.5 py-2 rounded-xl bg-white shadow-clay-sm border border-slate-100 text-xs font-black text-slate-700 hover:bg-emerald-50 hover:text-[#0E8765] transition-all"
          >
            🎵 Favourite Music
          </button>
          <button
            onClick={() => handleQuickTopic('festival')}
            className="px-3.5 py-2 rounded-xl bg-white shadow-clay-sm border border-slate-100 text-xs font-black text-slate-700 hover:bg-emerald-50 hover:text-[#0E8765] transition-all"
          >
            🎉 Bihu Celebration
          </button>
        </div>

        {/* Large Red Circular Mic Button */}
        <button
          onClick={toggleMic}
          className={`w-20 h-20 rounded-full bg-rose-500 hover:bg-rose-600 active:scale-95 text-white flex items-center justify-center shadow-xl shadow-rose-500/30 border-4 border-white transition-all cursor-pointer ${
            isListening ? 'ring-8 ring-rose-400/50 animate-pulse' : ''
          }`}
          aria-label="Toggle Microphone"
        >
          {isListening ? <MicOff className="w-9 h-9" /> : <Mic className="w-9 h-9" />}
        </button>
      </div>

      {/* Bottom Controls */}
      <div className="flex items-center justify-between pt-3">
        <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-[20px] shadow-clay-sm border border-white">
          <span className="text-xs font-bold text-slate-400">Language:</span>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-transparent font-black text-xs text-[#0E8765] focus:outline-none cursor-pointer"
            aria-label="Select Voice Language"
          >
            <option value="Hindi">Hindi (हिंदी)</option>
            <option value="Assamese">Assamese (অসমীয়া)</option>
            <option value="Bengali">Bengali (বাংলা)</option>
            <option value="English">English</option>
          </select>
        </div>

        <button
          onClick={() => navigate('/patient/settings')}
          className="w-10 h-10 rounded-full bg-white shadow-clay-sm flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-all"
          aria-label="Voice Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default VoiceCompanionPage;
