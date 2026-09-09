import React, { useState } from 'react';
import { Volume2, Languages, Play, CheckCircle2, Mic, Sliders, ShieldCheck } from 'lucide-react';
import { ClayCard } from '../../components/ui/ClayCard';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { useVoice } from '../../contexts/VoiceContext';
import { SUPPORTED_LANGUAGES } from '../../locales/languages';
import { VOICE_PROFILES } from '../../services/voiceRegistry';
import { SupportedLanguage } from '../../types';

export const VoiceSettingsPage: React.FC = () => {
  const { settings, setPatientLanguage, setCaregiverLanguage, updateVoiceSettings } = useAccessibility();
  const { speak, isSpeaking, stopSpeaking } = useVoice();
  const voiceSettings = settings.voiceSettings;

  const [testText, setTestText] = useState<string>('Hello Anita. Today is a peaceful day for our family.');

  const handleTestVoice = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speak(testText);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div>
        <span className="text-xs font-black uppercase text-[#6C63FF] tracking-wider font-heading">
          Speech & Accessibility Settings
        </span>
        <h1 className="text-3xl font-extrabold text-slate-800 font-heading">
          Voice & Language Preferences
        </h1>
        <p className="text-sm font-bold text-slate-500 mt-1">
          Configure independent language settings for the patient and caregiver, Indian voice accents, and speech speed.
        </p>
      </div>

      {/* Languages Section */}
      <ClayCard padding="lg" className="border-2 border-white shadow-clay-card flex flex-col gap-5">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <Languages className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-black text-slate-800 font-heading">
            Language Selection (23 Indian Languages Supported)
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Patient Language */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center justify-between text-xs font-extrabold text-slate-700">
              <span>Patient Experience Language:</span>
              <span className="text-[10px] font-black uppercase text-[#6C63FF] bg-[#6C63FF]/10 px-2 py-0.5 rounded-full">
                Independent
              </span>
            </label>
            <select
              value={settings.language}
              onChange={(e) => setPatientLanguage(e.target.value as SupportedLanguage)}
              className="px-4 py-3 rounded-2xl border border-slate-200 text-sm font-bold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#6C63FF] shadow-sm"
            >
              {SUPPORTED_LANGUAGES.map(l => (
                <option key={l.code} value={l.code}>
                  {l.name} — {l.nativeName} ({l.script})
                </option>
              ))}
            </select>
            <p className="text-[11px] font-bold text-slate-400">
              All patient prompts, activities, quizzes, and TTS will speak in this selected language.
            </p>
          </div>

          {/* Caregiver Language */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-extrabold text-slate-700">
              Caregiver Portal Language:
            </label>
            <select
              value={settings.caregiverLanguage || 'en'}
              onChange={(e) => setCaregiverLanguage(e.target.value as SupportedLanguage)}
              className="px-4 py-3 rounded-2xl border border-slate-200 text-sm font-bold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#6C63FF] shadow-sm"
            >
              {SUPPORTED_LANGUAGES.map(l => (
                <option key={l.code} value={l.code}>
                  {l.name} — {l.nativeName} ({l.script})
                </option>
              ))}
            </select>
            <p className="text-[11px] font-bold text-slate-400">
              Dashboard, reports, and administrative management language for the caregiver.
            </p>
          </div>
        </div>
      </ClayCard>

      {/* Voice Profiles Registry */}
      <ClayCard padding="lg" className="border-2 border-white shadow-clay-card flex flex-col gap-5">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 font-heading">
              Indian Voice Profiles & Speech Synthesis
            </h2>
            <p className="text-xs font-bold text-slate-400">
              Select warm, reassuring voices tailored for elderly engagement.
            </p>
          </div>
        </div>

        {/* 4 Conceptual Indian Voice Profiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {VOICE_PROFILES.map((profile) => {
            const isSelected = voiceSettings.voiceProfileId === profile.id;
            return (
              <button
                key={profile.id}
                onClick={() => updateVoiceSettings({ 
                  voiceProfileId: profile.id, 
                  voiceGender: profile.gender 
                })}
                className={`p-4 rounded-[22px] text-left border-2 transition-all flex flex-col justify-between gap-3 ${
                  isSelected 
                    ? 'border-[#6C63FF] bg-[#6C63FF]/5 shadow-sm' 
                    : 'border-slate-100 bg-[#F8F9FE] hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase text-[#6C63FF] tracking-wider block">
                      {profile.gender} • {profile.accent}
                    </span>
                    <h4 className="text-base font-black text-slate-800 font-heading mt-0.5">
                      {profile.name}
                    </h4>
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="w-5 h-5 text-[#6C63FF] shrink-0" />
                  )}
                </div>

                <p className="text-xs font-bold text-slate-500 leading-relaxed">
                  {profile.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Speed, Volume, and Auto-Read Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-3 border-t border-slate-100">
          {/* Speech Speed */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs font-extrabold text-slate-700">
              <span>Speech Speed:</span>
              <span className="text-[#6C63FF]">{voiceSettings.speechSpeed}x</span>
            </div>
            <input
              type="range"
              min="0.7"
              max="1.2"
              step="0.05"
              value={voiceSettings.speechSpeed}
              onChange={(e) => updateVoiceSettings({ speechSpeed: parseFloat(e.target.value) })}
              className="accent-[#6C63FF] cursor-pointer"
            />
            <span className="text-[10px] font-bold text-slate-400">
              Gentle pacing (0.85x recommended for seniors)
            </span>
          </div>

          {/* Speech Volume */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs font-extrabold text-slate-700">
              <span>Speech Volume:</span>
              <span className="text-[#6C63FF]">{Math.round(voiceSettings.speechVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="1.0"
              step="0.1"
              value={voiceSettings.speechVolume}
              onChange={(e) => updateVoiceSettings({ speechVolume: parseFloat(e.target.value) })}
              className="accent-[#6C63FF] cursor-pointer"
            />
            <span className="text-[10px] font-bold text-slate-400">
              Clear volume for auditory accessibility
            </span>
          </div>

          {/* ElevenLabs Toggle */}
          <div className="flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-700">Use ElevenLabs Backend</span>
              <button
                onClick={() => updateVoiceSettings({ useElevenLabs: !voiceSettings.useElevenLabs })}
                className={`px-3 py-1 rounded-full text-xs font-black transition-colors ${
                  voiceSettings.useElevenLabs ? 'bg-[#6C63FF] text-white shadow-sm' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {voiceSettings.useElevenLabs ? 'ENABLED' : 'OFF (Browser TTS)'}
              </button>
            </div>
            <span className="text-[10px] font-bold text-slate-400 mt-1">
              Falls back automatically to browser Web Speech API if ElevenLabs API key is absent.
            </span>
          </div>
        </div>

        {/* Live Audio Test Card */}
        <div className="bg-[#F8F9FE] p-4 rounded-2xl border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
          <div className="flex-1 w-full">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Test Sample Voice</span>
            <input
              type="text"
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white"
            />
          </div>

          <button
            onClick={handleTestVoice}
            className="clay-btn-primary px-6 py-3 rounded-2xl text-xs font-black flex items-center gap-2 shrink-0 self-stretch sm:self-auto justify-center"
          >
            <Play className="w-4 h-4" />
            <span>{isSpeaking ? 'Stop Playing' : 'Listen Now'}</span>
          </button>
        </div>

        {/* Sanitization Security Guarantee */}
        <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 flex items-center gap-3 text-xs font-bold text-amber-900">
          <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
          <span>
            Strict Emoji-Free TTS Guarantee: MindNest automatically strips all decorative emojis, pictographs, and markdown symbols before any voice synthesis occurs.
          </span>
        </div>
      </ClayCard>
    </div>
  );
};
