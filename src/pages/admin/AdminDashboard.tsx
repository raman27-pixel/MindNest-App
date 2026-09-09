import React from 'react';
import { ShieldAlert, Server, Activity, Users, Lock } from 'lucide-react';
import { ClayCard } from '../../components/ui/ClayCard';
import { db } from '../../services/db';

export const AdminDashboard: React.FC = () => {
  const auditLogs = db.getAuditLogs();

  return (
    <div className="flex flex-col gap-8 max-w-5xl">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 font-heading">
          System Administration Dashboard
        </h1>
        <p className="text-base font-bold text-slate-500 mt-1">
          System-level monitoring only. Restricted access — no private memory content viewable per privacy policy.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <ClayCard padding="md" className="flex flex-col gap-2">
          <span className="text-xs font-black uppercase text-slate-400">System API Status</span>
          <span className="text-2xl font-black text-emerald-600 font-heading">Operational (100%)</span>
        </ClayCard>

        <ClayCard padding="md" className="flex flex-col gap-2">
          <span className="text-xs font-black uppercase text-slate-400">Active Patient Accounts</span>
          <span className="text-2xl font-black text-slate-800 font-heading">1 (Anita Sharma)</span>
        </ClayCard>

        <ClayCard padding="md" className="flex flex-col gap-2">
          <span className="text-xs font-black uppercase text-slate-400">Memory Privacy Policy</span>
          <span className="text-2xl font-black text-[#6C63FF] font-heading">ENFORCED</span>
        </ClayCard>
      </div>

      <ClayCard padding="lg" className="flex flex-col gap-4">
        <h3 className="text-xl font-black text-slate-800 font-heading flex items-center gap-2 border-b border-slate-100 pb-3">
          <Lock className="w-6 h-6 text-[#6C63FF]" />
          System Audit Log Trail
        </h3>

        <div className="flex flex-col gap-2">
          {auditLogs.map((log) => (
            <div key={log.id} className="p-3 bg-[#F0F3FA] rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="font-black px-2 py-0.5 rounded bg-white text-slate-800 border">{log.userRole}</span>
                <span className="font-bold text-slate-800">{log.action}:</span>
                <span className="font-semibold text-slate-600">{log.details}</span>
              </div>
              <span className="text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
            </div>
          ))}
        </div>
      </ClayCard>
    </div>
  );
};
