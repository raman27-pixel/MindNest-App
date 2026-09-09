import React from 'react';
import { Settings, Shield, Bell, UserCheck, Smartphone } from 'lucide-react';
import { ClayCard } from '../../components/ui/ClayCard';
import { ClayButton } from '../../components/ui/ClayButton';

export const SettingsPage: React.FC = () => {
  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 font-heading">
          Caregiver Settings & Preferences
        </h1>
        <p className="text-base font-bold text-slate-500 mt-1">
          System configuration, role permissions, and notification thresholds.
        </p>
      </div>

      <ClayCard padding="lg" className="flex flex-col gap-6">
        <h3 className="text-xl font-black text-slate-800 font-heading flex items-center gap-2 border-b border-slate-100 pb-3">
          <UserCheck className="w-6 h-6 text-[#6C63FF]" />
          Caregiver Account Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-400">Account Name</span>
            <span className="text-base font-extrabold text-slate-800">Rahul Sharma</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-400">Role & Relationship</span>
            <span className="text-base font-extrabold text-[#6C63FF]">Primary Family Caregiver (Son)</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-400">Email Address</span>
            <span className="text-base font-extrabold text-slate-800">rahul@mindnest.app</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-400">Assigned Patient</span>
            <span className="text-base font-extrabold text-slate-800">Anita Sharma (ID: patient-anita-123)</span>
          </div>
        </div>
      </ClayCard>

      <ClayCard padding="lg" className="flex flex-col gap-4">
        <h3 className="text-xl font-black text-slate-800 font-heading flex items-center gap-2 border-b border-slate-100 pb-3">
          <Bell className="w-6 h-6 text-amber-500" />
          Notification & Alert Preferences
        </h3>

        <div className="flex flex-col gap-3">
          <label className="flex items-center justify-between p-3 bg-[#F0F3FA] rounded-2xl cursor-pointer">
            <span className="text-sm font-extrabold text-slate-800">Receive Meaningful Change Alerts (NOTICE & ATTENTION)</span>
            <input type="checkbox" defaultChecked className="w-5 h-5 text-[#6C63FF]" />
          </label>

          <label className="flex items-center justify-between p-3 bg-[#F0F3FA] rounded-2xl cursor-pointer">
            <span className="text-sm font-extrabold text-slate-800">Daily AI Summary Email Report</span>
            <input type="checkbox" defaultChecked className="w-5 h-5 text-[#6C63FF]" />
          </label>

          <label className="flex items-center justify-between p-3 bg-[#F0F3FA] rounded-2xl cursor-pointer">
            <span className="text-sm font-extrabold text-slate-800">SMS Reminders for Emergency Family Check-in</span>
            <input type="checkbox" defaultChecked className="w-5 h-5 text-[#6C63FF]" />
          </label>
        </div>
      </ClayCard>
    </div>
  );
};
