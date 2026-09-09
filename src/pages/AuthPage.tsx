import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Lock, UserCheck, ShieldCheck } from 'lucide-react';
import { ClayCard } from '../components/ui/ClayCard';
import { ClayButton } from '../components/ui/ClayButton';
import { ClayInput } from '../components/ui/ClayInput';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAsDemo } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleDemoSelect = (role: UserRole) => {
    loginAsDemo(role);
    if (role === 'PATIENT') {
      navigate('/patient/home');
    } else if (role === 'ADMIN') {
      navigate('/admin');
    } else {
      navigate('/caregiver/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F6FA] flex items-center justify-center p-4">
      <ClayCard padding="xl" className="w-full max-w-md flex flex-col gap-6 border-2 border-white shadow-2xl">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#6C63FF] text-white flex items-center justify-center shadow-clay-primary">
            <Heart className="w-9 h-9 fill-white/20" />
          </div>
          <h1 className="text-3xl font-black text-slate-800 font-heading">MindNest Login</h1>
          <p className="text-sm font-bold text-slate-500">Sign in to your companion workspace</p>
        </div>

        {/* Demo Quick Logins */}
        <div className="bg-[#6C63FF]/10 p-4 rounded-2xl border border-[#6C63FF]/30 flex flex-col gap-3">
          <span className="text-xs font-black uppercase text-[#6C63FF] tracking-wider text-center">
            Quick Demo Account Selection
          </span>

          <ClayButton variant="primary" size="md" onClick={() => handleDemoSelect('PATIENT')}>
            👵 Patient (Anita Sharma)
          </ClayButton>

          <ClayButton variant="secondary" size="md" onClick={() => handleDemoSelect('CAREGIVER')}>
            👨‍👩‍👧 Family Caregiver (Rahul)
          </ClayButton>

          <ClayButton variant="neutral" size="md" onClick={() => handleDemoSelect('PROFESSIONAL_CAREGIVER')}>
            🩺 Professional Nurse (Priya)
          </ClayButton>

          <ClayButton variant="neutral" size="md" onClick={() => handleDemoSelect('ADMIN')}>
            🛡️ System Admin
          </ClayButton>
        </div>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-4 text-xs font-bold text-slate-400">or sign in with password</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleDemoSelect('CAREGIVER'); }} className="flex flex-col gap-4">
          <ClayInput label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="caregiver@mindnest.app" />
          <ClayInput label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          <ClayButton variant="primary" size="md" type="submit">
            Sign In
          </ClayButton>
        </form>
      </ClayCard>
    </div>
  );
};
