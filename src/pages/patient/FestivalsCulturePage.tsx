import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, MessageSquare, ChevronRight, Volume2 } from 'lucide-react';
import { sanitizeTextForSpeech } from '../../services/speechSanitizer';

export const FestivalsCulturePage: React.FC = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [storyOpen, setStoryOpen] = useState<boolean>(false);

  const festivalData = [
    {
      title: 'Bihu Celebration',
      description: 'This photo was taken during Bihu at our village. Who do you remember in this picture?',
      story: 'Bohag Bihu marks the Assamese New Year! The village gathered beneath the old banyan tree. Dhol, pepa horn, and gogona rhythms played all evening. Grandmother prepared sweet til pitha and hot Assam tea.',
      imageUrl: '/images/festival_bihu.jpg',
    },
    {
      title: 'Magh Bihu Harvest Feast',
      description: 'Building the Meji bamboo hut and warming up together around the early morning bonfire.',
      story: 'Everyone woke up before sunrise to light the Meji bonfire and share doi-chira with fresh jaggery.',
      imageUrl: '/images/festival_lohri.jpg',
    },
    {
      title: 'Tea Garden Festival',
      description: 'Celebrating the green harvest in the estate hills of Upper Assam.',
      story: 'The afternoon breeze through the tea bushes always brought singing and flute melodies across the hills.',
      imageUrl: '/images/location_tea_garden.jpg',
    }
  ];

  const current = festivalData[currentSlide];

  const handleTellMeMore = () => {
    setStoryOpen(true);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const clean = sanitizeTextForSpeech(current.story);
      const u = new SpeechSynthesisUtterance(clean);
      u.rate = 0.85;
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] pb-24 pt-3 px-4 max-w-md mx-auto flex flex-col justify-between">
      {/* Top Header matching Screen 7 */}
      <div className="flex items-center justify-between py-2">
        <button
          onClick={() => navigate('/patient/home')}
          className="w-10 h-10 rounded-full bg-white shadow-clay-sm flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-all"
          aria-label="Go Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-base font-black text-slate-800 font-heading">
            Festival Memories
          </span>
        </div>

        <div className="w-10" />
      </div>

      {/* Main Card Content matching Screen 7 */}
      <div className="flex flex-col gap-4 my-auto">
        {/* Large Bihu Dancers Photo */}
        <div className="w-full aspect-[4/3] rounded-[28px] overflow-hidden shadow-clay-card border-2 border-white bg-slate-200 relative">
          <img
            src={current.imageUrl}
            alt={current.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Festival Description */}
        <div className="flex flex-col gap-2 px-1">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
            {current.title}
          </h2>
          <p className="text-sm sm:text-base font-semibold text-slate-600 leading-relaxed">
            {current.description}
          </p>
        </div>

        {/* Tell Me More Button matching Screen 7 */}
        <button
          onClick={handleTellMeMore}
          className="w-full min-h-[58px] rounded-[24px] bg-[#0E8765] hover:bg-[#0B6D52] active:scale-98 text-white font-black text-base font-heading shadow-clay-primary flex items-center justify-center gap-2.5 transition-all cursor-pointer"
        >
          <MessageSquare className="w-5 h-5" />
          <span>Tell me more</span>
        </button>

        {/* Revealed Story Card */}
        {storyOpen && (
          <div className="bg-[#E6F5EF] border border-[#0E8765]/25 p-4 rounded-[22px] text-slate-800 text-sm font-semibold leading-relaxed animate-fade-in">
            {current.story}
          </div>
        )}

        {/* Carousel indicator dots matching Screen 7 */}
        <div className="flex items-center justify-center gap-2 pt-2">
          {festivalData.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentSlide(idx);
                setStoryOpen(false);
              }}
              className={`h-2.5 rounded-full transition-all cursor-pointer ${
                currentSlide === idx ? 'w-8 bg-[#0E8765]' : 'w-2.5 bg-slate-300'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
