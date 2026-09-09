import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Globe, Volume2, Type, Contrast, Check, ChevronDown } from 'lucide-react';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { SupportedLanguage } from '../../types';

const APP_LANGUAGES = [
  { code: 'hi' as SupportedLanguage, label: 'हिंदी', sublabel: 'Hindi', flag: '🇮🇳', color: 'from-orange-400 to-green-500' },
  { code: 'en' as SupportedLanguage, label: 'English', sublabel: 'English', flag: '🇬🇧', color: 'from-blue-500 to-blue-700' },
  { code: 'as' as SupportedLanguage, label: 'অসমীয়া', sublabel: 'Assamese', flag: '🌿', color: 'from-emerald-400 to-teal-600' },
  { code: 'bn' as SupportedLanguage, label: 'বাংলা', sublabel: 'Bengali', flag: '🟢', color: 'from-green-500 to-red-500' },
  { code: 'ta' as SupportedLanguage, label: 'தமிழ்', sublabel: 'Tamil', flag: '🎨', color: 'from-purple-500 to-pink-500' },
];

const UI_STRINGS: Record<string, Record<string, string>> = {
  hi:  { title: 'सेटिंग्स', langSection: 'भाषा चुनें', accessSection: 'पहुँच सुविधाएँ', voice: 'आवाज़ संकेत', largeText: 'बड़ा अक्षर', contrast: 'उच्च कंट्रास्ट', save: 'सहेजें', saved: 'सहेजा ✓' },
  en:  { title: 'Settings', langSection: 'Choose Language', accessSection: 'Accessibility', voice: 'Voice Prompts', largeText: 'Larger Text', contrast: 'High Contrast', save: 'Save', saved: 'Saved ✓' },
  as:  { title: 'ছেটিং', langSection: 'ভাষা বাছক', accessSection: 'সুগম্যতা', voice: 'কণ্ঠ সংকেত', largeText: 'ডাঙৰ আখৰ', contrast: 'উচ্চ কনট্ৰাষ্ট', save: 'ৰাখক', saved: 'ৰাখা হৈছে ✓' },
  bn:  { title: 'সেটিংস', langSection: 'ভাষা বেছুন', accessSection: 'অ্যাক্সেসিবিলিটি', voice: 'ভয়েস প্রম্পট', largeText: 'বড় টেক্সট', contrast: 'হাই কনট্রাস্ট', save: 'সংরক্ষণ', saved: 'সংরক্ষিত ✓' },
  ta:  { title: 'அமைப்புகள்', langSection: 'மொழி தேர்ந்தெடு', accessSection: 'அணுகல்', voice: 'குரல் வழிகாட்டி', largeText: 'பெரிய எழுத்து', contrast: 'அதிக வேறுபாடு', save: 'சேமி', saved: 'சேமிக்கப்பட்டது ✓' },
};

export const PatientSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { settings, updateSettings } = useAccessibility();

  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>(settings.language || 'hi');
  const [voicePrompts, setVoicePrompts] = useState(settings.voiceEnabled);
  const [largerText, setLargerText] = useState(settings.textSize === 'LARGE' || settings.textSize === 'XLARGE');
  const [highContrast, setHighContrast] = useState(settings.contrast === 'HIGH');
  const [savedMessage, setSavedMessage] = useState(false);

  const t = UI_STRINGS[selectedLang] || UI_STRINGS['en'];

  const handleLangSelect = (code: SupportedLanguage) => {
    setSelectedLang(code);
    updateSettings({ language: code });
  };

  const handleSave = () => {
    updateSettings({
      language: selectedLang,
      voiceEnabled: voicePrompts,
      textSize: largerText ? 'LARGE' : 'NORMAL',
      contrast: highContrast ? 'HIGH' : 'NORMAL'
    });
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] pb-24 pt-3 px-4 max-w-md mx-auto flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between py-2">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white shadow-clay-sm flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-all"
          aria-label="Go Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h1 className="text-xl font-black text-slate-800 font-heading">{t.title}</h1>

        <button
          onClick={handleSave}
          className="text-xs font-black text-[#0E8765] bg-[#E6F5EF] px-3.5 py-1.5 rounded-full"
        >
          {savedMessage ? t.saved : t.save}
        </button>
      </div>

      {/* Language Section — Big Tap Cards */}
      <div className="bg-white rounded-[28px] p-5 shadow-clay-card border border-white flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-[#0E8765]" />
          <h2 className="text-base font-black text-slate-900 font-heading">{t.langSection}</h2>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {APP_LANGUAGES.map(lang => {
            const isActive = selectedLang === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => handleLangSelect(lang.code)}
                className={`relative flex flex-col items-center justify-center gap-1.5 p-3.5 rounded-[20px] border-2 font-black transition-all active:scale-95 cursor-pointer ${
                  isActive
                    ? 'border-[#0E8765] bg-[#E6F5EF] shadow-md'
                    : 'border-slate-100 bg-[#F4F7FB] hover:border-[#0E8765]/40'
                }`}
              >
                {isActive && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#0E8765] flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  </div>
                )}
                <span className="text-2xl">{lang.flag}</span>
                <span className={`text-base font-black font-heading ${isActive ? 'text-[#0E8765]' : 'text-slate-800'}`}>
                  {lang.label}
                </span>
                <span className="text-[10px] font-bold text-slate-400">{lang.sublabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Accessibility Section */}
      <div className="bg-white rounded-[28px] p-5 shadow-clay-card border border-white flex flex-col gap-4">
        <h2 className="text-base font-black text-slate-900 font-heading">{t.accessSection}</h2>

        {/* Voice Prompts */}
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#E6F5EF] text-[#0E8765] flex items-center justify-center">
              <Volume2 className="w-5 h-5" />
            </div>
            <span className="text-sm font-black text-slate-800">{t.voice}</span>
          </div>
          <button
            onClick={() => { setVoicePrompts(v => !v); updateSettings({ voiceEnabled: !voicePrompts }); }}
            className={`w-14 h-8 rounded-full p-1 transition-colors cursor-pointer ${voicePrompts ? 'bg-[#0E8765]' : 'bg-slate-200'}`}
          >
            <div className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${voicePrompts ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>

        {/* Larger Text */}
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Type className="w-5 h-5" />
            </div>
            <span className="text-sm font-black text-slate-800">{t.largeText}</span>
          </div>
          <button
            onClick={() => { setLargerText(v => !v); updateSettings({ textSize: !largerText ? 'LARGE' : 'NORMAL' }); }}
            className={`w-14 h-8 rounded-full p-1 transition-colors cursor-pointer ${largerText ? 'bg-[#0E8765]' : 'bg-slate-200'}`}
          >
            <div className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${largerText ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>

        {/* High Contrast */}
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Contrast className="w-5 h-5" />
            </div>
            <span className="text-sm font-black text-slate-800">{t.contrast}</span>
          </div>
          <button
            onClick={() => { setHighContrast(v => !v); updateSettings({ contrast: !highContrast ? 'HIGH' : 'NORMAL' }); }}
            className={`w-14 h-8 rounded-full p-1 transition-colors cursor-pointer ${highContrast ? 'bg-[#0E8765]' : 'bg-slate-200'}`}
          >
            <div className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${highContrast ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>

      <div className="text-center pt-1">
        <span className="text-xs text-slate-400 font-semibold">
          MindNest • Accessibility Engine
        </span>
      </div>
    </div>
  );
};

export default PatientSettingsPage;
