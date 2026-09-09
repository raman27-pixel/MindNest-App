import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, User, FileText, Settings } from 'lucide-react';

export const CaregiverBottomNav: React.FC = () => {
  const items = [
    { to: '/caregiver/dashboard', label: 'Home', icon: Home },
    { to: '/caregiver/profile', label: 'Patient', icon: User },
    { to: '/caregiver/reports', label: 'Reports', icon: FileText },
    { to: '/caregiver/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav 
      aria-label="Caregiver Mobile Navigation" 
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 shadow-xl p-2"
    >
      <div className="max-w-md mx-auto grid grid-cols-4 gap-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `
                flex flex-col items-center justify-center p-2 rounded-[20px] transition-all min-h-[56px]
                ${isActive 
                  ? 'bg-[#0E8765] text-white font-black shadow-clay-primary' 
                  : 'text-slate-600 hover:bg-slate-100 font-bold'}
              `}
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-5 h-5 mb-1 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span className="text-[11px] font-heading tracking-wide">
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
