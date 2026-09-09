import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Heart, ShieldCheck, Phone, CheckCircle2 } from 'lucide-react';
import { ClayCard } from '../components/ui/ClayCard';
import { useAuth } from '../contexts/AuthContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAsDemo } = useAuth();

  const handleGetStarted = () => {
    loginAsDemo('PATIENT');
    navigate('/patient/home');
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] text-slate-800 flex flex-col items-center justify-center p-4 sm:p-6 md:p-10">
      {/* Central Screen 1: Splash / Welcome Card Container */}
      <div className="w-full max-w-md bg-white rounded-[32px] shadow-clay-card border border-white/90 overflow-hidden flex flex-col animate-fade-in relative">
        {/* Scenic Northeast India Landscape Section */}
        <div className="relative h-72 w-full overflow-hidden bg-emerald-950">
          <img
            src="/images/location_tea_garden.jpg"
            alt="Scenic Indian tea gardens and hills"
            className="w-full h-full object-cover object-center brightness-95 scale-105 transition-transform duration-700 hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
          
          {/* Top Brand Pill */}
          <div className="absolute top-5 left-0 right-0 flex justify-center">
            <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full shadow-sm border border-white/80">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0E8765] animate-pulse" />
              <span className="text-xs font-black text-[#0E8765] tracking-wider uppercase font-heading">
                NER Focused Edition
              </span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="px-6 sm:px-8 pb-8 pt-2 flex flex-col items-center text-center -mt-8 relative z-10">
          {/* MindNest Leaf/Heart Logo Icon */}
          <div className="w-16 h-16 rounded-[22px] bg-[#0E8765] shadow-clay-primary flex items-center justify-center text-white mb-4 border-2 border-white">
            <svg className="w-9 h-9 fill-white" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>

          {/* MindNest Title */}
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight font-heading">
            MindNest
          </h1>
          <p className="text-sm font-bold text-slate-500 mt-1 mb-5">
            Your Memory Companion
          </p>

          {/* Core Message Pill / Heading */}
          <div className="mb-2">
            <h2 className="text-2xl sm:text-3xl font-black text-[#0E8765] font-heading tracking-wide leading-snug">
              Remember • Engage • Belong
            </h2>
          </div>

          <p className="text-base font-semibold text-slate-600 max-w-xs leading-relaxed mb-8">
            Personalized cognitive and cultural support for a brighter tomorrow.
          </p>

          {/* Large Teal CTA Button matching Screen 1 */}
          <button
            onClick={handleGetStarted}
            className="w-full min-h-[62px] rounded-[24px] bg-[#0E8765] hover:bg-[#0B6D52] active:scale-98 text-white font-black text-xl font-heading shadow-clay-primary flex items-center justify-center gap-3 transition-all duration-150 group cursor-pointer"
          >
            <span>Get Started</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Footer note from Screen 1 */}
          <p className="text-xs font-bold text-slate-400 mt-5 tracking-wide">
            For a better tomorrow | AI Memory Companion
          </p>
        </div>
      </div>

      {/* Quick Role & Mode Switcher Bar */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3 max-w-md w-full">
        <button
          onClick={() => {
            loginAsDemo('PATIENT');
            navigate('/patient/home');
          }}
          className="flex-1 min-w-[140px] px-4 py-3 rounded-2xl bg-white shadow-clay-sm border border-slate-200 text-center text-xs font-extrabold text-[#0E8765] hover:bg-[#E6F5EF] transition-all flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-[#0E8765]" />
          <span>Patient Portal 🌸</span>
        </button>

        <button
          onClick={() => {
            loginAsDemo('CAREGIVER');
            navigate('/caregiver/dashboard');
          }}
          className="flex-1 min-w-[140px] px-4 py-3 rounded-2xl bg-white shadow-clay-sm border border-slate-200 text-center text-xs font-extrabold text-slate-700 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
        >
          <span>Caregiver Portal 👨‍👩‍👧</span>
        </button>
      </div>
    </div>
  );
};
