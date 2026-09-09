import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Gamepad2, 
  Image, 
  Mic, 
  CalendarHeart, 
  Sparkles, 
  Heart, 
  BellRing, 
  ArrowRight, 
  AlertOctagon, 
  Phone,
  Music,
  MapPin,
  Flame,
  Globe
} from 'lucide-react';
import { ClayCard } from '../../components/ui/ClayCard';
import { ClayButton } from '../../components/ui/ClayButton';
import { VoiceButton } from '../../components/ui/VoiceButton';
import { SOSModal } from '../../components/common/SOSModal';
import { db } from '../../services/db';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { PatientProfile } from '../../types';

export const PatientHome: React.FC = () => {
  const navigate = useNavigate();
  const [patient, setPatient] = useState<PatientProfile>(db.getPatientProfile());
  const [isSOSOpen, setIsSOSOpen] = useState<boolean>(false);
  const { settings } = useAccessibility();

  useEffect(() => {
    return db.subscribe(() => {
      setPatient(db.getPatientProfile());
    });
  }, []);

  const welcomePrompt = `Hello, ${patient.preferredName || patient.name}. Welcome back to MindNest.`;

  return (
    <div className="min-h-screen bg-[#F4F7FB] pb-32 pt-4 px-4 sm:px-6 max-w-2xl mx-auto flex flex-col gap-4">
      {/* Friendly Top Welcome Card matching MindNest Design Language */}
      <div className="bg-white rounded-[30px] p-5 shadow-clay-card border border-white relative overflow-hidden">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <img
                src={patient.profilePhotoUrl}
                alt={patient.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-3 border-[#0E8765] shadow-md"
              />
              <div className="absolute -bottom-1 -right-1 bg-[#0E8765] text-white p-1 rounded-full shadow-md">
                <Heart className="w-4 h-4 fill-white" />
              </div>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] font-black text-[#0E8765] uppercase tracking-wider font-heading">
                MindNest Memory Companion
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
                Hello, {patient.preferredName || patient.name}
              </h1>
              <p className="text-sm font-bold text-slate-500">
                Nagaon, Assam • Today is peaceful
              </p>
            </div>
          </div>

          <VoiceButton textToSpeak={welcomePrompt} label="Read" size="md" />
        </div>
      </div>

      {/* Prominent High-Contrast Patient SOS Emergency Button */}
      <div 
        onClick={() => setIsSOSOpen(true)}
        className="w-full min-h-[66px] p-4 sm:p-5 rounded-[26px] bg-rose-600 hover:bg-rose-700 active:scale-98 text-white shadow-lg shadow-rose-600/25 flex items-center justify-between gap-3 cursor-pointer transition-all border-2 border-rose-400"
        role="button"
        aria-label="Emergency Help SOS"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white text-rose-600 flex items-center justify-center shrink-0 shadow-sm">
            <AlertOctagon className="w-8 h-8 stroke-[2.5]" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-black uppercase tracking-wider text-rose-200">
              Immediate Assistance
            </span>
            <span className="text-xl sm:text-2xl font-black font-heading tracking-wide">
              SOS — Emergency Help
            </span>
          </div>
        </div>

        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
          <Phone className="w-5 h-5" />
        </div>
      </div>

      {/* Today's Gentle Activity Card */}
      <div className="bg-[#E6F5EF] border border-[#0E8765]/30 rounded-[28px] p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-clay-sm">
        <div className="flex items-center gap-3.5 text-center sm:text-left">
          <div className="w-12 h-12 rounded-2xl bg-[#0E8765] text-white flex items-center justify-center shrink-0 shadow-clay-primary">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-[#0E8765]">
              Today's Familiar Activity
            </span>
            <h2 className="text-lg sm:text-xl font-black text-slate-800 font-heading">
              "Let's look at 7 familiar family photos."
            </h2>
          </div>
        </div>

        <button
          onClick={() => navigate('/patient/match-people')}
          className="w-full sm:w-auto px-6 py-3.5 rounded-[22px] bg-[#0E8765] hover:bg-[#0B6D52] active:scale-95 text-white font-black text-base font-heading shadow-clay-primary flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
        >
          <span>Start Activity</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Gentle Next Routine Banner */}
      <div className="bg-amber-50 border border-amber-200/80 rounded-[24px] p-3.5 sm:p-4 flex items-center gap-3 shadow-sm">
        <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
          <BellRing className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase text-amber-700">Next Routine</span>
          <span className="text-sm sm:text-base font-extrabold text-slate-800">
            Evening family call with Sunita from Tezpur at 6:30 PM
          </span>
        </div>
      </div>

      {/* 4 Primary Action Touch Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-1">
        <Link to="/patient/memories">
          <div className="bg-white rounded-[26px] p-5 shadow-clay-card border border-white flex flex-col items-center text-center justify-center gap-3 min-h-[140px] hover:-translate-y-1 transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#0E8765] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <Image className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-800 font-heading">
                Memories
              </h3>
              <p className="text-xs font-bold text-slate-400 mt-0.5">
                Approved photo library
              </p>
            </div>
          </div>
        </Link>

        <Link to="/patient/memory-lane">
          <div className="bg-white rounded-[26px] p-5 shadow-clay-card border border-white flex flex-col items-center text-center justify-center gap-3 min-h-[140px] hover:-translate-y-1 transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-[#E6F0FA] text-blue-700 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-800 font-heading">
                Memory Lane
              </h3>
              <p className="text-xs font-bold text-slate-400 mt-0.5">
                Village house & talk
              </p>
            </div>
          </div>
        </Link>

        <Link to="/patient/match-people">
          <div className="bg-white rounded-[26px] p-5 shadow-clay-card border border-white flex flex-col items-center text-center justify-center gap-3 min-h-[140px] hover:-translate-y-1 transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <Gamepad2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-800 font-heading">
                Games
              </h3>
              <p className="text-xs font-bold text-slate-400 mt-0.5">
                Match the people
              </p>
            </div>
          </div>
        </Link>

        <Link to="/patient/voice">
          <div className="bg-white rounded-[26px] p-5 shadow-clay-card border border-white flex flex-col items-center text-center justify-center gap-3 min-h-[140px] hover:-translate-y-1 transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <Mic className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-800 font-heading">
                Talk
              </h3>
              <p className="text-xs font-bold text-slate-400 mt-0.5">
                Assamese voice companion
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Cultural Features Quick Strip */}
      <div className="grid grid-cols-4 gap-2 pt-1">
        <Link
          to="/patient/music"
          className="bg-white p-3 rounded-[20px] shadow-clay-sm border border-white flex flex-col items-center text-center gap-1 hover:bg-slate-50 transition-all"
        >
          <Music className="w-5 h-5 text-purple-600" />
          <span className="text-[11px] font-black text-slate-700 font-heading">Music</span>
        </Link>

        <Link
          to="/patient/festivals"
          className="bg-white p-3 rounded-[20px] shadow-clay-sm border border-white flex flex-col items-center text-center gap-1 hover:bg-slate-50 transition-all"
        >
          <Flame className="w-5 h-5 text-pink-600" />
          <span className="text-[11px] font-black text-slate-700 font-heading">Festivals</span>
        </Link>

        <Link
          to="/patient/places"
          className="bg-white p-3 rounded-[20px] shadow-clay-sm border border-white flex flex-col items-center text-center gap-1 hover:bg-slate-50 transition-all"
        >
          <MapPin className="w-5 h-5 text-teal-600" />
          <span className="text-[11px] font-black text-slate-700 font-heading">Places</span>
        </Link>

        <Link
          to="/patient/tasks"
          className="bg-white p-3 rounded-[20px] shadow-clay-sm border border-white flex flex-col items-center text-center gap-1 hover:bg-slate-50 transition-all"
        >
          <CalendarHeart className="w-5 h-5 text-amber-600" />
          <span className="text-[11px] font-black text-slate-700 font-heading">Tasks</span>
        </Link>
      </div>

      {/* SOS Modal */}
      <SOSModal
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
      />
    </div>
  );
};
