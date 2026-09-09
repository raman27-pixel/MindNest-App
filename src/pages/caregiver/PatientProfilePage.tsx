import React, { useState } from 'react';
import { User, Heart, Sparkles, Music, MapPin, Users, Save, ShieldAlert } from 'lucide-react';
import { ClayCard } from '../../components/ui/ClayCard';
import { ClayButton } from '../../components/ui/ClayButton';
import { ClayInput } from '../../components/ui/ClayInput';
import { db } from '../../services/db';
import { PatientProfile } from '../../types';

export const PatientProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<PatientProfile>(db.getPatientProfile());
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleChange = (field: keyof PatientProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    db.updatePatientProfile(profile);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="flex flex-col gap-8 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 font-heading">
            Patient Profile
          </h1>
          <p className="text-base font-bold text-slate-500 mt-1">
            Manage personal context, capabilities, and daily routine preferences for {profile.name}.
          </p>
        </div>

        <ClayButton variant="primary" size="md" onClick={handleSave} icon={<Save className="w-5 h-5" />}>
          Save Profile
        </ClayButton>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 border-2 border-emerald-300 p-4 rounded-2xl text-emerald-800 font-bold text-base animate-fade-in">
          ✓ Patient profile updated successfully!
        </div>
      )}

      {/* Profile Overview Card */}
      <ClayCard padding="lg" className="flex flex-col md:flex-row items-center gap-6">
        <img
          src={profile.profilePhotoUrl}
          alt={profile.name}
          className="w-32 h-32 rounded-full object-cover shadow-clay-card border-4 border-white shrink-0"
        />
        <div className="flex flex-col gap-3 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ClayInput
              label="Full Name"
              value={profile.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
            <ClayInput
              label="Preferred Name"
              value={profile.preferredName}
              onChange={(e) => handleChange('preferredName', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ClayInput
              label="Age"
              type="number"
              value={profile.age.toString()}
              onChange={(e) => handleChange('age', parseInt(e.target.value) || 72)}
            />
            <ClayInput
              label="Profile Photo URL"
              value={profile.profilePhotoUrl}
              onChange={(e) => handleChange('profilePhotoUrl', e.target.value)}
            />
          </div>
        </div>
      </ClayCard>

      {/* Condition & Context (Caregiver Entered) */}
      <ClayCard padding="lg" className="flex flex-col gap-6">
        <h3 className="text-xl font-black text-slate-800 font-heading flex items-center gap-2 border-b border-slate-100 pb-3">
          <ShieldAlert className="w-6 h-6 text-[#6C63FF]" />
          Condition Context & Communication Preferences
        </h3>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-slate-700">General Caregiver Context</label>
            <textarea
              value={profile.context}
              onChange={(e) => handleChange('context', e.target.value)}
              rows={3}
              className="clay-input w-full font-medium"
              placeholder="Describe warm daily context, morning habits, or specific preferences..."
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-slate-700">Communication Preferences</label>
            <input
              value={profile.communicationPreferences}
              onChange={(e) => handleChange('communicationPreferences', e.target.value)}
              className="clay-input w-full font-medium"
            />
          </div>
        </div>
      </ClayCard>

      {/* Important People & Places */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ClayCard padding="lg" className="flex flex-col gap-4">
          <h3 className="text-lg font-black text-slate-800 font-heading flex items-center gap-2 border-b border-slate-100 pb-3">
            <Users className="w-5 h-5 text-pink-500" />
            Important Family & Friends
          </h3>
          <div className="flex flex-col gap-3">
            {profile.importantPeople.map((person, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-[#F0F3FA] p-3 rounded-2xl">
                <img src={person.photoUrl} alt={person.name} className="w-10 h-10 rounded-full object-cover" />
                <div className="flex flex-col">
                  <span className="text-sm font-black text-slate-800">{person.name}</span>
                  <span className="text-xs font-bold text-slate-500">{person.relation}</span>
                </div>
              </div>
            ))}
          </div>
        </ClayCard>

        <ClayCard padding="lg" className="flex flex-col gap-4">
          <h3 className="text-lg font-black text-slate-800 font-heading flex items-center gap-2 border-b border-slate-100 pb-3">
            <MapPin className="w-5 h-5 text-emerald-500" />
            Familiar & Meaningful Places
          </h3>
          <div className="flex flex-col gap-2">
            {profile.importantPlaces.map((place, idx) => (
              <div key={idx} className="p-3 bg-[#F0F3FA] rounded-2xl text-sm font-extrabold text-slate-800">
                📍 {place}
              </div>
            ))}
          </div>
        </ClayCard>
      </div>
    </div>
  );
};
