import React, { useState } from 'react';
import { Sparkles, Image, CheckCircle2, RefreshCcw, ShieldCheck, HelpCircle } from 'lucide-react';
import { ClayCard } from '../../components/ui/ClayCard';
import { ClayButton } from '../../components/ui/ClayButton';
import { ClayBadge } from '../../components/ui/ClayBadge';
import { db } from '../../services/db';
import { AIActivityRecommendation, ActivityType, ActivityDifficulty } from '../../types';

export const AIRecommendationsPage: React.FC = () => {
  const [recommendations, setRecommendations] = useState<AIActivityRecommendation[]>(db.getRecommendations());
  const [selectedDifficulty, setSelectedDifficulty] = useState<ActivityDifficulty>('EASY');
  const [selectedType, setSelectedType] = useState<ActivityType>('photo_recognition');
  const [overrideReason, setOverrideReason] = useState<string>('Caregiver preferred simpler photo reminiscence today.');
  const [showOverrideModal, setShowOverrideModal] = useState<string | null>(null);

  const handleExecuteOverride = (id: string) => {
    db.overrideRecommendation(id, selectedDifficulty, selectedType, overrideReason);
    setRecommendations(db.getRecommendations());
    setShowOverrideModal(null);
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 font-heading">
          AI Recommendations & Human Override
        </h1>
        <p className="text-base font-bold text-slate-500 mt-1">
          AI proposes activity plans strictly using approved family memories. Caregivers maintain 100% manual override authority.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {recommendations.map((rec) => (
          <ClayCard key={rec.id} padding="lg" className="flex flex-col gap-5 border-2 border-[#6C63FF]/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-[#6C63FF]" />
                <span className="text-xs font-black uppercase text-[#6C63FF] tracking-wider">AI Proposed Plan</span>
              </div>
              <ClayBadge variant={rec.status === 'OVERRIDDEN' ? 'warning' : 'success'}>
                {rec.status}
              </ClayBadge>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-2xl font-black text-slate-800 font-heading">{rec.proposedTitle}</h3>
              <p className="text-base font-bold text-slate-600">{rec.rationale}</p>
            </div>

            {/* Source Memory Transparency Link */}
            {rec.sourceMemoryTitle && (
              <div className="bg-[#6C63FF]/10 p-4 rounded-2xl border border-[#6C63FF]/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Image className="w-6 h-6 text-[#6C63FF]" />
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-slate-400 uppercase">Personalization Source</span>
                    <span className="text-sm font-black text-slate-800">📷 {rec.sourceMemoryTitle}</span>
                  </div>
                </div>
                <ClayBadge variant="secondary">Approved Memory</ClayBadge>
              </div>
            )}

            {/* If Overridden */}
            {rec.status === 'OVERRIDDEN' && rec.overrideDetails && (
              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-amber-900 font-bold text-sm">
                ⚠️ Caregiver Override Executed by {rec.overrideDetails.overriddenBy}: Set difficulty to {rec.overrideDetails.chosenDifficulty} ({rec.overrideDetails.reason})
              </div>
            )}

            {/* Actions */}
            {rec.status === 'PENDING' && (
              <div className="flex items-center justify-end gap-3 pt-2">
                <ClayButton
                  variant="neutral"
                  size="md"
                  onClick={() => setShowOverrideModal(rec.id)}
                  icon={<RefreshCcw className="w-5 h-5 text-amber-600" />}
                >
                  Override AI Selection
                </ClayButton>

                <ClayButton
                  variant="primary"
                  size="md"
                  onClick={() => alert("AI Recommendation Approved!")}
                  icon={<CheckCircle2 className="w-5 h-5" />}
                >
                  Approve Plan
                </ClayButton>
              </div>
            )}

            {/* Caregiver Override Modal Form */}
            {showOverrideModal === rec.id && (
              <div className="mt-4 p-5 bg-slate-100 rounded-2xl flex flex-col gap-4 border border-slate-300">
                <h4 className="text-lg font-black text-slate-800 font-heading">Manual Caregiver Override</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-700">Choose Difficulty</label>
                    <select
                      value={selectedDifficulty}
                      onChange={(e) => setSelectedDifficulty(e.target.value as ActivityDifficulty)}
                      className="clay-input font-bold"
                    >
                      <option value="EASY">EASY (Single choice, gentle)</option>
                      <option value="MEDIUM">MEDIUM (Standard choice)</option>
                      <option value="HARD">HARD (Multi-step option)</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-700">Choose Activity Type</label>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value as ActivityType)}
                      className="clay-input font-bold"
                    >
                      <option value="photo_recognition">Photo Recognition</option>
                      <option value="picture_matching">Picture Matching</option>
                      <option value="word_association">Word Association</option>
                      <option value="sequence">Sequence Ordering</option>
                      <option value="memory_recall">Memory Recall</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Reason for Override (Optional)</label>
                  <input
                    type="text"
                    value={overrideReason}
                    onChange={(e) => setOverrideReason(e.target.value)}
                    className="clay-input"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <ClayButton variant="neutral" size="sm" onClick={() => setShowOverrideModal(null)}>
                    Cancel
                  </ClayButton>
                  <ClayButton variant="secondary" size="sm" onClick={() => handleExecuteOverride(rec.id)}>
                    Confirm Override
                  </ClayButton>
                </div>
              </div>
            )}
          </ClayCard>
        ))}
      </div>
    </div>
  );
};
