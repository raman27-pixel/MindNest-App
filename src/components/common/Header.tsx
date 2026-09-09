import React from 'react';
import { Heart, Sparkles, UserCheck, RefreshCw, Lock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { AccessibilityControl } from '../ui/AccessibilityControl';
import { UserRole } from '../../types';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  const { user, role, switchRole, isDemoMode } = useAuth();

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    switchRole(e.target.value as UserRole);
  };

  return (
    <header className="w-full bg-white/80 backdrop-blur-md border-b border-[#E2E6F0] sticky top-0 z-30 px-4 md:px-8 py-3.5 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand & Logo */}
        <Link to="/" className="flex items-center gap-3 group focus:outline-none">
          <div className="w-11 h-11 rounded-2xl bg-[#0E8765] shadow-clay-primary flex items-center justify-center text-white group-hover:scale-105 transition-transform">
            <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-slate-800 tracking-tight font-heading">
                Mind<span className="text-[#0E8765]">Nest</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider font-extrabold bg-[#0E8765]/10 text-[#0E8765] px-2 py-0.5 rounded-full border border-[#0E8765]/20">
                Companion
              </span>
            </div>
            <span className="text-xs text-slate-500 font-semibold hidden sm:inline">
              Familiar memories. Meaningful moments.
            </span>
          </div>
        </Link>

        {/* Controls & Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          {/* Accessibility Widget */}
          <AccessibilityControl />

          {/* Quick Role Switcher for Demo Mode */}
          {isDemoMode && (
            <div className="flex items-center gap-2 bg-[#EDF2F8] px-3 py-1.5 rounded-2xl border border-slate-200 shadow-inner">
              <RefreshCw className="w-4 h-4 text-[#0E8765] shrink-0" />
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase text-slate-400">Demo Role</span>
                <select
                  value={role}
                  onChange={handleRoleChange}
                  className="bg-transparent font-extrabold text-xs text-slate-800 focus:outline-none cursor-pointer"
                  aria-label="Switch active demo role"
                >
                  <option value="PATIENT">👵 Asha Devi (Patient)</option>
                  <option value="CAREGIVER">👨‍👩‍👧 Rahul Borah (Caregiver)</option>
                  <option value="PROFESSIONAL_CAREGIVER">🩺 Dr. Barua (Physician)</option>
                  <option value="ADMIN">🛡️ Admin</option>
                </select>
              </div>
            </div>
          )}

          {/* Active Navigation Route Shortcut */}
          <Link
            to={role === 'PATIENT' ? '/patient/home' : '/caregiver/dashboard'}
            className="clay-btn-primary py-2 px-3.5 text-xs font-black rounded-2xl flex items-center gap-1.5 shadow-sm"
          >
            <span className="hidden md:inline">
              {role === 'PATIENT' ? 'Patient Mode' : 'Caregiver Portal'}
            </span>
            <span className="md:hidden">
              {role === 'PATIENT' ? 'Patient' : 'Portal'}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
};
