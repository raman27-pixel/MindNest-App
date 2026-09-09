import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CalendarHeart, CheckCircle2, Clock, Bell } from 'lucide-react';
import { ClayCard } from '../../components/ui/ClayCard';
import { db } from '../../services/db';

export const RoutinePage: React.FC = () => {
  const navigate = useNavigate();
  const profile = db.getPatientProfile();

  return (
    <div className="min-h-screen bg-[#F5F6FA] pb-28 pt-4 px-4 md:px-8 max-w-3xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/patient/home')}
          className="clay-btn-neutral px-4 py-2.5 rounded-2xl flex items-center gap-2 font-black text-slate-700"
        >
          <ArrowLeft className="w-6 h-6 text-[#6C63FF]" />
          <span>Home</span>
        </button>

        <h1 className="text-2xl md:text-3xl font-black text-slate-800 font-heading">
          My Daily Routine
        </h1>
      </div>

      <p className="text-xl font-bold text-slate-600 text-center">
        Here is your peaceful schedule for today.
      </p>

      {/* Routine Cards Timeline */}
      <div className="flex flex-col gap-4">
        {profile.routines.map((routine) => (
          <ClayCard
            key={routine.id}
            padding="lg"
            className={`flex items-center justify-between gap-4 border-2 ${
              routine.completedToday ? 'bg-emerald-50/50 border-emerald-200' : 'bg-white border-white'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500 text-white flex items-center justify-center shrink-0 shadow-md">
                <Clock className="w-7 h-7" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black text-indigo-600 uppercase tracking-wider">
                  {routine.time}
                </span>
                <h3 className="text-2xl font-black text-slate-800 font-heading">
                  {routine.title}
                </h3>
              </div>
            </div>

            {routine.completedToday ? (
              <div className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 text-white font-black text-sm rounded-full shadow-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>Done</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 text-slate-600 font-extrabold text-sm rounded-full">
                <Bell className="w-4 h-4 text-amber-500" />
                <span>Scheduled</span>
              </div>
            )}
          </ClayCard>
        ))}
      </div>
    </div>
  );
};
