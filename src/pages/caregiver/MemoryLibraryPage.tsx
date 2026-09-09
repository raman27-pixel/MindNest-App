import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, ShieldCheck, ShieldAlert, Trash2, Edit3, Image as ImageIcon, HardDrive, Sparkles } from 'lucide-react';
import { ClayCard } from '../../components/ui/ClayCard';
import { GooglePhotosImportModal } from './GooglePhotosImportModal';
import { GoogleDriveImportModal } from './GoogleDriveImportModal';
import { db } from '../../services/db';
import { MemoryItem, MemoryCategory } from '../../types';

export const MemoryLibraryPage: React.FC = () => {
  const navigate = useNavigate();
  const [memories, setMemories] = useState<MemoryItem[]>(db.getMemories());
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [isPhotosModalOpen, setIsPhotosModalOpen] = useState<boolean>(false);
  const [isDriveModalOpen, setIsDriveModalOpen] = useState<boolean>(false);

  const refreshMemories = () => {
    setMemories(db.getMemories());
  };

  const handleToggleApproval = (id: string) => {
    db.toggleMemoryApproval(id);
    refreshMemories();
  };

  const handleToggleAiPermission = (id: string) => {
    db.toggleMemoryAIApproval(id);
    refreshMemories();
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this family memory?')) {
      db.deleteMemory(id);
      refreshMemories();
    }
  };

  const categories = ['ALL', 'Family Photo', 'Family Video', 'Music', 'Voice Recording', 'Story', 'Person', 'Place', 'Life Event', 'Favorite Song'];

  const filteredMemories = memories.filter(m => {
    const matchesCategory = selectedCategory === 'ALL' || m.category === selectedCategory;
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          m.place.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header & Import Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase text-[#6C63FF] tracking-wider font-heading">
            Personal Caregiver Repository
          </span>
          <h1 className="text-3xl font-extrabold text-slate-800 font-heading">
            Family Memory Library
          </h1>
          <p className="text-sm font-bold text-slate-500 mt-1">
            Caregiver-supervised memories. The AI personalization engine and Memory Companion strictly use only memories marked <strong className="text-emerald-600 font-black">APPROVED FOR AI</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Google Photos Import */}
          <button
            onClick={() => setIsPhotosModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-200 text-xs font-black flex items-center gap-2 shadow-sm transition-all"
          >
            <ImageIcon className="w-4 h-4 text-purple-600" />
            <span>Import Google Photos</span>
          </button>

          {/* Google Drive Import */}
          <button
            onClick={() => setIsDriveModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-200 text-xs font-black flex items-center gap-2 shadow-sm transition-all"
          >
            <HardDrive className="w-4 h-4 text-amber-600" />
            <span>Import Google Drive</span>
          </button>

          {/* Manual New Memory */}
          <button
            onClick={() => navigate('/caregiver/memories/new')}
            className="clay-btn-primary px-5 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 shadow-clay-primary"
          >
            <Plus className="w-4 h-4" />
            <span>Add Memory</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <ClayCard padding="md" className="flex flex-col md:flex-row items-center justify-between gap-4 border-2 border-white shadow-clay-card">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search memories or places..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="clay-input pl-10 w-full text-xs font-bold"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-black shrink-0 transition-all ${
                selectedCategory === cat
                  ? 'bg-[#6C63FF] text-white shadow-clay-primary'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </ClayCard>

      {/* Memory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMemories.map((mem) => (
          <ClayCard key={mem.id} padding="none" className="overflow-hidden flex flex-col justify-between border-2 border-white shadow-clay-card">
            <div>
              <div className="relative h-48 bg-slate-100 overflow-hidden">
                <img
                  src={mem.imageUrl || mem.mediaUrl || 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=80'}
                  alt={mem.title}
                  className="w-full h-full object-cover"
                />

                {/* Source Badge */}
                {mem.source && (
                  <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
                    {mem.source.replace('_', ' ')}
                  </span>
                )}

                {/* Approval Badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1">
                  {mem.approvedForAI ? (
                    <span className="bg-emerald-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      AI Approved
                    </span>
                  ) : (
                    <span className="bg-slate-700/80 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
                      AI Excluded
                    </span>
                  )}
                </div>
              </div>

              <div className="p-5 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-[#6C63FF] tracking-wider">
                    {mem.category} • {mem.dateApproximation}
                  </span>
                  <span className="text-xs font-bold text-slate-400">{mem.place}</span>
                </div>

                <h3 className="text-lg font-black text-slate-800 font-heading leading-tight">
                  {mem.title}
                </h3>

                <p className="text-xs font-bold text-slate-500 line-clamp-2">
                  {mem.description}
                </p>

                {mem.people && mem.people.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {mem.people.map((p, i) => (
                      <span key={i} className="text-[10px] font-extrabold bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md">
                        {p}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Caregiver Approval & AI Usage Controls */}
            <div className="p-4 bg-[#F8F9FE] border-t border-slate-100 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={mem.approvedForAI}
                    onChange={() => handleToggleAiPermission(mem.id)}
                    className="rounded text-[#6C63FF] focus:ring-[#6C63FF]"
                  />
                  <span>Allow AI in Activities & Talk</span>
                </label>

                <button
                  onClick={() => handleDelete(mem.id)}
                  className="text-slate-400 hover:text-rose-600 p-1"
                  title="Delete Memory"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[11px]">
                <span className="font-extrabold text-slate-500">Patient Visibility:</span>
                <button
                  onClick={() => handleToggleApproval(mem.id)}
                  className={`font-black underline ${mem.approved ? 'text-emerald-600' : 'text-amber-600'}`}
                >
                  {mem.approved ? 'Visible on Memory Lane' : 'Hidden from Patient'}
                </button>
              </div>
            </div>
          </ClayCard>
        ))}
      </div>

      {/* Modals */}
      <GooglePhotosImportModal
        isOpen={isPhotosModalOpen}
        onClose={() => setIsPhotosModalOpen(false)}
        onImportSuccess={refreshMemories}
      />

      <GoogleDriveImportModal
        isOpen={isDriveModalOpen}
        onClose={() => setIsDriveModalOpen(false)}
        onImportSuccess={refreshMemories}
      />
    </div>
  );
};
