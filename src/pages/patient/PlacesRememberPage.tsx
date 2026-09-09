import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Clock, Navigation } from 'lucide-react';
import { db } from '../../services/db';
import { PlaceMemory } from '../../types';

export const PlacesRememberPage: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'Map' | 'Timeline'>('Map');
  const places: PlaceMemory[] = db.getPlaces();

  return (
    <div className="min-h-screen bg-[#F4F7FB] pb-28 pt-3 px-4 max-w-md mx-auto flex flex-col">
      {/* Top Header matching Screen 8 */}
      <div className="flex items-center justify-between py-2 mb-2">
        <button
          onClick={() => navigate('/patient/home')}
          className="w-10 h-10 rounded-full bg-white shadow-clay-sm flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-all"
          aria-label="Go Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h1 className="text-xl font-black text-slate-800 font-heading">
          My Places
        </h1>

        <div className="w-10" />
      </div>

      {/* Segmented Control matching Screen 8: Map View vs Timeline */}
      <div className="bg-slate-200/60 p-1.5 rounded-[22px] flex items-center gap-1.5 mb-6 shadow-inner">
        <button
          onClick={() => setViewMode('Map')}
          className={`flex-1 py-2.5 rounded-[18px] text-xs font-black transition-all duration-150 cursor-pointer ${
            viewMode === 'Map'
              ? 'bg-[#0E8765] text-white shadow-clay-primary'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Map View
        </button>
        <button
          onClick={() => setViewMode('Timeline')}
          className={`flex-1 py-2.5 rounded-[18px] text-xs font-black transition-all duration-150 cursor-pointer ${
            viewMode === 'Timeline'
              ? 'bg-[#0E8765] text-white shadow-clay-primary'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Timeline
        </button>
      </div>

      {/* Places Timeline List matching Screen 8 */}
      <div className="relative pl-6 flex flex-col gap-5">
        {/* Vertical Timeline Route Line */}
        <div className="absolute left-2.5 top-4 bottom-4 w-1 bg-[#0E8765]/30 rounded-full" />

        {places.map((place, idx) => (
          <div key={place.id} className="relative flex items-center gap-4">
            {/* Timeline Dot Pin matching Screen 8 */}
            <div className="absolute -left-6 w-6 h-6 rounded-full bg-[#0E8765] border-3 border-white shadow-md flex items-center justify-center text-white shrink-0 z-10">
              <span className="w-2 h-2 rounded-full bg-white" />
            </div>

            {/* Place Card matching Screen 8 */}
            <div className="flex-1 bg-white rounded-[24px] p-3 shadow-clay-card border border-white flex items-center justify-between gap-3 hover:-translate-y-0.5 transition-transform cursor-pointer">
              <div className="flex items-center gap-3">
                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-[18px] overflow-hidden bg-slate-100 shrink-0">
                  <img
                    src={place.imageUrl}
                    alt={place.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Name and Period */}
                <div className="flex flex-col">
                  <span className="text-base font-black text-slate-800 font-heading">
                    {idx + 1}. {place.title}
                  </span>
                  <span className="text-xs font-bold text-slate-500 mt-0.5">
                    {place.period}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {place.location}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
