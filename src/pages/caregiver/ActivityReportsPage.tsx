import React, { useState } from 'react';
import { FileText, Download, Share2, Copy, CheckCircle2, ShieldAlert, Calendar, User, Clock, AlertTriangle, Sparkles } from 'lucide-react';
import jsPDF from 'jspdf';
import { ClayCard } from '../../components/ui/ClayCard';
import { db } from '../../services/db';
import { ActivityReport, SharedReportLink } from '../../types';

export const ActivityReportsPage: React.FC = () => {
  const patient = db.getPatientProfile();
  const baseline = db.getBaseline();
  const reports = db.getReports();
  const activeReport: ActivityReport = reports[0] || {
    id: `rep-${Date.now()}`,
    patientId: patient.id,
    patientName: patient.name,
    reportDateRange: 'Past 7 Days (September 2 – September 9, 2026)',
    generatedAt: new Date().toISOString(),
    totalActivitiesCompleted: 18,
    completionRate: 0.81,
    averageDurationMinutes: 5.6,
    assistanceLevel: 'Low',
    activityBreakdown: {
      'Photo Recognition': 8,
      'Picture Matching': 6,
      'Memory Recall': 4
    },
    baselineComparison: {
      durationDelta: '+0.5 min vs established baseline',
      completionDelta: '-4% vs baseline',
      commentary: 'High positive engagement with familiar family photos. Recall tasks took slightly more time with gentle pacing.'
    },
    caregiverNotes: 'Anita had peaceful sleep most days. Looked delighted when viewing the Lodhi Gardens picnic photo with little Aarav.',
    aiSummary: 'Over the past 7 days, Anita completed 18 supportive activities. Family photo recognition remains a source of high positive engagement. Slight time variations on recall tasks indicate natural pacing changes.',
    disclaimer: 'Supportive activity report for caregiver review — not a medical or diagnostic assessment.'
  };

  const [recipientType, setRecipientType] = useState<SharedReportLink['recipientType']>('DOCTOR');
  const [recipientName, setRecipientName] = useState<string>('Dr. Ashok Raman');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // Generate & Download PDF using jsPDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Header & Branding
    doc.setFillColor(108, 99, 255); // #6C63FF
    doc.rect(0, 0, 210, 22, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('MindNest Supportive Activity Report', 14, 14);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Exported: ${new Date().toLocaleDateString()}`, 150, 14);

    // Disclaimer Box
    doc.setFillColor(245, 246, 250);
    doc.rect(14, 28, 182, 12, 'F');
    doc.setTextColor(180, 83, 9); // amber-700
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.text('IMPORTANT: Supportive engagement report for family & caregiver review. Not a medical diagnosis.', 18, 35);

    // Patient Profile Section
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(12);
    doc.text('1. Patient Profile Summary', 14, 48);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Patient Name: ${activeReport.patientName}`, 14, 56);
    doc.text(`Age: ${patient.age} years`, 14, 62);
    doc.text(`Date Range: ${activeReport.reportDateRange}`, 14, 68);
    doc.text(`Primary Caregiver: Rahul Sharma (Son)`, 14, 74);

    // Activity Engagement Summary
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('2. Weekly Engagement Metrics', 14, 86);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Total Activities Completed: ${activeReport.totalActivitiesCompleted}`, 14, 94);
    doc.text(`Completion Rate: ${Math.round(activeReport.completionRate * 100)}%`, 14, 100);
    doc.text(`Average Session Duration: ${activeReport.averageDurationMinutes} minutes`, 14, 106);
    doc.text(`Typical Assistance Level: ${activeReport.assistanceLevel}`, 14, 112);

    // Personal Baseline Comparison
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('3. Comparison to Patient Established Baseline', 14, 124);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.text(`Baseline Duration: ${Math.round(baseline.averageSessionDurationSeconds / 60)} mins (Current: ${activeReport.averageDurationMinutes} mins, ${activeReport.baselineComparison.durationDelta})`, 14, 132);
    doc.text(`Baseline Completion: ${Math.round(baseline.completionRate * 100)}% (Current: ${Math.round(activeReport.completionRate * 100)}%, ${activeReport.baselineComparison.completionDelta})`, 14, 138);

    doc.setFont('helvetica', 'italic');
    const splitCommentary = doc.splitTextToSize(activeReport.baselineComparison.commentary, 180);
    doc.text(splitCommentary, 14, 146);

    // Caregiver Notes
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('4. Caregiver Observations', 14, 162);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    const splitNotes = doc.splitTextToSize(`"${activeReport.caregiverNotes}"`, 180);
    doc.text(splitNotes, 14, 170);

    // AI Non-Diagnostic Summary
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('5. Supportive Engagement Summary', 14, 186);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    const splitAi = doc.splitTextToSize(activeReport.aiSummary, 180);
    doc.text(splitAi, 14, 194);

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('MindNest Dementia Companion • Safe, Human-in-the-loop, Non-Clinical System', 14, 280);

    doc.save(`MindNest_Activity_Report_${patient.name.replace(/\s+/g, '_')}.pdf`);
  };


  // Generate Secure Expiring Share Link
  const handleCreateShareLink = () => {
    const sharedLink = db.createSharedReportLink(activeReport.id, recipientType, recipientName);
    const fullUrl = `${window.location.origin}/caregiver/reports?token=${sharedLink.shareToken}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(fullUrl);
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase text-[#6C63FF] tracking-wider font-heading">
            Professional Documentation
          </span>
          <h1 className="text-3xl font-extrabold text-slate-800 font-heading">
            Activity Reports & Sharing
          </h1>
          <p className="text-sm font-bold text-slate-500 mt-1">
            Export printable, non-diagnostic activity summaries for physicians, nurses, or family members.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleDownloadPDF}
            className="clay-btn-primary px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Report Preview Document */}
      <ClayCard padding="xl" className="border-2 border-white shadow-clay-card flex flex-col gap-6 bg-white">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <span className="text-[10px] font-black uppercase text-[#6C63FF] tracking-wider font-heading">
              Official Caregiver Document
            </span>
            <h2 className="text-2xl font-black text-slate-800 font-heading">
              Supportive Activity Report
            </h2>
            <span className="text-xs font-bold text-slate-400">
              {activeReport.reportDateRange}
            </span>
          </div>

          <div className="bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-full text-xs font-bold text-amber-800 self-start sm:self-auto flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>Supportive report — not a medical diagnosis</span>
          </div>
        </div>

        {/* 4 Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-2xl bg-[#F8F9FE] border border-slate-100 flex flex-col gap-1">
            <span className="text-[10px] font-black uppercase text-slate-400">Activities Completed</span>
            <span className="text-2xl font-black text-slate-800 font-heading">{activeReport.totalActivitiesCompleted}</span>
            <span className="text-[10px] font-bold text-emerald-600">Across 7 Days</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F8F9FE] border border-slate-100 flex flex-col gap-1">
            <span className="text-[10px] font-black uppercase text-slate-400">Completion Rate</span>
            <span className="text-2xl font-black text-slate-800 font-heading">{Math.round(activeReport.completionRate * 100)}%</span>
            <span className="text-[10px] font-bold text-slate-500">Consistent Pacing</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F8F9FE] border border-slate-100 flex flex-col gap-1">
            <span className="text-[10px] font-black uppercase text-slate-400">Average Duration</span>
            <span className="text-2xl font-black text-slate-800 font-heading">{activeReport.averageDurationMinutes}m</span>
            <span className="text-[10px] font-bold text-amber-600">+0.5m vs Baseline</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F8F9FE] border border-slate-100 flex flex-col gap-1">
            <span className="text-[10px] font-black uppercase text-slate-400">Assistance Level</span>
            <span className="text-2xl font-black text-slate-800 font-heading">{activeReport.assistanceLevel}</span>
            <span className="text-[10px] font-bold text-emerald-600">Minimal Hints Needed</span>
          </div>
        </div>

        {/* Baseline Comparison */}
        <div className="flex flex-col gap-2 p-4 rounded-2xl bg-[#F8F9FE] border border-slate-100">
          <span className="text-xs font-black uppercase text-slate-500 tracking-wider">
            Personal Baseline Observation
          </span>
          <p className="text-sm font-bold text-slate-700 leading-relaxed">
            {activeReport.baselineComparison.commentary}
          </p>
        </div>

        {/* AI Non-Diagnostic Summary */}
        <div className="flex flex-col gap-2 p-4 rounded-2xl bg-[#6C63FF]/5 border border-[#6C63FF]/20">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#6C63FF]" />
            <span className="text-xs font-black uppercase text-[#6C63FF] tracking-wider">
              AI Engagement Summary
            </span>
          </div>
          <p className="text-sm font-bold text-slate-700 leading-relaxed">
            {activeReport.aiSummary}
          </p>
        </div>

        {/* Caregiver Notes */}
        <div className="flex flex-col gap-1 text-xs font-bold text-slate-600">
          <span className="font-black text-slate-800">Caregiver Notes:</span>
          <p className="italic">"{activeReport.caregiverNotes}"</p>
        </div>
      </ClayCard>

      {/* Secure Expiring Sharing Section */}
      <ClayCard padding="lg" className="border-2 border-white shadow-clay-card flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-800 font-heading">
              Secure Expiring Report Sharing
            </h3>
            <p className="text-xs font-bold text-slate-400">
              Generate encrypted, temporary links that expire automatically in 7 days.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <label className="flex flex-col gap-1 text-xs font-extrabold text-slate-700">
            <span>Recipient Type:</span>
            <select
              value={recipientType}
              onChange={(e) => setRecipientType(e.target.value as any)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white"
            >
              <option value="DOCTOR">🩺 Doctor / Geriatrician</option>
              <option value="PRIMARY_CAREGIVER">👨‍👩‍👧 Primary Caregiver</option>
              <option value="FAMILY_MEMBER">🏡 Family Member</option>
              <option value="OTHER">Other Authorized Contact</option>
            </select>
          </label>

          <label className="flex flex-col gap-1 text-xs font-extrabold text-slate-700 sm:col-span-2">
            <span>Recipient Name:</span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white"
                placeholder="e.g. Dr. Ashok Raman"
              />
              <button
                onClick={handleCreateShareLink}
                className="clay-btn-primary px-4 py-2 rounded-xl text-xs font-black shrink-0"
              >
                Create Expiring Link
              </button>
            </div>
          </label>
        </div>

        {copiedLink && (
          <div className="bg-emerald-50 border border-emerald-300 p-3 rounded-xl flex items-center justify-between text-xs font-bold text-emerald-900 animate-fade-in">
            <div className="flex items-center gap-2 truncate">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="truncate">Link copied to clipboard (Expires in 7 days)</span>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(copiedLink)}
              className="ml-2 text-xs font-black underline shrink-0"
            >
              Copy Again
            </button>
          </div>
        )}
      </ClayCard>
    </div>
  );
};
