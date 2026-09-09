import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mic, ChevronDown, Check, Sparkles, Volume2 } from 'lucide-react';
import { db } from '../../services/db';

export const FamilyStoryCapturePage: React.FC = () => {
  const navigate = useNavigate();
  const [person, setPerson] = useState<string>('Grandfather');
  const [story, setStory] = useState<string>(
    'He used to work at the tea garden and loved to sing Bihu songs.'
  );
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);

  const handleRecordVoice = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 2000);
  };

  const handleSave = () => {
    db.addMemory({
      patientId: 'patient-asha-123',
      title: `${person}'s Story`,
      description: story,
      people: [person],
      place: 'Tea Gardens, Assam',
      dateApproximation: '1960s',
      category: 'Story',
      tags: ['story', person.toLowerCase(), 'tea garden', 'bihu'],
      associatedStory: story,
      approved: true,
      approvedForAI: true,
      approvalStatus: 'APPROVED',
      consentStatus: 'GRANTED',
      createdBy: 'Rahul Borah'
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      navigate('/caregiver/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] pb-24 pt-3 px-4 max-w-md mx-auto flex flex-col justify-between">
      {/* Top Header matching Screen 12 */}
      <div className="flex items-center justify-between py-2">
        <button
          onClick={() => navigate('/caregiver/dashboard')}
          className="w-10 h-10 rounded-full bg-white shadow-clay-sm flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-all"
          aria-label="Go Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h1 className="text-base font-black text-slate-800 font-heading">
          Tell us about them
        </h1>

        <button
          onClick={handleSave}
          className="text-xs font-black text-[#0E8765] bg-[#E6F5EF] px-3 py-1.5 rounded-full"
        >
          Save
        </button>
      </div>

      {/* Main Form Fields matching Screen 12 */}
      <div className="bg-white rounded-[32px] p-6 shadow-clay-card border border-white flex flex-col gap-5 my-auto">
        {/* Person Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-black text-slate-500 font-heading">
            Person
          </label>
          <div className="relative">
            <select
              value={person}
              onChange={(e) => setPerson(e.target.value)}
              className="w-full bg-[#F4F7FB] border border-slate-200/80 rounded-[20px] p-4 text-base font-black text-slate-800 focus:outline-none appearance-none cursor-pointer"
            >
              <option value="Grandfather">Grandfather</option>
              <option value="Grandmother">Grandmother</option>
              <option value="Father">Father</option>
              <option value="Mother">Mother</option>
              <option value="Son">Son (Rahul)</option>
              <option value="Daughter">Daughter (Sunita)</option>
              <option value="Sister">Sister</option>
              <option value="Brother">Brother</option>
            </select>
            <ChevronDown className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Story / Notes Field matching Screen 12 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-black text-slate-500 font-heading">
            Story / Notes
          </label>
          <textarea
            value={story}
            onChange={(e) => setStory(e.target.value)}
            rows={4}
            className="w-full bg-[#F4F7FB] border border-slate-200/80 rounded-[20px] p-4 text-sm font-semibold text-slate-800 focus:outline-none resize-none leading-relaxed"
            placeholder="Share a sweet memory, favorite food, song, or hobby..."
          />
        </div>

        {/* Record Voice Story Button matching Screen 12 */}
        <button
          onClick={handleRecordVoice}
          className={`w-full min-h-[60px] rounded-[24px] bg-[#0E8765] hover:bg-[#0B6D52] active:scale-98 text-white font-black text-base font-heading shadow-clay-primary flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
            isRecording ? 'animate-pulse ring-4 ring-[#0E8765]/40' : ''
          }`}
        >
          <Mic className="w-5 h-5" />
          <span>{isRecording ? 'Listening to story...' : 'Record Voice Story'}</span>
        </button>

        {saved && (
          <div className="bg-emerald-100 text-emerald-800 p-3 rounded-2xl text-center text-xs font-black animate-fade-in flex items-center justify-center gap-1.5">
            <Check className="w-4 h-4" />
            <span>Story saved and added to Asha's approved memories!</span>
          </div>
        )}
      </div>

      <div className="text-center pt-2">
        <span className="text-xs text-slate-400 font-semibold">
          Approved stories are safely referenced by the MindNest companion
        </span>
      </div>
    </div>
  );
};
