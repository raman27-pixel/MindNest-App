import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  Home, 
  Image, 
  Gamepad2, 
  Mic, 
  CalendarHeart, 
  Languages, 
  Eye, 
  Users, 
  AlertOctagon, 
  Settings, 
  HelpCircle, 
  LogOut, 
  User 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { t } from '../../locales/i18n';

interface PatientThreeDotMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSOS: () => void;
}

export const PatientThreeDotMenu: React.FC<PatientThreeDotMenuProps> = ({
  isOpen,
  onClose,
  onOpenSOS
}) => {
  const navigate = useNavigate();
  const { logout, switchRole } = useAuth();
  const { settings } = useAccessibility();
  const lang = settings.language;

  if (!isOpen) return null;

  const menuItems = [
    {
      icon: Home,
      label: 'Home',
      action: () => { navigate('/patient/home'); onClose(); },
      color: 'bg-[#E6F5EF] text-[#0E8765]'
    },
    {
      icon: User,
      label: 'Patient Profile & Regional Culture',
      action: () => { navigate('/patient/regional-context'); onClose(); },
      color: 'bg-[#E6F0FA] text-blue-700'
    },
    {
      icon: Image,
      label: 'Memory Library',
      action: () => { navigate('/patient/memories'); onClose(); },
      color: 'bg-emerald-50 text-emerald-700'
    },
    {
      icon: CalendarHeart,
      label: 'Daily Tasks (Step-by-Step)',
      action: () => { navigate('/patient/tasks'); onClose(); },
      color: 'bg-amber-50 text-amber-700'
    },
    {
      icon: Mic,
      label: 'Cultural Music',
      action: () => { navigate('/patient/music'); onClose(); },
      color: 'bg-purple-50 text-purple-700'
    },
    {
      icon: Eye,
      label: 'Festivals & Culture',
      action: () => { navigate('/patient/festivals'); onClose(); },
      color: 'bg-rose-50 text-rose-700'
    },
    {
      icon: Users,
      label: 'Places I Remember',
      action: () => { navigate('/patient/places'); onClose(); },
      color: 'bg-teal-50 text-teal-700'
    },
    {
      icon: Gamepad2,
      label: 'Arrange the Journey Activity',
      action: () => { navigate('/patient/journey'); onClose(); },
      color: 'bg-sky-50 text-sky-700'
    },
    {
      icon: Languages,
      label: 'Offline Mode',
      action: () => { navigate('/patient/offline'); onClose(); },
      color: 'bg-slate-100 text-slate-700'
    },
    {
      icon: Settings,
      label: 'Settings & Language',
      action: () => { navigate('/patient/settings'); onClose(); },
      color: 'bg-slate-100 text-slate-700'
    },
    {
      icon: AlertOctagon,
      label: 'SOS Emergency Help',
      action: () => { onClose(); onOpenSOS(); },
      color: 'bg-rose-500 text-white font-black'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in p-2 sm:p-4">
      <div 
        className="w-full max-w-lg bg-white rounded-t-[36px] sm:rounded-[36px] shadow-2xl p-6 sm:p-8 flex flex-col gap-5 max-h-[85vh] overflow-y-auto border-2 border-white"
        role="dialog"
        aria-modal="true"
        aria-label="Patient Menu"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex flex-col">
            <span className="text-xs font-black uppercase text-[#6C63FF] tracking-wider font-heading">
              MindNest Navigation
            </span>
            <h3 className="text-2xl font-black text-slate-800 font-heading">
              {t('common.menu', lang)}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-11 h-11 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={item.action}
                className="flex items-center gap-3.5 p-4 rounded-[22px] bg-[#F8F9FE] hover:bg-[#EEF2FC] border border-slate-100 transition-all text-left group"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${item.color} shadow-sm group-hover:scale-105 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-base font-extrabold text-slate-800 font-heading">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              switchRole('CAREGIVER');
              navigate('/caregiver/dashboard');
              onClose();
            }}
            className="text-xs font-extrabold text-[#6C63FF] hover:underline p-2"
          >
            Switch to Caregiver View →
          </button>

          <button
            onClick={() => {
              logout();
              navigate('/');
              onClose();
            }}
            className="flex items-center gap-1.5 text-xs font-extrabold text-rose-500 hover:text-rose-700 p-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Exit Experience</span>
          </button>
        </div>
      </div>
    </div>
  );
};
