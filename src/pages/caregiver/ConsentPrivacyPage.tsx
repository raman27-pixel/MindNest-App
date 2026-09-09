import React, { useState } from 'react';
import { ShieldCheck, Download, Trash2, Lock, History, AlertTriangle } from 'lucide-react';
import { ClayCard } from '../../components/ui/ClayCard';
import { ClayButton } from '../../components/ui/ClayButton';
import { db } from '../../services/db';
import { ConsentSettings, AuditLog } from '../../types';

export const ConsentPrivacyPage: React.FC = () => {
  const [consent, setConsent] = useState<ConsentSettings>(db.getConsent());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(db.getAuditLogs());

  const handleToggle = (key: keyof ConsentSettings) => {
    if (typeof consent[key] === 'boolean') {
      const updated = { [key]: !consent[key] };
      setConsent(db.updateConsent(updated));
    }
  };

  const handleExport = () => {
    const jsonStr = db.exportPatientData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mindnest-patient-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = () => {
    if (confirm('CAUTION: Are you sure you want to delete all personal memories and activity session history for Anita Sharma? This action cannot be undone.')) {
      db.deletePatientData();
      setAuditLogs(db.getAuditLogs());
      alert('Patient memory and session data has been erased.');
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 font-heading">
          Consent & Privacy Controls
        </h1>
        <p className="text-base font-bold text-slate-500 mt-1">
          Role-based data access, granular consent switches, full data export, and append-only audit logging.
        </p>
      </div>

      {/* Consent Switches */}
      <ClayCard padding="lg" className="flex flex-col gap-6">
        <h3 className="text-xl font-black text-slate-800 font-heading flex items-center gap-2 border-b border-slate-100 pb-3">
          <ShieldCheck className="w-6 h-6 text-emerald-500" />
          Active Consent Categories
        </h3>

        <div className="flex flex-col gap-4">
          {[
            { key: 'personalProfile', title: 'Personal Profile Data', desc: 'Allow storing name, age, communication preferences, and context.' },
            { key: 'photos', title: 'Family Memories & Photos', desc: 'Allow photo library storage for Memory Lane reminiscence.' },
            { key: 'voiceData', title: 'Voice Companion Data', desc: 'Allow processing voice prompts for Text-to-Speech & Speech-to-Text.' },
            { key: 'aiPersonalization', title: 'AI Personalization Engine', desc: 'Allow AI to select approved family memories for cognitive activities.' },
            { key: 'caregiverSharing', title: 'Family Caregiver Sharing', desc: 'Share activity completion summary and alerts with authorized son Rahul.' },
            { key: 'professionalAccess', title: 'Professional Caregiver / Nurse Access', desc: 'Grant read access to authorized professional staff.' },
          ].map((item) => (
            <div key={item.key} className="p-4 bg-[#F0F3FA] rounded-2xl flex items-center justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-base font-extrabold text-slate-800">{item.title}</span>
                <span className="text-xs font-semibold text-slate-500">{item.desc}</span>
              </div>

              <button
                onClick={() => handleToggle(item.key as keyof ConsentSettings)}
                className={`px-4 py-2 rounded-full text-xs font-black transition-colors shrink-0 ${
                  consent[item.key as keyof ConsentSettings]
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-300 text-slate-700'
                }`}
              >
                {consent[item.key as keyof ConsentSettings] ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>
          ))}
        </div>
      </ClayCard>

      {/* Data Export & Deletion */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ClayCard padding="lg" className="flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-black text-slate-800 font-heading flex items-center gap-2">
              <Download className="w-5 h-5 text-[#6C63FF]" />
              Export Patient Data
            </h3>
            <p className="text-sm font-semibold text-slate-600">
              Download complete patient profile, approved memory library, session history, and change alerts in JSON format.
            </p>
          </div>
          <ClayButton variant="primary" size="md" onClick={handleExport} icon={<Download className="w-5 h-5" />}>
            Export Full Record (JSON)
          </ClayButton>
        </ClayCard>

        <ClayCard padding="lg" className="flex flex-col justify-between gap-4 bg-rose-50/50 border border-rose-200">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-black text-slate-800 font-heading flex items-center gap-2 text-rose-700">
              <Trash2 className="w-5 h-5 text-rose-600" />
              Delete Patient Data
            </h3>
            <p className="text-sm font-semibold text-slate-600">
              Permanently erase memory library items, recorded sessions, and baseline analytics per consent request.
            </p>
          </div>
          <ClayButton variant="alert" size="md" onClick={handleDelete} icon={<Trash2 className="w-5 h-5" />}>
            Erase All Patient Data
          </ClayButton>
        </ClayCard>
      </div>

      {/* Audit Logs Table */}
      <ClayCard padding="lg" className="flex flex-col gap-4">
        <h3 className="text-lg font-black text-slate-800 font-heading flex items-center gap-2 border-b border-slate-100 pb-3">
          <History className="w-5 h-5 text-[#6C63FF]" />
          System Audit Trail Log
        </h3>
        <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
          {auditLogs.map((log) => (
            <div key={log.id} className="p-3 bg-[#F0F3FA] rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="font-black px-2 py-0.5 rounded bg-white text-slate-800 border">{log.userRole}</span>
                <span className="font-extrabold text-slate-800">{log.action}:</span>
                <span className="font-semibold text-slate-600">{log.details}</span>
              </div>
              <span className="font-bold text-slate-400">
                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </ClayCard>
    </div>
  );
};
