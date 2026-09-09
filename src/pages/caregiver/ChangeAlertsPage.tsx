import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, TrendingUp, Activity, Check, Eye } from 'lucide-react';
import { db } from '../../services/db';
import { MeaningfulChangeAlert } from '../../types';

export const ChangeAlertsPage: React.FC = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<MeaningfulChangeAlert[]>(db.getChangeAlerts());
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [reviewed, setReviewed] = useState<boolean>(false);

  const handleMarkForReview = () => {
    setReviewed(true);
    if (alerts.length > 0) {
      db.updateAlertStatus(alerts[0].id, 'REVIEWED');
      setAlerts(db.getChangeAlerts());
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] pb-24 pt-3 px-4 max-w-md mx-auto flex flex-col justify-between">
      {/* Top Header matching Screen 11 */}
      <div className="flex items-center justify-between py-2">
        <button
          onClick={() => navigate('/caregiver/dashboard')}
          className="w-10 h-10 rounded-full bg-white shadow-clay-sm flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-all"
          aria-label="Go Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h1 className="text-base font-black text-slate-800 font-heading">
          Change Detection
        </h1>

        <div className="w-10" />
      </div>

      {/* Main Alert Card matching Screen 11 */}
      <div className="bg-white rounded-[32px] p-6 shadow-clay-card border border-white flex flex-col gap-5 my-auto">
        {/* Red Warning Header */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 font-heading">
            Notable Change Detected
          </h2>
        </div>

        {/* Narrative Description matching Screen 11 */}
        <p className="text-sm sm:text-base font-semibold text-slate-700 leading-relaxed">
          Today, Asha took 2x longer to complete the memory activity compared to her usual time.
        </p>

        {/* Metrics Comparison Box matching Screen 11 */}
        <div className="grid grid-cols-2 gap-3 bg-[#F4F7FB] p-4 rounded-[22px] border border-slate-200/60">
          {/* Avg Time past week */}
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-slate-500">
              Avg. time (past week)
            </span>
            <span className="text-lg sm:text-xl font-black text-slate-800 font-heading mt-0.5">
              4 min 12 sec
            </span>
            <div className="mt-2 flex items-center gap-1 text-xs font-bold text-blue-600">
              <Activity className="w-3.5 h-3.5" />
              <span>Usual baseline</span>
            </div>
          </div>

          {/* Today's Time */}
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-slate-500">
              Today's Time
            </span>
            <span className="text-lg sm:text-xl font-black text-rose-600 font-heading mt-0.5">
              9 min 45 sec
            </span>
            <div className="mt-2 flex items-center gap-1 text-xs font-black text-rose-600">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+132% slower</span>
            </div>
          </div>
        </div>

        {/* Action Buttons matching Screen 11: View Details | Mark for Review */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => setShowDetail((prev) => !prev)}
            className="py-3 px-4 rounded-[20px] bg-white hover:bg-slate-50 border border-slate-200 text-xs font-black text-slate-700 shadow-clay-sm transition-all"
          >
            {showDetail ? 'Hide Details' : 'View Details'}
          </button>

          <button
            onClick={handleMarkForReview}
            className={`py-3 px-4 rounded-[20px] text-xs font-black text-white font-heading shadow-clay-primary transition-all flex items-center justify-center gap-1.5 ${
              reviewed ? 'bg-emerald-600' : 'bg-[#0E8765] hover:bg-[#0B6D52]'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>{reviewed ? 'Reviewed ✓' : 'Mark for Review'}</span>
          </button>
        </div>

        {/* Expanded Detail view */}
        {showDetail && (
          <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-[20px] text-xs font-medium text-slate-700 flex flex-col gap-2 animate-fade-in">
            <span className="font-bold text-amber-900">Caregiver Observation Notes:</span>
            <p>
              Asha spent longer observing the 1985 family photo. She did not display frustration, but asked for tea twice before confirming the family members.
            </p>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
              Supportive activity report — not a medical diagnosis.
            </span>
          </div>
        )}
      </div>

      <div className="text-center pt-2">
        <span className="text-xs text-slate-400 font-semibold">
          MindNest Continuous Baseline • Updated with each activity session
        </span>
      </div>
    </div>
  );
};
