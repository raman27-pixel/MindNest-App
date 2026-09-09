import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Globe, Volume2, Type, Contrast, ChevronDown, Check } from 'lucide-react';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { SupportedLanguage } from '../../types';

export const PatientSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { settings, updateSettings } = useAccessibility();

  const [patientLang, setPatientLang] = useState<SupportedLanguage>(settings.language || 'as');
  const [caregiverLang, setCaregiverLang] = useState<SupportedLanguage>(settings.caregiverLanguage || 'en');
  const [voicePrompts, setVoicePrompts] = useState<boolean>(settings.voiceEnabled);
  const [largerText, setLargerText] = useState<boolean>(settings.textSize === 'LARGE' || settings.textSize === 'XLARGE');
  const [highContrast, setHighContrast] = useState<boolean>(settings.contrast === 'HIGH');
  const [savedMessage, setSavedMessage] = useState<boolean>(false);

  const handleToggleVoice = () => {
    const next = !voicePrompts;
    setVoicePrompts(next);
    updateSettings({ voiceEnabled: next });
  };

  const handleToggleText = () => {
    const next = !largerText;
    setLargerText(next);
    updateSettings({ textSize: next ? 'LARGE' : 'NORMAL' });
  };

  const handleToggleContrast = () => {
    const next = !highContrast;
    setHighContrast(next);
    updateSettings({ contrast: next ? 'HIGH' : 'NORMAL' });
  };

  const handleSave = () => {
    updateSettings({
      language: patientLang,
      caregiverLanguage: caregiverLang,
      voiceEnabled: voicePrompts,
      textSize: largerText ? 'LARGE' : 'NORMAL',
      contrast: highContrast ? 'HIGH' : 'NORMAL'
    });
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] pb-24 pt-3 px-4 max-w-md mx-auto flex flex-col justify-between">
      {/* Top Header matching Screen 15 */}
      <div className="flex items-center justify-between py-2">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white shadow-clay-sm flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-all"
          aria-label="Go Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h1 className="text-xl font-black text-slate-800 font-heading">
          Settings
        </h1>

        <button
          onClick={handleSave}
          className="text-xs font-black text-[#0E8765] bg-[#E6F5EF] px-3.5 py-1.5 rounded-full"
        >
          {savedMessage ? 'Saved ✓' : 'Save'}
        </button>
      </div>

      {/* Main Settings Card Container */}
      <div className="flex flex-col gap-5 my-auto">
        {/* Language Preferences Section matching Screen 15 */}
        <div className="bg-white rounded-[28px] p-5 shadow-clay-card border border-white flex flex-col gap-4">
          <h2 className="text-base font-black text-slate-900 font-heading">
            Language Preferences
          </h2>

          {/* Patient's Language */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400">
              Patient's Language
            </label>
            <div className="relative">
              <select
                value={patientLang}
                onChange={(e) => setPatientLang(e.target.value as SupportedLanguage)}
                className="w-full bg-[#F4F7FB] border border-slate-200/80 rounded-[20px] p-3.5 text-sm font-black text-slate-800 focus:outline-none appearance-none cursor-pointer"
              >
                <option value="as">Assamese</option>
                <option value="hi">Hindi</option>
                <option value="en">English</option>
                <option value="bn">Bengali</option>
                <option value="brx">Bodo</option>
                <option value="mni">Manipuri / Meitei</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Caregiver's Language */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400">
              Caregiver's Language
            </label>
            <div className="relative">
              <select
                value={caregiverLang}
                onChange={(e) => setCaregiverLang(e.target.value as SupportedLanguage)}
                className="w-full bg-[#F4F7FB] border border-slate-200/80 rounded-[20px] p-3.5 text-sm font-black text-slate-800 focus:outline-none appearance-none cursor-pointer"
              >
                <option value="en">English</option>
                <option value="as">Assamese</option>
                <option value="hi">Hindi</option>
                <option value="bn">Bengali</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Accessibility Section matching Screen 15 */}
        <div className="bg-white rounded-[28px] p-5 shadow-clay-card border border-white flex flex-col gap-4">
          <h2 className="text-base font-black text-slate-900 font-heading">
            Accessibility
          </h2>

          {/* Voice Prompts Toggle (ON by default in reference) */}
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-[#E6F5EF] text-[#0E8765] flex items-center justify-center">
                <Volume2 className="w-5 h-5" />
              </div>
              <span className="text-sm font-black text-slate-800">
                Voice Prompts
              </span>
            </div>

            {/* Toggle Switch */}
            <button
              onClick={handleToggleVoice}
              className={`w-14 h-8 rounded-full p-1 transition-colors cursor-pointer ${
                voicePrompts ? 'bg-[#0E8765]' : 'bg-slate-200'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${
                  voicePrompts ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Larger Text Toggle */}
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <Type className="w-5 h-5" />
              </div>
              <span className="text-sm font-black text-slate-800">
                Larger Text
              </span>
            </div>

            <button
              onClick={handleToggleText}
              className={`w-14 h-8 rounded-full p-1 transition-colors cursor-pointer ${
                largerText ? 'bg-[#0E8765]' : 'bg-slate-200'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${
                  largerText ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* High Contrast Toggle */}
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <Contrast className="w-5 h-5" />
              </div>
              <span className="text-sm font-black text-slate-800">
                High Contrast
              </span>
            </div>

            <button
              onClick={handleToggleContrast}
              className={`w-14 h-8 rounded-full p-1 transition-colors cursor-pointer ${
                highContrast ? 'bg-[#0E8765]' : 'bg-slate-200'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${
                  highContrast ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="text-center pt-2">
        <span className="text-xs text-slate-400 font-semibold">
          MindNest Accessibility Engine • Configured for elderly dementia comfort
        </span>
      </div>
    </div>
  );
};
