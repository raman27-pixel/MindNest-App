import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Image, Gamepad2, Mic, MoreHorizontal } from 'lucide-react';
import { PatientThreeDotMenu } from './PatientThreeDotMenu';
import { SOSModal } from './SOSModal';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { t } from '../../locales/i18n';

export const PatientNavigation: React.FC = () => {
  const { settings } = useAccessibility();
  const lang = settings.language;
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isSOSOpen, setIsSOSOpen] = useState<boolean>(false);

  const items = [
    { to: '/patient/home', label: 'Home', icon: Home, color: 'text-[#0E8765]' },
    { to: '/patient/memories', label: 'Memory', icon: Image, color: 'text-[#0E8765]' },
    { to: '/patient/activities', label: 'Games', icon: Gamepad2, color: 'text-[#0E8765]' },
    { to: '/patient/voice', label: 'Talk', icon: Mic, color: 'text-[#0E8765]' },
  ];

  return (
    <>
      <nav 
        aria-label="Patient Main Navigation" 
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 shadow-xl px-2 py-1"
      >
        <div className="max-w-xl mx-auto grid grid-cols-5 gap-2">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `
                  flex flex-col items-center justify-center py-1.5 px-1 rounded-[16px] transition-all duration-150 min-h-[46px]
                  ${isActive 
                    ? 'bg-[#0E8765] text-white shadow-clay-primary font-black scale-102' 
                    : 'bg-[#F4F7FB] text-slate-700 hover:bg-slate-100 font-bold border border-slate-200/60'}
                `}
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-white' : 'text-slate-600'}`} />
                    <span className="text-[10px] tracking-wide font-heading truncate max-w-full">
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}

          {/* Three-Dot Menu Button */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="flex flex-col items-center justify-center py-1 px-1 rounded-[12px] bg-[#F4F7FB] text-slate-700 hover:bg-slate-100 font-bold border border-slate-200/60 min-h-[40px] transition-all"
            aria-label="Open full menu"
          >
            <MoreHorizontal className="w-5 h-5 mb-0.5 text-slate-600" />
            <span className="text-[9px] tracking-wide font-heading">
              Menu
            </span>
          </button>
        </div>
      </nav>

      {/* Slide-over Patient 3-dot Menu */}
      <PatientThreeDotMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onOpenSOS={() => setIsSOSOpen(true)}
      />

      {/* SOS Modal */}
      <SOSModal
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
      />
    </>
  );
};
