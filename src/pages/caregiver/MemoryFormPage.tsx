import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, ShieldCheck, Image as ImageIcon } from 'lucide-react';
import { ClayCard } from '../../components/ui/ClayCard';
import { ClayButton } from '../../components/ui/ClayButton';
import { ClayInput } from '../../components/ui/ClayInput';
import { db } from '../../services/db';
import { MemoryCategory } from '../../types';

export const MemoryFormPage: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=80');
  const [people, setPeople] = useState('Rahul, Sunita');
  const [place, setPlace] = useState('Lodhi Gardens, New Delhi');
  const [dateApproximation, setDateApproximation] = useState('Spring 2024');
  const [category, setCategory] = useState<MemoryCategory>('Family Photo');
  const [associatedStory, setAssociatedStory] = useState('');
  const [associatedMusic, setAssociatedMusic] = useState('Soft Sitar Melodies');
  const [approved, setApproved] = useState<boolean>(true);
  const [approvedForAI, setApprovedForAI] = useState<boolean>(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    db.addMemory({
      patientId: 'patient-anita-123',
      title,
      description,
      imageUrl,
      people: people.split(',').map(p => p.trim()),
      place,
      dateApproximation,
      category,
      tags: [category.toLowerCase(), 'family'],
      associatedStory,
      associatedMusic,
      approved,
      approvedForAI,
      approvalStatus: approved ? 'APPROVED' : 'PENDING_REVIEW',
      consentStatus: 'GRANTED',
      createdBy: 'Rahul Sharma'
    });

    navigate('/caregiver/memories');
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/caregiver/memories')}
          className="clay-btn-neutral px-4 py-2 rounded-2xl flex items-center gap-2 font-black text-slate-700"
        >
          <ArrowLeft className="w-5 h-5 text-[#6C63FF]" />
          <span>Back to Library</span>
        </button>

        <h1 className="text-2xl font-black text-slate-800 font-heading">
          Add Personal Memory
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <ClayCard padding="lg" className="flex flex-col gap-5">
          <ClayInput
            label="Memory Title *"
            placeholder="e.g. Afternoon Tea in the Garden"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-slate-700">Memory Story & Context</label>
            <textarea
              rows={3}
              className="clay-input w-full font-medium"
              placeholder="Describe what happened, who was there, or warm feelings..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ClayInput
              label="Photo Image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-slate-700">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as MemoryCategory)}
                className="clay-input w-full font-bold"
              >
                {['Family Photo', 'Family Video', 'Music', 'Voice Recording', 'Story', 'Person', 'Place', 'Event', 'Favorite Object', 'Favorite Song', 'Routine Information', 'Life Event', 'Other'].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ClayInput
              label="People Involved"
              placeholder="e.g. Rahul, Aarav"
              value={people}
              onChange={(e) => setPeople(e.target.value)}
            />
            <ClayInput
              label="Place / Location"
              placeholder="e.g. New Delhi"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
            />
            <ClayInput
              label="Approximate Date"
              placeholder="e.g. Spring 2023"
              value={dateApproximation}
              onChange={(e) => setDateApproximation(e.target.value)}
            />
          </div>

          <div className="bg-[#6C63FF]/10 p-5 rounded-2xl border border-[#6C63FF]/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-7 h-7 text-[#6C63FF]" />
              <div className="flex flex-col">
                <span className="text-base font-extrabold text-slate-800">Approve for AI Personalization</span>
                <span className="text-xs text-slate-600 font-bold">Only approved memories are used to generate Memory Lane activities.</span>
              </div>
            </div>

            <input
              type="checkbox"
              checked={approved}
              onChange={(e) => setApproved(e.target.checked)}
              className="w-6 h-6 rounded-lg text-[#6C63FF] focus:ring-[#6C63FF] cursor-pointer"
            />
          </div>
        </ClayCard>

        <div className="flex justify-end gap-4">
          <ClayButton variant="neutral" size="md" onClick={() => navigate('/caregiver/memories')}>
            Cancel
          </ClayButton>
          <ClayButton variant="primary" size="md" type="submit" icon={<Save className="w-5 h-5" />}>
            Save Memory
          </ClayButton>
        </div>
      </form>
    </div>
  );
};
