import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Image, Sparkles, Users, Package, Calendar, Play } from 'lucide-react';
import { ClayCard } from '../../components/ui/ClayCard';

export const ActivitySelectionPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F4F7FB] pb-28 pt-4 px-4 md:px-8 max-w-3xl mx-auto flex flex-col gap-5">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/patient/home')}
          className="w-12 h-12 rounded-[18px] bg-white shadow-clay-sm border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 active:scale-95 transition-all"
        >
          <ArrowLeft className="w-6 h-6 text-[#0E8765]" />
        </button>

        <h1 className="text-2xl md:text-3xl font-black text-slate-900 font-heading">
          Gentle Activities & Games
        </h1>

        <div className="w-12" />
      </div>

      <p className="text-base font-bold text-slate-500 text-center -mt-2">
        Therapeutic, low-stress games to celebrate memories and spark joy.
      </p>

      {/* Signature Feature: My Memory Box */}
      <div 
        onClick={() => navigate('/patient/memory-box')}
        className="cursor-pointer bg-gradient-to-br from-emerald-50 via-white to-teal-50 rounded-[30px] p-6 shadow-clay-card border-2 border-[#0E8765]/30 hover:border-[#0E8765] transition-all transform hover:-translate-y-1 relative overflow-hidden group"
      >
        <div className="absolute top-3 right-4 bg-[#0E8765] text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Signature Feature</span>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-20 h-20 rounded-[24px] bg-[#0E8765] shadow-clay-primary text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Package className="w-10 h-10 animate-bounce" />
          </div>

          <div className="flex-1 pr-12">
            <h2 className="text-2xl font-black text-slate-900 font-heading flex items-center gap-2">
              <span>My Memory Box</span>
              <span className="text-lg">📦</span>
            </h2>
            <p className="text-sm font-bold text-[#0E8765] mt-0.5">
              Approved Family Treasures & Keepsakes
            </p>
            <p className="text-xs font-semibold text-slate-600 mt-2 leading-relaxed">
              Open your personalized box of 6 cherished memories: your son, childhood home, favourite song, and festivals. With 3 gentle choices: "I Remember", "Tell Me", or "I'm Not Sure".
            </p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <span className="w-2 h-2 rounded-full bg-[#0E8765]" />
            <span>Zero pressure • Reassuring voice audio</span>
          </div>
          <button className="px-5 py-2.5 rounded-2xl bg-[#0E8765] text-white font-black text-sm shadow-clay-primary flex items-center gap-1.5">
            <Play className="w-4 h-4 fill-white" />
            <span>Open Box</span>
          </button>
        </div>
      </div>

      {/* Other Distinct Games */}
      <div className="flex flex-col gap-3.5">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider px-1">
          More Cognitive Explorations
        </h3>

        {/* 1. 7-Photo Memory Quiz */}
        <div
          onClick={() => navigate('/patient/play?type=photo_recognition')}
          className="cursor-pointer bg-white rounded-[26px] p-5 shadow-clay-card border border-white hover:border-slate-300 transition-all flex items-center gap-4 group"
        >
          <div className="w-16 h-16 rounded-[22px] bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
            <Image className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h4 className="text-xl font-black text-slate-800 font-heading">
              7-Photo Cultural Quiz
            </h4>
            <p className="text-xs font-bold text-slate-500">
              7 authentic regional photo questions with 4 choices & warm Hindi voice guidance
            </p>
          </div>
          <button className="px-4 py-2 rounded-xl bg-slate-100 group-hover:bg-[#0E8765] group-hover:text-white text-slate-700 font-bold text-xs transition-colors">
            Play
          </button>
        </div>

        {/* 2. Match Family People */}
        <div
          onClick={() => navigate('/patient/match-people')}
          className="cursor-pointer bg-white rounded-[26px] p-5 shadow-clay-card border border-white hover:border-slate-300 transition-all flex items-center gap-4 group"
        >
          <div className="w-16 h-16 rounded-[22px] bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
            <Users className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h4 className="text-xl font-black text-slate-800 font-heading">
              Who is in the Family?
            </h4>
            <p className="text-xs font-bold text-slate-500">
              Recognize children, grandchildren, and dear lifelong friends
            </p>
          </div>
          <button className="px-4 py-2 rounded-xl bg-slate-100 group-hover:bg-[#0E8765] group-hover:text-white text-slate-700 font-bold text-xs transition-colors">
            Play
          </button>
        </div>

        {/* 3. Daily Routine Sequence */}
        <div
          onClick={() => navigate('/patient/journey')}
          className="cursor-pointer bg-white rounded-[26px] p-5 shadow-clay-card border border-white hover:border-slate-300 transition-all flex items-center gap-4 group"
        >
          <div className="w-16 h-16 rounded-[22px] bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
            <Calendar className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h4 className="text-xl font-black text-slate-800 font-heading">
              Routine & Journey Sequence
            </h4>
            <p className="text-xs font-bold text-slate-500">
              Arrange daily steps (Morning tea, Walking, Evening prayer) in soothing order
            </p>
          </div>
          <button className="px-4 py-2 rounded-xl bg-slate-100 group-hover:bg-[#0E8765] group-hover:text-white text-slate-700 font-bold text-xs transition-colors">
            Play
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivitySelectionPage;
