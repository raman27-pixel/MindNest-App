import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, ChevronDown, ChevronRight, Sparkles, MapPin, Globe, Music, Calendar } from 'lucide-react';
import { db } from '../../services/db';
import { RegionalCulturalContext, CulturalSuggestion, PatientProfile } from '../../types';

export const RegionalContextPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'Personal' | 'Regional'>('Regional');
  const [patient, setPatient] = useState<PatientProfile>(db.getPatientProfile());
  const [context, setContext] = useState<RegionalCulturalContext>(db.getRegionalContext());
  const [suggestions, setSuggestions] = useState<CulturalSuggestion[]>(db.getCulturalSuggestions());
  const [isSaved, setIsSaved] = useState<boolean>(false);

  useEffect(() => {
    return db.subscribe(() => {
      setPatient(db.getPatientProfile());
      setContext(db.getRegionalContext());
      setSuggestions(db.getCulturalSuggestions());
    });
  }, []);

  const handleToggleSuggestion = (id: string, currentStatus: boolean) => {
    db.toggleCulturalSuggestion(id, !currentStatus);
  };

  const handleApproveAll = () => {
    db.approveAllCulturalSuggestions();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleSave = () => {
    db.updateRegionalContext(context);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] pb-28 pt-3 px-3 sm:px-6 max-w-lg mx-auto flex flex-col">
      {/* Top Header matching Screen 2 */}
      <div className="flex items-center justify-between py-3 mb-2">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white shadow-clay-sm flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-all"
          aria-label="Go Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h1 className="text-xl font-black text-slate-800 font-heading">
          Patient Profile
        </h1>

        <button
          onClick={handleSave}
          className="text-sm font-black text-[#0E8765] hover:text-[#0B6D52] bg-[#E6F5EF] px-3.5 py-1.5 rounded-full border border-[#0E8765]/20"
        >
          {isSaved ? 'Saved ✓' : 'Save'}
        </button>
      </div>

      {/* Patient Avatar Card */}
      <div className="bg-white rounded-[26px] p-5 shadow-clay-card border border-white flex items-center gap-4 mb-4">
        <div className="relative shrink-0">
          <img
            src={patient.profilePhotoUrl}
            alt={patient.name}
            className="w-20 h-20 rounded-full object-cover border-3 border-[#0E8765] shadow-md"
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#0E8765] text-white flex items-center justify-center border-2 border-white text-xs">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
        </div>

        <div className="flex flex-col">
          <h2 className="text-2xl font-black text-slate-900 font-heading">
            {patient.name}
          </h2>
          <p className="text-sm font-bold text-slate-500">
            Age: {patient.age} | Female
          </p>
          <span className="text-xs font-bold text-[#0E8765] mt-0.5">
            Nagaon, Assam • NER Native
          </span>
        </div>
      </div>

      {/* Segmented Tabs matching Screen 2 */}
      <div className="bg-slate-200/60 p-1.5 rounded-[22px] flex items-center gap-1.5 mb-4 shadow-inner">
        <button
          onClick={() => setActiveTab('Personal')}
          className={`flex-1 py-2.5 rounded-[18px] text-sm font-extrabold transition-all duration-150 ${
            activeTab === 'Personal'
              ? 'bg-[#0E8765] text-white shadow-clay-primary'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Personal
        </button>
        <button
          onClick={() => setActiveTab('Regional')}
          className={`flex-1 py-2.5 rounded-[18px] text-sm font-extrabold transition-all duration-150 ${
            activeTab === 'Regional'
              ? 'bg-[#0E8765] text-white shadow-clay-primary'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Regional & Cultural
        </button>
      </div>

      {activeTab === 'Regional' ? (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-lg font-black text-slate-800 font-heading">
              Regional & Cultural Context
            </h3>
            <span className="text-xs font-bold text-[#0E8765] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              5 Indian States Supported
            </span>
          </div>

          {/* State / Region Field with interactive 5-State Selector */}
          <div className="bg-white rounded-[22px] p-4 shadow-clay-card border border-white flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#E6F5EF] text-[#0E8765] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-extrabold text-slate-400 block">Select Cultural State</span>
                  <span className="text-base font-black text-slate-900 font-heading">{context.state}</span>
                </div>
              </div>

              <select
                value={context.state}
                onChange={(e) => {
                  const newState = e.target.value;
                  const updated = db.switchStatePreset(newState);
                  setContext(updated);
                  setSuggestions(db.getCulturalSuggestions());
                }}
                className="bg-[#E6F5EF] text-[#0E8765] font-black text-sm px-3.5 py-2 rounded-xl border border-[#0E8765]/30 focus:outline-none cursor-pointer"
              >
                <option value="Assam">Assam (অসম)</option>
                <option value="Punjab">Punjab (ਪੰਜਾਬ)</option>
                <option value="West Bengal">West Bengal (বাংলা)</option>
                <option value="Kerala">Kerala (കേരളം)</option>
                <option value="Gujarat">Gujarat (ગુજરાત)</option>
              </select>
            </div>

            {/* Quick State Switcher Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {['Assam', 'Punjab', 'West Bengal', 'Kerala', 'Gujarat'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => {
                    const updated = db.switchStatePreset(st);
                    setContext(updated);
                    setSuggestions(db.getCulturalSuggestions());
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-extrabold transition-all ${
                    context.state === st
                      ? 'bg-[#0E8765] text-white shadow-clay-primary'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Preferred Language Field */}
          <div className="bg-white rounded-[22px] p-4 shadow-clay-card border border-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#E6F0FA] text-blue-700 flex items-center justify-center shrink-0">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-extrabold text-slate-400 block">Preferred Mother Tongue</span>
                <span className="text-base font-black text-slate-800">{context.preferredLanguage}</span>
              </div>
            </div>
            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
              Native
            </span>
          </div>

          {/* Other Languages */}
          <div className="bg-white rounded-[22px] p-4 shadow-clay-card border border-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-extrabold text-slate-400 block">Other Languages</span>
                <span className="text-base font-black text-slate-800">
                  {context.otherLanguages.join(', ')}
                </span>
              </div>
            </div>
          </div>

          {/* Home Town / Village */}
          <div className="bg-white rounded-[22px] p-4 shadow-clay-card border border-white flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-extrabold text-slate-400 block">Home Town / Village</span>
                <span className="text-base font-black text-slate-800">{context.homeTown}</span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </div>

          {/* Familiar Places */}
          <div className="bg-white rounded-[22px] p-4 shadow-clay-card border border-white flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-extrabold text-slate-400 block">Familiar Places</span>
                <span className="text-base font-black text-slate-800">
                  {context.familiarPlaces.slice(0, 2).join(', ')}
                </span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </div>

          {/* Regional Culture Engine (Section 6 from Master Prompt) */}
          <div className="bg-white rounded-[26px] p-5 shadow-clay-card border border-white mt-2">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#0E8765]" />
                <h4 className="text-sm font-black text-slate-800 font-heading">
                  Suggested by MindNest AI
                </h4>
              </div>
              <button
                onClick={handleApproveAll}
                className="text-xs font-black text-[#0E8765] bg-[#E6F5EF] px-3 py-1 rounded-full hover:bg-[#0E8765] hover:text-white transition-all"
              >
                Approve All
              </button>
            </div>
            <p className="text-xs text-slate-500 font-medium mb-3">
              Caregiver verifies cultural items before they become patient reminiscence context.
            </p>

            <div className="flex flex-col gap-2.5">
              {suggestions.map((item) => (
                <label
                  key={item.id}
                  className="flex items-center justify-between p-2.5 rounded-[18px] bg-[#F4F7FB] hover:bg-slate-100 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={item.approved}
                      onChange={() => handleToggleSuggestion(item.id, item.approved)}
                      className="w-5 h-5 rounded-lg text-[#0E8765] focus:ring-[#0E8765] accent-[#0E8765] cursor-pointer"
                    />
                    <div>
                      <span className="text-sm font-black text-slate-800 block">
                        {item.title}
                      </span>
                      <span className="text-[11px] font-bold text-slate-500">
                        {item.description}
                      </span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    item.approved ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {item.approved ? 'Approved' : 'Pending'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Large Teal Next Button matching Screen 2 */}
          <button
            onClick={() => navigate('/patient/memories')}
            className="w-full min-h-[60px] rounded-[24px] bg-[#0E8765] hover:bg-[#0B6D52] active:scale-98 text-white font-black text-lg font-heading shadow-clay-primary flex items-center justify-center gap-2 mt-4 cursor-pointer transition-all"
          >
            <span>Next</span>
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-[26px] p-5 shadow-clay-card border border-white flex flex-col gap-4">
          <h3 className="text-lg font-black text-slate-800 font-heading">
            Personal Information
          </h3>
          <div>
            <label className="text-xs font-black text-slate-500 block mb-1">Full Legal Name</label>
            <input
              type="text"
              value={patient.name}
              readOnly
              className="w-full clay-input font-bold"
            />
          </div>
          <div>
            <label className="text-xs font-black text-slate-500 block mb-1">Preferred Name</label>
            <input
              type="text"
              value={patient.preferredName}
              readOnly
              className="w-full clay-input font-bold"
            />
          </div>
          <div>
            <label className="text-xs font-black text-slate-500 block mb-1">Care Notes & Context</label>
            <textarea
              value={patient.context}
              readOnly
              rows={3}
              className="w-full clay-input font-medium text-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
};
