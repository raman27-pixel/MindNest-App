import React from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { useVoice } from '../../contexts/VoiceContext';

interface VoiceButtonProps {
  textToSpeak?: string;
  onSpokenResult?: (text: string) => void;
  size?: 'md' | 'patient';
  label?: string;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  textToSpeak,
  onSpokenResult,
  size = 'patient',
  label = 'Hear & Speak'
}) => {
  const { isSpeaking, isListening, speak, stopSpeaking, startListening, stopListening } = useVoice();

  const handleSpeechClick = () => {
    if (isSpeaking) {
      stopSpeaking();
      return;
    }

    if (textToSpeak) {
      speak(textToSpeak);
    }

    if (onSpokenResult) {
      if (isListening) {
        stopListening();
      } else {
        startListening(onSpokenResult);
      }
    }
  };

  const isPatientSize = size === 'patient';

  return (
    <button
      onClick={handleSpeechClick}
      aria-label={label}
      className={`
        relative inline-flex items-center justify-center gap-3 font-extrabold text-white transition-all duration-200
        ${isPatientSize ? 'patient-touch-btn px-8 py-5 text-xl rounded-[28px] bg-[#6C63FF] hover:bg-[#5B52E0] shadow-clay-primary' : 'px-5 py-3 text-base rounded-[22px] bg-[#6C63FF] shadow-md'}
        ${isListening ? 'ring-8 ring-[#6C63FF]/30 animate-pulse bg-rose-500 hover:bg-rose-600' : ''}
      `}
    >
      {isListening ? (
        <>
          <MicOff className={isPatientSize ? 'w-8 h-8 animate-bounce' : 'w-5 h-5'} />
          <span>Listening...</span>
        </>
      ) : isSpeaking ? (
        <>
          <Volume2 className={isPatientSize ? 'w-8 h-8 animate-spin' : 'w-5 h-5'} />
          <span>Speaking...</span>
        </>
      ) : (
        <>
          <Mic className={isPatientSize ? 'w-8 h-8' : 'w-5 h-5'} />
          <span>{label}</span>
        </>
      )}
    </button>
  );
};
