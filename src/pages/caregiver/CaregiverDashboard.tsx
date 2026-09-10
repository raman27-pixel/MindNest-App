import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Gamepad2, 
  User, 
  FileText, 
  Users, 
  Music, 
  MessageSquare, 
  Image as ImageIcon,
  Star,
  ChevronRight,
  RefreshCw,
  Plus,
  Activity
} from 'lucide-react';
import { db } from '../../services/db';
import { CaregiverBottomNav } from '../../components/common/CaregiverBottomNav';
import { PatientProfile, MeaningfulChangeAlert, FamilyMember } from '../../types';

export const CaregiverDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'Overview' | 'Engagement' | 'Insights'>('Overview');
  const [patient, setPatient] = useState<PatientProfile>(db.getPatientProfile());
  const [alerts, setAlerts] = useState<MeaningfulChangeAlert[]>(db.getChangeAlerts());
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(db.getFamilyMembers());
  const [activityCounts, setActivityCounts] = useState(db.getTodayActivityCounts());

  useEffect(() => {
    return db.subscribe(() => {
      setPatient(db.getPatientProfile());
      setAlerts(db.getChangeAlerts());
      setFamilyMembers(db.getFamilyMembers());
      setActivityCounts(db.getTodayActivityCounts());
    });
  }, []);

  const unreviewedAlerts = alerts.filter(a => a.status === 'UNREVIEWED');

  return (
    <div className="flex flex-col gap-5 max-w-lg md:max-w-4xl mx-auto pb-24">
      {/* Header matching Screen 10 */}
      <div className="bg-white rounded-[28px] p-5 shadow-clay-card border border-white flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#0E8765] shadow-sm shrink-0">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
              alt="Caregiver Rahul Borah"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 font-heading">
              Caregiver Dashboard
            </h1>
            <span className="text-xs font-bold text-slate-400">
              Last updated: Today, {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        <Link
          to="/caregiver/alerts"
          className={`w-10 h-10 rounded-full flex items-center justify-center relative shadow-clay-sm transition-all ${
            unreviewedAlerts.length > 0 ? 'bg-amber-100 text-amber-700' : 'bg-[#F4F7FB] text-slate-600'
          }`}
          title="Change Alerts"
        >
          <AlertTriangle className="w-5 h-5" />
          {unreviewedAlerts.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center">
              {unreviewedAlerts.length}
            </span>
          )}
        </Link>
      </div>

      {/* Segmented Tabs matching Screen 10: Overview | Engagement | Insights */}
      <div className="bg-slate-200/60 p-1.5 rounded-[22px] flex items-center gap-1.5 shadow-inner">
        <button
          onClick={() => setActiveTab('Overview')}
          className={`flex-1 py-2.5 rounded-[18px] text-xs sm:text-sm font-black transition-all duration-150 cursor-pointer ${
            activeTab === 'Overview'
              ? 'bg-[#0E8765] text-white shadow-clay-primary'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('Engagement')}
          className={`flex-1 py-2.5 rounded-[18px] text-xs sm:text-sm font-black transition-all duration-150 cursor-pointer ${
            activeTab === 'Engagement'
              ? 'bg-[#0E8765] text-white shadow-clay-primary'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Engagement
        </button>
        <button
          onClick={() => setActiveTab('Insights')}
          className={`flex-1 py-2.5 rounded-[18px] text-xs sm:text-sm font-black transition-all duration-150 cursor-pointer ${
            activeTab === 'Insights'
              ? 'bg-[#0E8765] text-white shadow-clay-primary'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Insights
        </button>
      </div>

      {/* Today's Engagement Section — Live Activity Counts */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-base sm:text-lg font-black text-slate-800 font-heading flex items-center gap-2">
            Today's Engagement
            {Object.values(activityCounts).some(v => v > 0) && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            )}
          </h2>
          <span className="text-xs font-bold text-[#0E8765]">
            Asha Devi • {Object.values(activityCounts).reduce((a, b) => a + b, 0)} Activities Logged
          </span>
        </div>

        {/* 2x2 Grid of Engagement Cards — Live Counts */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {/* Memory Activities */}
          <div className="bg-white rounded-[24px] p-4 shadow-clay-card border border-white flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-400">Memory Activities</span>
              <span className="text-2xl sm:text-3xl font-black text-slate-800 font-heading mt-0.5">{activityCounts.memoryActivities}</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Gamepad2 className="w-6 h-6" />
            </div>
          </div>

          {/* Music */}
          <div className="bg-white rounded-[24px] p-4 shadow-clay-card border border-white flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-400">Music</span>
              <span className="text-2xl sm:text-3xl font-black text-slate-800 font-heading mt-0.5">{activityCounts.music}</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
              <Music className="w-6 h-6" />
            </div>
          </div>

          {/* Conversation */}
          <div className="bg-white rounded-[24px] p-4 shadow-clay-card border border-white flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-400">Conversation</span>
              <span className="text-2xl sm:text-3xl font-black text-slate-800 font-heading mt-0.5">{activityCounts.conversation}</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <MessageSquare className="w-6 h-6" />
            </div>
          </div>

          {/* Family Photos */}
          <div className="bg-white rounded-[24px] p-4 shadow-clay-card border border-white flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-400">Family Photos</span>
              <span className="text-2xl sm:text-3xl font-black text-slate-800 font-heading mt-0.5">{activityCounts.familyPhotos}</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <ImageIcon className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Most Engaging Content Section matching Screen 10 */}
      <div className="bg-white rounded-[28px] p-5 shadow-clay-card border border-white flex flex-col gap-3.5">
        <h2 className="text-base sm:text-lg font-black text-slate-800 font-heading">
          Most Engaging Content
        </h2>

        {/* List items with thumbnails and star ratings */}
        <div className="flex flex-col gap-3">
          {/* Family Photographs (5 stars) */}
          <div className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-[16px] overflow-hidden bg-slate-100 shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=200&q=80"
                  alt="Family Photographs"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm font-black text-slate-800">
                Family Photographs
              </span>
            </div>
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
          </div>

          {/* Familiar Music (5 stars) */}
          <div className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-[16px] overflow-hidden bg-slate-100 shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=200&q=80"
                  alt="Familiar Music"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm font-black text-slate-800">
                Familiar Music
              </span>
            </div>
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
          </div>

          {/* Generic Puzzle (2 stars) */}
          <div className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-[16px] overflow-hidden bg-slate-100 shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=200&q=80"
                  alt="Generic Puzzle"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm font-black text-slate-800">
                Generic Puzzle
              </span>
            </div>
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(2)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
              {[...Array(3)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-slate-300" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Cards for Caregiver */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <Link
          to="/caregiver/family-story"
          className="p-3.5 bg-white rounded-[22px] shadow-clay-sm hover:shadow-clay-card border border-white flex flex-col gap-1 transition-all"
        >
          <span className="text-xs font-black text-[#0E8765]">Family Story Capture</span>
          <span className="text-xs text-slate-500 font-medium">Record voice & stories</span>
        </Link>

        <Link
          to="/caregiver/alerts"
          className="p-3.5 bg-white rounded-[22px] shadow-clay-sm hover:shadow-clay-card border border-white flex flex-col gap-1 transition-all"
        >
          <span className="text-xs font-black text-amber-600">Change Detection</span>
          <span className="text-xs text-slate-500 font-medium">View pattern shifts</span>
        </Link>

        <Link
          to="/caregiver/reports"
          className="p-3.5 bg-white rounded-[22px] shadow-clay-sm hover:shadow-clay-card border border-white flex flex-col gap-1 transition-all col-span-2 sm:col-span-1"
        >
          <span className="text-xs font-black text-blue-600">Weekly & Monthly PDF</span>
          <span className="text-xs text-slate-500 font-medium">Generate reports</span>
        </Link>
      </div>

      {/* Caregiver Bottom Nav for Mobile view matching Screen 10 */}
      <CaregiverBottomNav />
    </div>
  );
};
