import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Image, Music, Users, MapPin, BookOpen, Volume2, Sparkles, Film, Play, Pause } from 'lucide-react';
import { db } from '../../services/db';
import { MemoryItem } from '../../types';

export const PatientMemoryLibraryPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Photos' | 'Videos' | 'Music' | 'People' | 'Stories'>('All');
  const [memories, setMemories] = useState<MemoryItem[]>(db.getApprovedMemories());
  const [activeMemory, setActiveMemory] = useState<MemoryItem | null>(null);
  const [isPlayingStoryVoice, setIsPlayingStoryVoice] = useState(false);

  useEffect(() => {
    return db.subscribe(() => {
      setMemories(db.getApprovedMemories());
    });
  }, []);

  const filterButtons = [
    { key: 'All', label: 'All Items', icon: Sparkles },
    { key: 'Photos', label: 'Photos', icon: Image },
    { key: 'Videos', label: 'Short Videos', icon: Film },
    { key: 'Stories', label: 'Stories', icon: BookOpen },
    { key: 'Music', label: 'Music', icon: Music },
    { key: 'People', label: 'People', icon: Users },
  ] as const;

  const filteredMemories = memories.filter((mem) => {
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Photos') return mem.category === 'Family Photo' || (!mem.mediaType || mem.mediaType === 'image');
    if (selectedFilter === 'Videos') return mem.mediaType === 'video' || mem.category === 'Family Video';
    if (selectedFilter === 'Stories') return Boolean(mem.associatedStory) || mem.category === 'Story';
    if (selectedFilter === 'Music') return Boolean(mem.associatedMusic) || mem.category === 'Music';
    if (selectedFilter === 'People') return mem.people && mem.people.length > 0;
    return true;
  });

  const speakStory = (storyText: string, title: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const textToRead = `${title}. ${storyText}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.88;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsPlayingStoryVoice(true);
      utterance.onend = () => setIsPlayingStoryVoice(false);
      utterance.onerror = () => setIsPlayingStoryVoice(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] pb-32 pt-3 px-3 sm:px-6 max-w-lg mx-auto flex flex-col">
      {/* Top Header */}
      <div className="flex items-center justify-between py-3 mb-2">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white shadow-clay-sm flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-all active:scale-95"
          aria-label="Go Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h1 className="text-xl font-black text-slate-800 font-heading">
          Memory Library
        </h1>

        <button
          onClick={() => navigate('/caregiver/memories/new')}
          className="text-xs font-black text-[#0E8765] hover:text-white bg-[#E6F5EF] hover:bg-[#0E8765] px-3.5 py-1.5 rounded-full border border-[#0E8765]/20 flex items-center gap-1 transition-all"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>Add New</span>
        </button>
      </div>

      {/* Filter Horizontal Scroll */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none mb-4">
        {filterButtons.map((f) => {
          const Icon = f.icon;
          const isActive = selectedFilter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setSelectedFilter(f.key)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-[20px] text-xs font-black transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-[#0E8765] text-white shadow-clay-primary scale-102'
                  : 'bg-white text-slate-600 hover:bg-slate-100 shadow-clay-sm border border-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{f.label}</span>
            </button>
          );
        })}
      </div>

      {/* 2x2 Grid of Memories */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {filteredMemories.map((mem) => {
          const isVideo = mem.mediaType === 'video' || mem.category === 'Family Video';

          return (
            <div
              key={mem.id}
              onClick={() => setActiveMemory(mem)}
              className="bg-white rounded-[24px] p-2.5 sm:p-3 shadow-clay-card border border-white flex flex-col gap-2 cursor-pointer hover:-translate-y-1 transition-all group relative"
            >
              {/* Photo / Video Container */}
              <div className="w-full aspect-[4/3] rounded-[18px] overflow-hidden bg-slate-100 relative">
                <img
                  src={mem.imageUrl || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80'}
                  alt={mem.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Video Indicator Pill */}
                {isVideo && (
                  <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                    <Play className="w-2.5 h-2.5 fill-white" />
                    <span>Clip</span>
                  </div>
                )}
              </div>

              {/* Title & Badge */}
              <div className="flex flex-col px-1">
                <span className="text-sm sm:text-base font-black text-slate-900 font-heading truncate">
                  {mem.title}
                </span>

                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`w-2 h-2 rounded-full ${
                    isVideo ? 'bg-indigo-500' :
                    mem.category === 'Place' ? 'bg-teal-500' :
                    mem.category === 'Event' ? 'bg-rose-500' : 'bg-[#0E8765]'
                  }`} />
                  <span className="text-[11px] font-bold text-slate-500 truncate">
                    {isVideo ? 'Short Video Clip' : mem.place || mem.category}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Detail Modal with Video Player & Speech */}
      {activeMemory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[32px] max-w-sm w-full p-5 shadow-2xl flex flex-col gap-3.5 max-h-[90vh] overflow-y-auto">
            {/* Media Player */}
            {activeMemory.mediaType === 'video' ? (
              <div className="w-full h-52 rounded-[22px] overflow-hidden bg-black relative shadow-md">
                <video
                  src={activeMemory.mediaUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'}
                  controls
                  autoPlay
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <img
                src={activeMemory.imageUrl}
                alt={activeMemory.title}
                className="w-full h-48 rounded-[22px] object-cover shadow-md"
              />
            )}

            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-[#0E8765]">
                  {activeMemory.dateApproximation || 'Cherished Memory'}
                </span>
                {activeMemory.associatedStory && (
                  <button
                    onClick={() => speakStory(activeMemory.associatedStory || '', activeMemory.title)}
                    className={`flex items-center gap-1 text-xs font-black px-3 py-1 rounded-full ${
                      isPlayingStoryVoice ? 'bg-emerald-500 text-white animate-pulse' : 'bg-emerald-50 text-[#0E8765] hover:bg-emerald-100'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{isPlayingStoryVoice ? 'Listening...' : 'Listen (सुनें)'}</span>
                  </button>
                )}
              </div>

              <h3 className="text-2xl font-black text-slate-800 font-heading mt-1">
                {activeMemory.title}
              </h3>
              <p className="text-sm font-semibold text-slate-600 mt-2 leading-relaxed">
                {activeMemory.description}
              </p>

              {activeMemory.associatedStory && (
                <div className="bg-[#E6F5EF] p-3.5 rounded-2xl mt-3 text-xs font-bold text-[#0E8765] leading-relaxed border border-emerald-100">
                  <span className="block font-black text-emerald-900 mb-0.5">Family Story:</span>
                  "{activeMemory.associatedStory}"
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  setActiveMemory(null);
                  navigate('/patient/memory-lane');
                }}
                className="flex-1 py-3 rounded-2xl bg-[#0E8765] text-white font-black text-sm font-heading shadow-clay-primary hover:bg-[#0B6D52] transition-all"
              >
                Memory Lane
              </button>
              <button
                onClick={() => {
                  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                  setActiveMemory(null);
                }}
                className="py-3 px-5 rounded-2xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientMemoryLibraryPage;
