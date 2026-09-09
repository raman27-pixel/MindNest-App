import React, { useState } from 'react';
import { HardDrive, CheckCircle2, X, FileVideo, Music, FileText, Image, ShieldCheck } from 'lucide-react';
import { db } from '../../services/db';
import { MemoryCategory } from '../../types';

interface GoogleDriveImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess?: () => void;
}

export const GoogleDriveImportModal: React.FC<GoogleDriveImportModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess
}) => {
  const [selectedCategory, setSelectedCategory] = useState<MemoryCategory>('Family Video');
  const [title, setTitle] = useState<string>('Shimla Monsoon Pines Video');
  const [description, setDescription] = useState<string>('Short video of pine trees swaying in gentle Himachal monsoon mist.');
  const [people, setPeople] = useState<string>('Anita, Suresh');
  const [place, setPlace] = useState<string>('Shimla Ridge');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleApproveDriveImport = () => {
    const peopleArray = people.split(',').map(p => p.trim()).filter(Boolean);

    db.addMemory({
      patientId: 'patient-anita-123',
      title,
      description,
      imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      mediaUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      mediaType: selectedCategory === 'Family Video' ? 'video' : selectedCategory === 'Music' ? 'audio' : 'image',
      people: peopleArray,
      place,
      dateApproximation: 'Summer 2022',
      category: selectedCategory,
      tags: ['google_drive', 'approved'],
      approved: true,
      approvedForAI: true,
      approvalStatus: 'APPROVED',
      approvedBy: 'Rahul Sharma',
      approvedAt: new Date().toISOString(),
      consentStatus: 'GRANTED',
      source: 'google_drive',
      createdBy: 'Rahul Sharma'
    });

    setIsSubmitted(true);
    if (onImportSuccess) onImportSuccess();
  };

  const handleReset = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div 
        className="w-full max-w-xl bg-white rounded-[32px] shadow-2xl p-6 sm:p-8 flex flex-col gap-6 border-2 border-white max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drive-modal-title"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-sm">
              <HardDrive className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-amber-600 tracking-wider font-heading">
                Google Drive Import
              </span>
              <h3 id="drive-modal-title" className="text-xl sm:text-2xl font-black text-slate-800 font-heading">
                Import Drive Media & Documents
              </h3>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isSubmitted ? (
          <div className="flex flex-col gap-4">
            <p className="text-xs font-bold text-slate-500">
              Select and categorize family videos, audio recordings, music files, or nostalgic documents from Google Drive.
            </p>

            {/* Category Picker */}
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-extrabold text-slate-700">Memory Category:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['Family Photo', 'Family Video', 'Music', 'Voice Recording'] as MemoryCategory[]).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`py-2 px-3 rounded-xl text-xs font-black transition-all border ${
                      selectedCategory === cat 
                        ? 'bg-[#6C63FF] text-white border-[#6C63FF] shadow-sm' 
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Form Fields */}
            <label className="flex flex-col gap-1 text-xs font-extrabold text-slate-700">
              <span>Title:</span>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
              />
            </label>

            <label className="flex flex-col gap-1 text-xs font-extrabold text-slate-700">
              <span>Description & Story:</span>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
              />
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex flex-col gap-1 text-xs font-extrabold text-slate-700">
                <span>People Involved:</span>
                <input
                  type="text"
                  value={people}
                  onChange={(e) => setPeople(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
                />
              </label>

              <label className="flex flex-col gap-1 text-xs font-extrabold text-slate-700">
                <span>Place:</span>
                <input
                  type="text"
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
                />
              </label>
            </div>

            <div className="bg-[#F8F9FE] p-4 rounded-2xl text-xs font-bold text-slate-600 flex items-center gap-3 border border-slate-100">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Imported Drive files strictly require caregiver approval before being shown to the patient.</span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleApproveDriveImport}
                className="flex-1 min-h-[50px] py-3 px-6 rounded-2xl bg-[#6C63FF] hover:bg-[#5B52E0] text-white font-black text-sm shadow-md flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Approve & Save Drive Memory</span>
              </button>

              <button
                onClick={handleReset}
                className="py-3 px-5 rounded-2xl bg-slate-100 text-slate-600 font-bold text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center gap-5 py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-black text-slate-800 font-heading">
              Drive File Approved and Added to Library
            </h4>
            <button
              onClick={handleReset}
              className="py-2.5 px-6 rounded-2xl bg-[#6C63FF] text-white font-black text-sm shadow-md"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
