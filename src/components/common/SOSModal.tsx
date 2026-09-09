import React, { useState } from 'react';
import { AlertOctagon, Phone, MessageSquare, X, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { db } from '../../services/db';
import { EmergencyNotificationProvider, EmergencyDispatchResult } from '../../services/emergencyProvider';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { t } from '../../locales/i18n';

interface SOSModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SOSModal: React.FC<SOSModalProps> = ({ isOpen, onClose }) => {
  const { settings } = useAccessibility();
  const lang = settings.language;
  const [dispatchResult, setDispatchResult] = useState<EmergencyDispatchResult | null>(null);

  if (!isOpen) return null;

  const patient = db.getPatientProfile();
  const familyMembers = db.getFamilyMembers();
  const primaryContact = familyMembers.find(f => f.isEmergencyContact) || familyMembers[0];

  const handleConfirmSOS = () => {
    const result = EmergencyNotificationProvider.dispatchEmergency(patient, familyMembers);
    setDispatchResult(result);
    // Automatically trigger phone call link
    window.location.href = result.telLink;
  };

  const handleReset = () => {
    setDispatchResult(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-rose-950/60 backdrop-blur-md p-4 animate-fade-in">
      <div 
        className="w-full max-w-lg bg-white rounded-[36px] shadow-2xl p-6 sm:p-8 flex flex-col items-center text-center gap-6 border-4 border-rose-500"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="sos-title"
      >
        {!dispatchResult ? (
          <>
            {/* Pulsing Emergency Icon */}
            <div className="w-24 h-24 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/30 animate-pulse">
              <AlertOctagon className="w-14 h-14" />
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-sm font-black uppercase text-rose-600 tracking-wider font-heading">
                {t('patient.sos', lang)}
              </span>
              <h2 id="sos-title" className="text-3xl sm:text-4xl font-black text-slate-800 font-heading">
                {t('patient.sosConfirmTitle', lang)}
              </h2>
              <p className="text-lg font-bold text-slate-600 mt-1">
                Touching this button will immediately call your emergency contact:{' '}
                <strong className="text-slate-900">{primaryContact?.name || 'Emergency Services (112)'}</strong>.
              </p>
            </div>

            {/* 2 Step Action Buttons */}
            <div className="flex flex-col w-full gap-3 pt-2">
              <button
                onClick={handleConfirmSOS}
                className="w-full min-h-[64px] py-5 px-6 rounded-[28px] bg-rose-600 hover:bg-rose-700 text-white text-2xl font-black shadow-xl shadow-rose-600/30 flex items-center justify-center gap-3 transition-transform active:scale-95"
              >
                <Phone className="w-8 h-8" />
                <span>{t('patient.sosCallHelp', lang)}</span>
              </button>

              <button
                onClick={onClose}
                className="w-full min-h-[56px] py-4 px-6 rounded-[24px] bg-slate-100 hover:bg-slate-200 text-slate-700 text-lg font-black transition-colors"
              >
                {t('common.cancel', lang)}
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Dispatched Confirmation */}
            <div className="w-20 h-20 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-black uppercase text-emerald-600 tracking-wider font-heading">
                Emergency Alert Sent
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-800 font-heading">
                Help is on the way
              </h3>
              <p className="text-base font-bold text-slate-600">
                Calling <strong className="text-slate-900">{primaryContact?.name || '112'}</strong> now.
              </p>
            </div>

            {/* Direct Calling / SMS buttons */}
            <div className="flex flex-col w-full gap-3">
              <a
                href={dispatchResult.telLink}
                className="w-full min-h-[58px] py-4 px-6 rounded-[24px] bg-rose-600 text-white text-lg font-black shadow-md flex items-center justify-center gap-2"
              >
                <Phone className="w-6 h-6" />
                <span>Call Phone Again</span>
              </a>

              <a
                href={dispatchResult.smsLink}
                className="w-full min-h-[54px] py-3.5 px-6 rounded-[24px] bg-emerald-600 text-white text-base font-black shadow-md flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Send SMS Message</span>
              </a>

              <button
                onClick={handleReset}
                className="w-full py-3 text-slate-500 hover:text-slate-800 text-sm font-bold mt-2"
              >
                Close & Return Home
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
