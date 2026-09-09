import React, { createContext, useContext, useState, useEffect } from 'react';
import { PatientAccessibilitySettings, SupportedLanguage, VoiceSettings } from '../types';
import { db } from '../services/db';

interface AccessibilityContextType {
  settings: PatientAccessibilitySettings;
  updateSettings: (newSettings: Partial<PatientAccessibilitySettings>) => void;
  toggleHighContrast: () => void;
  toggleVoice: () => void;
  setTextSize: (size: PatientAccessibilitySettings['textSize']) => void;
  setPatientLanguage: (lang: SupportedLanguage) => void;
  setCaregiverLanguage: (lang: SupportedLanguage) => void;
  updateVoiceSettings: (voiceUpdates: Partial<VoiceSettings>) => void;
}

const DEFAULT_VOICE_SETTINGS: VoiceSettings = {
  patientLanguage: 'en',
  caregiverLanguage: 'en',
  voiceProfileId: 'female-in-warm-1',
  voiceGender: 'FEMALE',
  voiceStyle: 'warm',
  voiceAccent: 'Indian English',
  speechSpeed: 0.85,
  speechVolume: 1.0,
  autoReadEnabled: true,
  useElevenLabs: false
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialProfile = db.getPatientProfile();
  const [settings, setSettingsState] = useState<PatientAccessibilitySettings>(() => {
    const existing = (initialProfile.accessibility || {}) as Partial<PatientAccessibilitySettings>;
    return {
      textSize: existing.textSize || 'NORMAL',
      contrast: existing.contrast || 'NORMAL',
      voiceEnabled: existing.voiceEnabled !== false,
      speechSpeed: existing.speechSpeed || 0.85,
      language: existing.language || initialProfile.preferredLanguage || 'en',
      caregiverLanguage: existing.caregiverLanguage || 'en',
      simplifiedMode: existing.simplifiedMode || false,
      reducedMotion: existing.reducedMotion || false,
      voiceSettings: existing.voiceSettings || {
        ...DEFAULT_VOICE_SETTINGS,
        patientLanguage: existing.language || 'en'
      }
    };
  });

  useEffect(() => {
    // Apply high contrast class to root element
    if (settings.contrast === 'HIGH') {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }

    // Apply text size class to root element
    document.documentElement.classList.remove('text-scale-large', 'text-scale-xlarge');
    if (settings.textSize === 'LARGE') {
      document.documentElement.classList.add('text-scale-large');
    } else if (settings.textSize === 'XLARGE') {
      document.documentElement.classList.add('text-scale-xlarge');
    }
  }, [settings]);

  const updateSettings = (newSettings: Partial<PatientAccessibilitySettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettingsState(updated);
    db.updatePatientProfile({ 
      accessibility: updated,
      preferredLanguage: updated.language 
    });
  };

  const toggleHighContrast = () => {
    updateSettings({ contrast: settings.contrast === 'HIGH' ? 'NORMAL' : 'HIGH' });
  };

  const toggleVoice = () => {
    updateSettings({ voiceEnabled: !settings.voiceEnabled });
  };

  const setTextSize = (textSize: PatientAccessibilitySettings['textSize']) => {
    updateSettings({ textSize });
  };

  const setPatientLanguage = (language: SupportedLanguage) => {
    const voiceSettings = { ...settings.voiceSettings, patientLanguage: language };
    updateSettings({ language, voiceSettings });
  };

  const setCaregiverLanguage = (caregiverLanguage: SupportedLanguage) => {
    const voiceSettings = { ...settings.voiceSettings, caregiverLanguage };
    updateSettings({ caregiverLanguage, voiceSettings });
  };

  const updateVoiceSettings = (voiceUpdates: Partial<VoiceSettings>) => {
    const voiceSettings = { ...settings.voiceSettings, ...voiceUpdates };
    updateSettings({ voiceSettings });
  };

  return (
    <AccessibilityContext.Provider value={{
      settings,
      updateSettings,
      toggleHighContrast,
      toggleVoice,
      setTextSize,
      setPatientLanguage,
      setCaregiverLanguage,
      updateVoiceSettings
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
