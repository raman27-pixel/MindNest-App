import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  Sparkles, 
  Volume2, 
  ArrowLeft, 
  ArrowRight, 
  Heart, 
  CheckCircle2, 
  HelpCircle, 
  BookOpen, 
  RotateCcw,
  Mic,
  Music,
  Home,
  Users,
  Sun
} from 'lucide-react';
import { ClayCard } from '../../components/ui/ClayCard';
import { useVoice } from '../../contexts/VoiceContext';

interface MemoryItem {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  image: string;
  story: string;
  audioPromptHindi: string;
  audioPromptEnglish: string;
  icon: any;
  tag: string;
}

const MEMORY_BOX_ITEMS: MemoryItem[] = [
  {
    id: 'mem-1',
    category: 'Family Member',
    title: 'Your Son Gaurav',
    subtitle: 'Visiting during Magh Bihu with family',
    image: '/images/person_son_gaurav.jpg',
    story: 'Gaurav always brings fresh homemade sweets whenever he comes home from Guwahati. He loves hearing your childhood village stories and making tea for you every morning.',
    audioPromptHindi: 'यह आपके बेटे गौरव हैं। वे गुवाहाटी से आपके लिए गर्म चाय और पीठा लाते हैं।',
    audioPromptEnglish: 'This is your son Gaurav. He always brings fresh sweets and makes morning tea for you.',
    icon: Users,
    tag: '👨 Family Member'
  },
  {
    id: 'mem-2',
    category: 'Childhood Home',
    title: 'Childhood Home in Tezpur',
    subtitle: 'Wooden stilt veranda near the Brahmaputra',
    image: '/images/location_village_home.jpg',
    story: 'Your parents built this home in 1968. You used to read your favourite poetry books sitting on the wooden steps while watching rain fall on the banana leaves.',
    audioPromptHindi: 'तेजपुर का यह आपका प्यारा बचपन का घर है। बारिश के समय आप बरामदे में बैठकर कविताएं पढ़ते थे।',
    audioPromptEnglish: 'Your childhood home in Tezpur. You used to sit on the porch during monsoon rains.',
    icon: Home,
    tag: '🏠 Childhood Home'
  },
  {
    id: 'mem-3',
    category: 'Festival',
    title: 'Rongali Bihu Spring Celebration',
    subtitle: 'Wearing the Muga Silk Gamosa and dancing',
    image: '/images/festival_bihu.jpg',
    story: 'Every spring in April, the family gathers for Bihu. You wore your grandmother’s heirloom Muga silk mekhela chador and taught the younger cousins the traditional clapping steps.',
    audioPromptHindi: 'यह रोंगाली बिहू का पावन त्योहार है। आप मुगा सिल्क पहनकर बिहू के सुंदर ताल सिखाते थे।',
    audioPromptEnglish: 'Rongali Bihu festival. You wore your handwoven silk chador and guided everyone.',
    icon: Sun,
    tag: '🎉 Festival'
  },
  {
    id: 'mem-4',
    category: 'Favourite Song',
    title: 'Mur Apunar Dex',
    subtitle: 'Melodious regional anthem by Lakshminath Bezbaroa',
    image: '/images/culture_music_harmonium.jpg',
    story: 'This beloved melody has been your favorite since school days. Whenever you hear the gentle flute opening, you close your eyes with a peaceful smile.',
    audioPromptHindi: 'यह आपका सबसे पसंदीदा गीत है: मुर आपुनार देख। इसकी धुन सुनते ही मन शांत हो जाता है।',
    audioPromptEnglish: 'Your favourite song "Mur Apunar Dex". Its flute notes bring peace and joy.',
    icon: Music,
    tag: '🎵 Favourite Song'
  },
  {
    id: 'mem-5',
    category: 'Mother',
    title: 'Mother’s Silver Betel & Spice Box',
    subtitle: 'Heirloom brass and silver box from Jorhat',
    image: '/images/memory_brass_box.jpg',
    story: 'Your mother kept cardamom, cloves, and betel nut inside this handcrafted box. The delicate floral engravings were carved by an artisan in Upper Assam.',
    audioPromptHindi: 'यह आपकी माँ की चांदी और पीतल की संदूकची है, जिसमें वे इलायची और लौंग रखती थीं।',
    audioPromptEnglish: 'Your mother’s silver heirloom box with handcrafted floral engravings.',
    icon: Sparkles,
    tag: '👩 Mother'
  },
  {
    id: 'mem-6',
    category: 'Hometown',
    title: 'Brahmaputra River Ghat in Evening',
    subtitle: 'Bathing in the golden sunset breeze',
    image: '/images/location_riverbank.jpg',
    story: 'Every Sunday after prayers, you and your father would walk along the river bank. The cool breeze and gentle water ripples were your happiest evening moments.',
    audioPromptHindi: 'ब्रह्मपुत्र नदी का यह किनारा, जहाँ शाम की ठंडी हवा और सुनहरी धूप बहती है।',
    audioPromptEnglish: 'The calm Brahmaputra river ghat at sunset where you walked with family.',
    icon: Sun,
    tag: '🌾 Hometown'
  }
];

export const MemoryBoxGamePage: React.FC = () => {
  const navigate = useNavigate();
  const { speak: voiceSpeak } = useVoice();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isBoxOpen, setIsBoxOpen] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState<'remember' | 'tell_me' | 'not_sure' | null>(null);
  const [recordedFeelings, setRecordedFeelings] = useState<Record<number, string>>({});
  const [isRecording, setIsRecording] = useState(false);

  const currentItem = MEMORY_BOX_ITEMS[currentIndex];

  const handleSpeak = (text: string, hindiText?: string) => {
    // Prioritize Hindi speech synthesis for Indian patient cultural comfort
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(hindiText || text);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.88;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } else {
      voiceSpeak(text);
    }
  };

  const handleOpenBox = () => {
    setIsBoxOpen(true);
    setSelectedResponse(null);
    handleSpeak(
      `Inside Rita's Memory Box, here is ${currentItem.title}. ${currentItem.subtitle}`,
      `रीता की मेमोरी बॉक्स में देखिए: ${currentItem.audioPromptHindi}`
    );
  };

  const handleResponse = (type: 'remember' | 'tell_me' | 'not_sure') => {
    setSelectedResponse(type);
    if (type === 'remember') {
      handleSpeak(
        'Wonderful! It is so lovely to remember this together. Take a breath and smile.',
        'बहुत बढ़िया! यह याद आपके दिल के बहुत करीब है। मुस्कुराइए।'
      );
    } else if (type === 'tell_me') {
      handleSpeak(currentItem.story, currentItem.audioPromptHindi + ' ' + currentItem.story);
    } else if (type === 'not_sure') {
      handleSpeak(
        "It's completely okay. There is no rush at all. Let's look at this lovely memory together.",
        'कोई बात नहीं, बिल्कुल चिंता मत कीजिए। हम सब यहाँ साथ हैं, आराम से देखिए।'
      );
    }
  };

  const handleNext = () => {
    if (currentIndex < MEMORY_BOX_ITEMS.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsBoxOpen(true);
      setSelectedResponse(null);
      const nextItem = MEMORY_BOX_ITEMS[currentIndex + 1];
      handleSpeak(
        `Next treasure: ${nextItem.title}.`,
        `अगली प्यारी याद: ${nextItem.audioPromptHindi}`
      );
    } else {
      // Completed all items in the box
      handleSpeak(
        'You have opened every treasure in your Memory Box! What a heartwarming time.',
        'आपने अपनी मेमोरी बॉक्स की सभी सुंदर यादें देख ली हैं! बहुत सुंदर।'
      );
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setIsBoxOpen(true);
      setSelectedResponse(null);
    }
  };

  const handleRecordFeeling = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setRecordedFeelings(prev => ({
        ...prev,
        [currentIndex]: 'Voice memory gently saved: "I feel warm and peaceful."'
      }));
      handleSpeak('Your voice reflection has been safely saved in the Memory Box.', 'आपकी आवाज इस याद के साथ सुरक्षित रख ली गई है।');
    }, 2200);
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] pb-28 pt-4 px-4 sm:px-6 max-w-2xl mx-auto flex flex-col items-center">
      {/* Top Bar */}
      <div className="w-full flex items-center justify-between mb-4">
        <button
          onClick={() => navigate('/patient/activities')}
          className="w-12 h-12 rounded-[18px] bg-white shadow-clay-sm border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 active:scale-95 transition-all"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-clay-sm border border-slate-100">
          <Package className="w-5 h-5 text-[#0E8765]" />
          <span className="text-sm font-black text-slate-800 font-heading tracking-wide">
            Rita's Memory Box
          </span>
        </div>

        <button
          onClick={() => {
            setCurrentIndex(0);
            setIsBoxOpen(false);
            setSelectedResponse(null);
          }}
          title="Reset Box"
          className="w-12 h-12 rounded-[18px] bg-white shadow-clay-sm border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 active:scale-95 transition-all"
        >
          <RotateCcw className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      {/* Progress Dots */}
      <div className="flex items-center gap-2 mb-4">
        {MEMORY_BOX_ITEMS.map((item, idx) => (
          <div
            key={item.id}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              idx === currentIndex
                ? 'w-8 bg-[#0E8765]'
                : idx < currentIndex
                ? 'w-2.5 bg-emerald-300'
                : 'w-2.5 bg-slate-200'
            }`}
          />
        ))}
      </div>

      {/* Main Interactive Stage */}
      {!isBoxOpen ? (
        /* Closed Box View */
        <div className="w-full bg-white rounded-[32px] p-8 shadow-clay-card border border-white flex flex-col items-center text-center my-auto animate-fade-in">
          <div className="relative mb-6">
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-[32px] bg-gradient-to-br from-amber-100 via-emerald-50 to-teal-100 shadow-clay-card border-4 border-white flex items-center justify-center">
              <Package className="w-20 h-20 sm:w-24 sm:h-24 text-[#0E8765] animate-bounce" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-[#0E8765] text-white p-3 rounded-2xl shadow-clay-primary">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>

          <h2 className="text-3xl font-black text-slate-900 font-heading mb-2">
            📦 Rita's Memory Box
          </h2>
          <p className="text-slate-600 text-base font-semibold max-w-sm mb-6">
            Carefully curated by your family. Inside are 6 cherished treasures: family, childhood home, favourite songs, and celebrations.
          </p>

          <button
            onClick={handleOpenBox}
            className="w-full min-h-[64px] rounded-[24px] bg-[#0E8765] hover:bg-[#0B6D52] text-white font-black text-2xl font-heading shadow-clay-primary flex items-center justify-center gap-3 transition-all active:scale-98"
          >
            <span>Open Memory Box</span>
            <Sparkles className="w-6 h-6" />
          </button>
        </div>
      ) : (
        /* Open Memory Card View */
        <div className="w-full flex flex-col gap-4 animate-fade-in">
          <ClayCard className="p-5 sm:p-6 overflow-hidden">
            {/* Category Pill & Voice Read */}
            <div className="flex items-center justify-between mb-3">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-[#0E8765] font-black text-xs uppercase tracking-wider">
                {currentItem.tag}
              </span>
              <button
                onClick={() => handleSpeak(
                  `${currentItem.title}. ${currentItem.subtitle}. ${currentItem.story}`,
                  currentItem.audioPromptHindi
                )}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-[#0E8765] transition-colors text-xs font-bold"
              >
                <Volume2 className="w-4 h-4 text-[#0E8765]" />
                <span>Listen (सुनें)</span>
              </button>
            </div>

            {/* Realistic Image */}
            <div className="relative w-full h-56 sm:h-64 rounded-[24px] overflow-hidden mb-4 shadow-clay-sm border-2 border-white">
              <img
                src={currentItem.image}
                alt={currentItem.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                <div className="text-white text-left">
                  <h3 className="text-2xl font-black font-heading leading-tight drop-shadow-md">
                    {currentItem.title}
                  </h3>
                  <p className="text-sm font-semibold text-emerald-200 drop-shadow">
                    {currentItem.subtitle}
                  </p>
                </div>
              </div>
            </div>

            {/* Story / Context Display when 'Tell me about it' is clicked */}
            {selectedResponse === 'tell_me' && (
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 mb-4 animate-fade-in text-left">
                <div className="flex items-center gap-2 text-indigo-700 font-black text-sm mb-1">
                  <BookOpen className="w-4 h-4" />
                  <span>Story from Family:</span>
                </div>
                <p className="text-slate-700 text-sm font-semibold leading-relaxed">
                  {currentItem.story}
                </p>
              </div>
            )}

            {/* Gentle Reassurance when 'I am not sure' is clicked */}
            {selectedResponse === 'not_sure' && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 mb-4 animate-fade-in text-left flex items-start gap-3">
                <Heart className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-amber-800 text-sm">It’s completely okay</h4>
                  <p className="text-amber-700 text-xs font-semibold mt-0.5">
                    There is no test or pressure here. Just take in the colors and warmth. We are together.
                  </p>
                </div>
              </div>
            )}

            {/* Voice Reflection when 'I remember' is clicked */}
            {selectedResponse === 'remember' && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 mb-4 animate-fade-in text-left">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-[#0E8765]" />
                    <span>Wonderful feeling!</span>
                  </div>
                  <button
                    onClick={handleRecordFeeling}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black shadow-sm transition-all ${
                      isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-white text-[#0E8765] border border-emerald-300 hover:bg-emerald-100'
                    }`}
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>{isRecording ? 'Recording...' : 'Add Voice Note'}</span>
                  </button>
                </div>
                {recordedFeelings[currentIndex] && (
                  <p className="text-xs font-bold text-emerald-700 mt-2 italic">
                    {recordedFeelings[currentIndex]}
                  </p>
                )}
              </div>
            )}

            {/* The 3 Signature Buttons */}
            <div className="flex flex-col sm:flex-row gap-2.5 mt-2">
              {/* 1. I Remember */}
              <button
                onClick={() => handleResponse('remember')}
                className={`flex-1 min-h-[58px] rounded-[20px] font-black text-base font-heading flex items-center justify-center gap-2 transition-all active:scale-95 ${
                  selectedResponse === 'remember'
                    ? 'bg-[#0E8765] text-white shadow-clay-primary ring-4 ring-emerald-300/40'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border-2 border-emerald-200'
                }`}
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>I Remember</span>
              </button>

              {/* 2. Tell Me About It */}
              <button
                onClick={() => handleResponse('tell_me')}
                className={`flex-1 min-h-[58px] rounded-[20px] font-black text-base font-heading flex items-center justify-center gap-2 transition-all active:scale-95 ${
                  selectedResponse === 'tell_me'
                    ? 'bg-indigo-600 text-white shadow-clay-card ring-4 ring-indigo-300/40'
                    : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100 border-2 border-indigo-200'
                }`}
              >
                <BookOpen className="w-5 h-5" />
                <span>Tell Me About It</span>
              </button>

              {/* 3. I'm Not Sure */}
              <button
                onClick={() => handleResponse('not_sure')}
                className={`flex-1 min-h-[58px] rounded-[20px] font-black text-base font-heading flex items-center justify-center gap-2 transition-all active:scale-95 ${
                  selectedResponse === 'not_sure'
                    ? 'bg-amber-600 text-white shadow-clay-card ring-4 ring-amber-300/40'
                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border-2 border-amber-200'
                }`}
              >
                <HelpCircle className="w-5 h-5" />
                <span>I'm Not Sure</span>
              </button>
            </div>
          </ClayCard>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`flex-1 min-h-[52px] rounded-[20px] font-bold text-sm flex items-center justify-center gap-2 bg-white shadow-clay-sm border border-slate-200 ${
                currentIndex === 0 ? 'opacity-40 cursor-not-allowed text-slate-400' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous Memory</span>
            </button>

            <button
              onClick={handleNext}
              className="flex-1 min-h-[52px] rounded-[20px] font-black text-base font-heading flex items-center justify-center gap-2 bg-[#0E8765] hover:bg-[#0B6D52] text-white shadow-clay-primary active:scale-98 transition-all"
            >
              <span>{currentIndex === MEMORY_BOX_ITEMS.length - 1 ? 'Finish Box 🌟' : 'Next Treasure'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoryBoxGamePage;
