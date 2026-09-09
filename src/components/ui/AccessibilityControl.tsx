import React, { useState } from 'react';
import { Eye, Volume2, VolumeX, Type, Languages, Settings } from 'lucide-react';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { SUPPORTED_LANGUAGES } from '../../locales/languages';
import { SupportedLanguage } from '../../types';

export const AccessibilityControl: React.FC = () => {
  const { settings, toggleHighContrast, toggleVoice, setTextSize, setPatientLanguage, setCaregiverLanguage } = useAccessibility();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="relative inline-block text-left z-40">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="clay-btn-neutral p-3 rounded-full shadow-clay-btn flex items-center justify-center gap-2 text-slate-700 hover:text-[#6C63FF] focus:outline-none focus:ring-4 focus:ring-[#6C63FF]/30"
        aria-label="Accessibility & Language options"
        title="Accessibility & Language options"
      >
        <Settings className="w-6 h-6 text-[#6C63FF]" />
        <span className="text-xs font-black uppercase tracking-wider hidden sm:inline">Options</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 clay-panel p-5 shadow-2xl z-50 flex flex-col gap-4 border-2 border-white animate-scale-up max-h-[85vh] overflow-y-auto">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h4 className="font-extrabold text-slate-800 text-base flex items-center gap-2 font-heading">
              <Eye className="w-5 h-5 text-[#6C63FF]" />
              Accessibility & Speech
            </h4>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-xs font-bold text-slate-400 hover:text-slate-600"
            >
              Close
            </button>
          </div>

          {/* High Contrast */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-700">High Contrast</span>
            <button
              onClick={toggleHighContrast}
              className={`px-3 py-1.5 rounded-full text-xs font-black transition-colors ${
                settings.contrast === 'HIGH' ? 'bg-amber-500 text-white shadow-sm' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {settings.contrast === 'HIGH' ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Voice Prompt Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
              {settings.voiceEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
              Read Prompts Aloud
            </span>
            <button
              onClick={toggleVoice}
              className={`px-3 py-1.5 rounded-full text-xs font-black transition-colors ${
                settings.voiceEnabled ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {settings.voiceEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Text Size */}
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
              <Type className="w-4 h-4 text-[#6C63FF]" />
              Text Size
            </span>
            <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-2xl">
              {(['NORMAL', 'LARGE', 'XLARGE'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => setTextSize(size)}
                  className={`py-1.5 rounded-xl text-xs font-black transition-all ${
                    settings.textSize === size ? 'bg-white text-[#6C63FF] shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {size === 'NORMAL' ? 'Normal' : size === 'LARGE' ? 'Large' : 'X-Large'}
                </button>
              ))}
            </div>
          </div>

          {/* Patient Preferred Language */}
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-bold text-slate-700 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Languages className="w-4 h-4 text-teal-600" />
                Patient Language
              </span>
              <span className="text-[10px] font-black uppercase text-[#6C63FF] bg-[#6C63FF]/10 px-2 py-0.5 rounded-full">
                Independent
              </span>
            </span>
            <select
              value={settings.language}
              onChange={(e) => setPatientLanguage(e.target.value as SupportedLanguage)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name} — {lang.nativeName}
                </option>
              ))}
            </select>
          </div>

          {/* Caregiver Preferred Language */}
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-bold text-slate-700 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Languages className="w-4 h-4 text-indigo-600" />
                Caregiver Language
              </span>
            </span>
            <select
              value={settings.caregiverLanguage || 'en'}
              onChange={(e) => setCaregiverLanguage(e.target.value as SupportedLanguage)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name} — {lang.nativeName}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};
