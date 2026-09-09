import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  User, 
  Images, 
  LineChart, 
  FileText, 
  Users, 
  Link2, 
  Volume2, 
  AlertTriangle, 
  Sparkles, 
  ShieldCheck, 
  Settings 
} from 'lucide-react';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { t } from '../../locales/i18n';

export const CaregiverSidebar: React.FC = () => {
  const { settings } = useAccessibility();
  const lang = settings.caregiverLanguage || 'en';

  const navItems = [
    { to: '/caregiver/dashboard', label: t('caregiver.dashboard', lang), icon: LayoutDashboard },
    { to: '/caregiver/profile', label: t('caregiver.patientProfile', lang), icon: User },
    { to: '/caregiver/memories', label: t('caregiver.memoryLibrary', lang), icon: Images },
    { to: '/caregiver/analytics', label: t('caregiver.activityAnalysis', lang), icon: LineChart },
    { to: '/caregiver/reports', label: t('caregiver.reports', lang), icon: FileText },
    { to: '/caregiver/family', label: t('caregiver.familyMembers', lang), icon: Users },
    { to: '/caregiver/connected-accounts', label: t('caregiver.connectedAccounts', lang), icon: Link2 },
    { to: '/caregiver/voice-settings', label: t('caregiver.voiceSettings', lang), icon: Volume2 },
    { to: '/caregiver/alerts', label: t('caregiver.meaningfulChanges', lang), icon: AlertTriangle, badge: '1' },
    { to: '/caregiver/ai-recommendations', label: t('caregiver.aiRecommendations', lang), icon: Sparkles },
    { to: '/caregiver/consent', label: t('caregiver.consentPrivacy', lang), icon: ShieldCheck },
    { to: '/caregiver/settings', label: t('caregiver.settings', lang), icon: Settings },
  ];

  return (
    <aside className="w-72 shrink-0 hidden lg:block bg-[#EEF1F8] border-r border-[#E2E6F0] min-h-[calc(100vh-65px)] p-5">
      <div className="flex flex-col gap-5">
        {/* Assigned Patient Card */}
        <div className="bg-white p-4 rounded-2xl shadow-clay-card flex items-center gap-3 border border-white">
          <div className="w-11 h-11 rounded-full bg-[#6C63FF]/10 text-[#6C63FF] font-black flex items-center justify-center text-sm border border-[#6C63FF]/20">
            AS
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Assigned Patient</span>
            <span className="text-sm font-black text-slate-800 truncate">Anita Sharma (Age 72)</span>
          </div>
        </div>

        {/* Navigation List */}
        <nav aria-label="Caregiver Navigation" className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `
                  flex items-center justify-between px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all duration-150
                  ${isActive 
                    ? 'bg-[#6C63FF] text-white shadow-clay-primary translate-x-1' 
                    : 'text-slate-600 hover:bg-white hover:text-slate-900 shadow-none'}
                `}
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 text-[10px] font-black bg-amber-500 text-white rounded-full shadow-sm">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
