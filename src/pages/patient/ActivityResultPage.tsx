import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Heart, Sparkles, Gamepad2, HeartHandshake } from 'lucide-react';
import { ClayCard } from '../../components/ui/ClayCard';
import { ClayButton } from '../../components/ui/ClayButton';
import { VoiceButton } from '../../components/ui/VoiceButton';

export const ActivityResultPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { activityTitle?: string; isCorrect?: boolean; durationSeconds?: number } || {};

  const congratsText = "Wonderful! You completed this activity. Have a peaceful rest.";

  return (
    <div className="min-h-screen bg-[#F5F6FA] pb-28 pt-8 px-4 max-w-2xl mx-auto flex flex-col gap-6 text-center">
      <ClayCard padding="xl" className="flex flex-col items-center gap-6 border-2 border-white shadow-2xl">
        <div className="w-24 h-24 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-clay-card">
          <Heart className="w-14 h-14 fill-emerald-500 text-emerald-500 animate-pulse" />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-black uppercase text-[#6C63FF] tracking-wider">
            Activity Complete
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-slate-800 font-heading">
            Wonderful! ❤️
          </h1>
          <p className="text-2xl font-extrabold text-slate-600">
            You completed {state.activityTitle || 'this activity'}!
          </p>
        </div>

        <VoiceButton textToSpeak={congratsText} label="Read Message" size="md" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mt-4">
          <ClayButton
            variant="secondary"
            size="patient"
            onClick={() => navigate('/patient/activities')}
            icon={<Gamepad2 className="w-8 h-8" />}
          >
            Another Game
          </ClayButton>

          <ClayButton
            variant="primary"
            size="patient"
            onClick={() => navigate('/patient/home')}
            icon={<HeartHandshake className="w-8 h-8" />}
          >
            Go Home
          </ClayButton>
        </div>
      </ClayCard>
    </div>
  );
};
