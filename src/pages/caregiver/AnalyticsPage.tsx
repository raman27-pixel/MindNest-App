import React, { useState } from 'react';
import { LineChart, BarChart2, Clock, CheckCircle2, AlertCircle, HeartHandshake, Calendar, TrendingUp, Sparkles, ShieldCheck } from 'lucide-react';
import { ClayCard } from '../../components/ui/ClayCard';
import { ClayProgress } from '../../components/ui/ClayProgress';
import { db } from '../../services/db';

export const AnalyticsPage: React.FC = () => {
  const baseline = db.getBaseline();
  const sessions = db.getSessions();
  const [timeRange, setTimeRange] = useState<'7d' | '30d'>('7d');

  const totalSessions = sessions.length;
  const completedCount = sessions.filter(s => s.completed).length;
  const assistanceCount = sessions.filter(s => s.assistanceRequested).length;

  // Natural Language safe commentary
  const naturalLanguageInsight = timeRange === '7d'
    ? "Engagement has been relatively consistent this week with strong interest in family photo recognition. Three recent sessions took longer than Anita's established baseline pace, which is a normal daily variation."
    : "Over the past 30 days, activity completion remains steady at 81%. Morning tea and garden routines show the highest participation and smiling engagement.";

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      {/* Header & Range Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase text-[#6C63FF] tracking-wider font-heading">
            Longitudinal Engagement Engine
          </span>
          <h1 className="text-3xl font-extrabold text-slate-800 font-heading">
            Activity Analysis & Personal Baseline
          </h1>
          <p className="text-sm font-bold text-slate-500 mt-1">
            Metrics are compared exclusively to <strong className="text-slate-800">Anita's own history</strong> to recognize meaningful engagement shifts.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm self-start sm:self-auto">
          <button
            onClick={() => setTimeRange('7d')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              timeRange === '7d' ? 'bg-[#6C63FF] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setTimeRange('30d')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              timeRange === '30d' ? 'bg-[#6C63FF] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Last 30 Days
          </button>
        </div>
      </div>

      {/* Natural Language Insight Banner */}
      <div className="bg-[#6C63FF]/10 border-2 border-[#6C63FF]/20 rounded-[26px] p-5 flex items-start gap-4">
        <div className="w-11 h-11 rounded-2xl bg-[#6C63FF] text-white flex items-center justify-center shrink-0 shadow-md mt-0.5">
          <Sparkles className="w-6 h-6" />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-black uppercase text-[#6C63FF] tracking-wider font-heading">
            Supportive Engagement Commentary
          </span>
          <p className="text-base font-extrabold text-slate-800 leading-snug">
            "{naturalLanguageInsight}"
          </p>
          <span className="text-[11px] font-bold text-slate-500 mt-1">
            Supportive observation for caregiver check-in — not a diagnostic index.
          </span>
        </div>
      </div>

      {/* 4 Core Stat Cards: Baseline vs Current */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ClayCard padding="md" className="flex flex-col gap-1.5 border-2 border-white shadow-clay-card">
          <span className="text-[10px] font-black uppercase text-slate-400">Total Activities</span>
          <span className="text-3xl font-black text-slate-800 font-heading">{totalSessions}</span>
          <span className="text-[11px] font-bold text-emerald-600">Sample Baseline Size</span>
        </ClayCard>

        <ClayCard padding="md" className="flex flex-col gap-1.5 border-2 border-white shadow-clay-card">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-black uppercase">Avg Duration</span>
            <Clock className="w-4 h-4 text-[#6C63FF]" />
          </div>
          <span className="text-3xl font-black text-slate-800 font-heading">
            {Math.round(baseline.averageSessionDurationSeconds / 60)}m 10s
          </span>
          <span className="text-[11px] font-bold text-amber-600">Recent: 7m 10s (+2m)</span>
        </ClayCard>

        <ClayCard padding="md" className="flex flex-col gap-1.5 border-2 border-white shadow-clay-card">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-black uppercase">Completion Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-3xl font-black text-slate-800 font-heading">
            {Math.round(baseline.completionRate * 100)}%
          </span>
          <span className="text-[11px] font-bold text-emerald-600">Recent: 82% Consistent</span>
        </ClayCard>

        <ClayCard padding="md" className="flex flex-col gap-1.5 border-2 border-white shadow-clay-card">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-black uppercase">Assistance Level</span>
            <HeartHandshake className="w-4 h-4 text-purple-500" />
          </div>
          <span className="text-3xl font-black text-slate-800 font-heading">Low</span>
          <span className="text-[11px] font-bold text-slate-500">12% Sessions Needed Hints</span>
        </ClayCard>
      </div>

      {/* Visual Activity Type Distribution & Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ClayCard padding="lg" className="border-2 border-white shadow-clay-card flex flex-col gap-5">
          <h3 className="text-lg font-black text-slate-800 font-heading flex items-center gap-2 border-b border-slate-100 pb-3">
            <BarChart2 className="w-5 h-5 text-[#6C63FF]" />
            Activity Type Engagement
          </h3>

          <div className="flex flex-col gap-4">
            <ClayProgress
              label="Photo Recognition (Family Memories)"
              value={92}
              variant="primary"
              height="md"
            />

            <ClayProgress
              label="Picture Matching (Garden & Flowers)"
              value={84}
              variant="secondary"
              height="md"
            />

            <ClayProgress
              label="Memory Recall (Locations & Life Stories)"
              value={74}
              variant="primary"
              height="md"
            />

            <ClayProgress
              label="Daily Routine Sequencing"
              value={68}
              variant="warning"
              height="md"
            />
          </div>
        </ClayCard>

        {/* 7-Day Trend Visual Simulation */}
        <ClayCard padding="lg" className="border-2 border-white shadow-clay-card flex flex-col gap-5 justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-800 font-heading flex items-center gap-2 border-b border-slate-100 pb-3">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              7-Day Daily Session Frequency
            </h3>

            <div className="grid grid-cols-7 gap-2 pt-4 items-end h-40">
              {[
                { day: 'Wed', count: 3, height: '60%' },
                { day: 'Thu', count: 2, height: '40%' },
                { day: 'Fri', count: 4, height: '80%' },
                { day: 'Sat', count: 3, height: '60%' },
                { day: 'Sun', count: 5, height: '100%' },
                { day: 'Mon', count: 2, height: '40%' },
                { day: 'Today', count: 3, height: '60%' }
              ].map((col, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-[10px] font-black text-slate-700">{col.count}</span>
                  <div
                    className="w-full max-w-[28px] bg-[#6C63FF] rounded-t-xl transition-all shadow-sm"
                    style={{ height: col.height }}
                  />
                  <span className="text-[10px] font-bold text-slate-400">{col.day}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#F8F9FE] p-3.5 rounded-2xl flex items-center justify-between text-xs font-bold text-slate-600">
            <span>Weekly Daily Average: <strong>3.1 sessions/day</strong></span>
            <span className="text-emerald-600 font-black">Within Usual Range</span>
          </div>
        </ClayCard>
      </div>

      {/* Detailed Recent Sessions Log */}
      <ClayCard padding="lg" className="border-2 border-white shadow-clay-card flex flex-col gap-4">
        <h3 className="text-lg font-black text-slate-800 font-heading">
          Recent Activity Session Records
        </h3>

        <div className="flex flex-col gap-2.5">
          {sessions.slice(-5).reverse().map((sess) => (
            <div key={sess.id} className="p-4 bg-[#F8F9FE] border border-slate-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <CheckCircle2 className={`w-6 h-6 shrink-0 ${sess.completed ? 'text-emerald-500' : 'text-amber-500'}`} />
                <div>
                  <h4 className="text-sm font-black text-slate-800 uppercase font-heading">
                    {sess.activityType.replace(/_/g, ' ')}
                  </h4>
                  <p className="text-xs font-bold text-slate-500">
                    Duration: {Math.round(sess.durationSeconds / 60)}m {sess.durationSeconds % 60}s • {sess.correctCount || 6}/7 Questions Correct
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto text-xs font-bold text-slate-400">
                {sess.assistanceRequested && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800">
                    Hint Used
                  </span>
                )}
                <span>
                  {new Date(sess.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </ClayCard>
    </div>
  );
};
