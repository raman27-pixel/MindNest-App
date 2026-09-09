import React, { useState, useEffect } from 'react';
import { 
  Link2, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Unlink, 
  ShieldCheck, 
  Image, 
  HardDrive, 
  Key, 
  ExternalLink, 
  Upload, 
  FileText, 
  Music, 
  Film, 
  Sparkles,
  Save
} from 'lucide-react';
import { ClayCard } from '../../components/ui/ClayCard';
import { db } from '../../services/db';
import { GoogleAuthService } from '../../services/googleAuth';
import { GooglePickerService } from '../../services/googlePicker';
import { GeminiClient } from '../../services/geminiClient';
import { GoogleConnectionStatus, ImportedMediaCandidate } from '../../types';

export const ConnectedAccountsPage: React.FC = () => {
  const [status, setStatus] = useState<GoogleConnectionStatus>(db.getGoogleConnectionStatus());
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isPickerOpening, setIsPickerOpening] = useState<boolean>(false);
  const [importedCandidates, setImportedCandidates] = useState<ImportedMediaCandidate[]>(db.getImportedMedia());
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);

  // Key form states
  const [geminiKey, setGeminiKey] = useState<string>(GeminiClient.getApiKey());
  const [googleClientId, setGoogleClientId] = useState<string>(GoogleAuthService.getClientId());
  const [googleApiKey, setGoogleApiKey] = useState<string>(GoogleAuthService.getApiKey());
  const [saveToast, setSaveToast] = useState<string | null>(null);

  useEffect(() => {
    return db.subscribe(() => {
      setStatus(db.getGoogleConnectionStatus());
      setImportedCandidates(db.getImportedMedia());
    });
  }, []);

  const handleConnectGoogle = async () => {
    setIsProcessing(true);
    try {
      await GoogleAuthService.requestAccessToken();
    } catch (err) {
      console.warn('Google auth flow completed with fallback:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDisconnect = () => {
    if (confirm("Disconnect Google Account? MindNest will securely invalidate tokens and halt Google Photos and Drive imports.")) {
      db.disconnectGoogle();
    }
  };

  const handleOpenPicker = async () => {
    setIsPickerOpening(true);
    try {
      await GooglePickerService.openPicker((picked) => {
        setImportedCandidates(db.getImportedMedia());
        setSaveToast(`Successfully imported ${picked.length} item(s) into review queue!`);
        setTimeout(() => setSaveToast(null), 4000);
      });
    } catch (err) {
      console.error('Picker error:', err);
    } finally {
      setIsPickerOpening(false);
    }
  };

  const handleSaveKeys = (e: React.FormEvent) => {
    e.preventDefault();
    GeminiClient.setApiKey(geminiKey);
    GoogleAuthService.setClientId(googleClientId);
    GoogleAuthService.setApiKey(googleApiKey);

    setSaveToast('API keys saved successfully!');
    setTimeout(() => {
      setSaveToast(null);
      setShowKeyModal(false);
    }, 1800);
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-black uppercase text-[#0E8765] tracking-wider font-heading">
            Integrations & Cloud Storage
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 font-heading">
            Google & Gemini Connections
          </h1>
          <p className="text-sm font-semibold text-slate-500 mt-0.5">
            Manage Google Drive, Google Photos, and Gemini AI credentials for your patient.
          </p>
        </div>

        <button
          onClick={() => setShowKeyModal(true)}
          className="px-4 py-2.5 rounded-2xl bg-white shadow-clay-sm border border-slate-200 text-xs font-black text-slate-800 hover:bg-slate-50 flex items-center gap-2 self-start sm:self-auto transition-all"
        >
          <Key className="w-4 h-4 text-[#0E8765]" />
          <span>Configure API Keys</span>
        </button>
      </div>

      {saveToast && (
        <div className="bg-emerald-50 border border-emerald-200 text-[#0E8765] p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Primary Google Status Card */}
      <ClayCard padding="lg" className="border border-white shadow-clay-card flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-[20px] bg-white border border-slate-200 shadow-sm flex items-center justify-center shrink-0">
              <svg className="w-8 h-8" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-slate-800 font-heading">Google Account Single Sign-On</h3>
                {status.accountConnected ? (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Connected
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-slate-200 text-slate-700">
                    Not Connected
                  </span>
                )}
              </div>
              <p className="text-xs font-bold text-slate-500 mt-0.5">
                {status.accountConnected ? status.googleEmail : 'Connect to enable Google Drive files & Google Photos universal imports'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {status.accountConnected ? (
              <button
                onClick={handleDisconnect}
                className="px-4 py-2 rounded-xl text-xs font-black bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 flex items-center gap-1.5 transition-all"
              >
                <Unlink className="w-4 h-4" />
                <span>Disconnect</span>
              </button>
            ) : (
              <button
                onClick={handleConnectGoogle}
                disabled={isProcessing}
                className="px-5 py-2.5 rounded-2xl bg-[#0E8765] hover:bg-[#0B6D52] text-white text-xs font-black shadow-clay-primary flex items-center gap-2 transition-all active:scale-95"
              >
                <Link2 className="w-4 h-4" />
                <span>{isProcessing ? 'Connecting...' : 'Connect Google'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Universal Picker Action Section */}
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 p-5 rounded-[24px] border border-emerald-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h4 className="text-base font-black text-slate-900 font-heading flex items-center gap-2">
              <Upload className="w-5 h-5 text-[#0E8765]" />
              <span>Import Drive & Photos (Images, Videos, Audio, Docs)</span>
            </h4>
            <p className="text-xs font-semibold text-slate-600">
              Select files from your connected Google account. Everything enters the Caregiver Review Queue for approval before patient sees it.
            </p>
          </div>

          <button
            onClick={handleOpenPicker}
            disabled={isPickerOpening}
            className="px-5 py-3 rounded-[20px] bg-[#0E8765] hover:bg-[#0B6D52] text-white font-black text-xs font-heading shadow-clay-primary flex items-center justify-center gap-2 shrink-0 transition-all active:scale-95"
          >
            <Upload className={`w-4 h-4 ${isPickerOpening ? 'animate-bounce' : ''}`} />
            <span>{isPickerOpening ? 'Opening Picker...' : 'Open File Picker'}</span>
          </button>
        </div>

        {/* 3 Status Cards: Photos, Drive, Gemini */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* Photos */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <Image className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-black text-slate-800 block">Google Photos</span>
                <span className="text-[10px] font-bold text-slate-400">
                  {status.photosConnected ? 'Authorized' : 'Ready to connect'}
                </span>
              </div>
            </div>
            {status.photosConnected ? (
              <CheckCircle2 className="w-4 h-4 text-[#0E8765]" />
            ) : (
              <XCircle className="w-4 h-4 text-slate-300" />
            )}
          </div>

          {/* Drive */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <HardDrive className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-black text-slate-800 block">Google Drive</span>
                <span className="text-[10px] font-bold text-slate-400">
                  {status.driveConnected ? 'Authorized' : 'Ready to connect'}
                </span>
              </div>
            </div>
            {status.driveConnected ? (
              <CheckCircle2 className="w-4 h-4 text-[#0E8765]" />
            ) : (
              <XCircle className="w-4 h-4 text-slate-300" />
            )}
          </div>

          {/* Gemini AI */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#0E8765] flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-black text-slate-800 block">Gemini 1.5 AI</span>
                <span className="text-[10px] font-bold text-slate-400">
                  {GeminiClient.isConfigured() ? 'Key Active' : 'Default Safe Engine'}
                </span>
              </div>
            </div>
            {GeminiClient.isConfigured() ? (
              <CheckCircle2 className="w-4 h-4 text-[#0E8765]" />
            ) : (
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                Active
              </span>
            )}
          </div>
        </div>

        {/* Security Info */}
        <div className="bg-[#E6F5EF]/60 p-4 rounded-2xl border border-emerald-100 flex items-start gap-3 text-xs font-bold text-emerald-950">
          <ShieldCheck className="w-5 h-5 text-[#0E8765] shrink-0 mt-0.5" />
          <div className="flex flex-col gap-0.5">
            <span className="font-black">Official & Free Google Cloud Protocol</span>
            <span className="text-slate-600 font-medium">
              Files selected via Google Picker are stored with least-privilege permissions. No raw files enter patient games or the voice companion without your explicit review and toggle.
            </span>
          </div>
        </div>
      </ClayCard>

      {/* Imported Media Waiting For Approval */}
      <ClayCard padding="lg" className="border border-white shadow-clay-card flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-900 font-heading flex items-center gap-2">
            <span>Imported Google Media ({importedCandidates.length})</span>
          </h3>
          <span className="text-xs font-bold text-slate-400">
            Caregiver Approval Queue
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {importedCandidates.map((item) => (
            <div key={item.id} className="bg-slate-50 p-3 rounded-2xl border border-slate-200/70 flex flex-col gap-2">
              <div className="w-full h-32 rounded-xl overflow-hidden bg-slate-200 relative">
                {item.mimeType.includes('video') ? (
                  <video src={item.mediaUrl} className="w-full h-full object-cover" />
                ) : (
                  <img src={item.mediaUrl} alt={item.title} className="w-full h-full object-cover" />
                )}
                <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                  {item.category}
                </span>
              </div>
              <div>
                <span className="text-xs font-black text-slate-800 truncate block">
                  {item.title}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold block">
                  {item.description}
                </span>
              </div>
              <button
                onClick={() => {
                  db.approveMediaAsMemory(item.id);
                  setImportedCandidates(db.getImportedMedia());
                  setSaveToast(`Approved "${item.title}" into Patient Memories!`);
                  setTimeout(() => setSaveToast(null), 3000);
                }}
                className="w-full py-1.5 rounded-xl bg-[#0E8765] text-white text-xs font-black shadow-sm hover:bg-[#0B6D52] transition-all mt-auto"
              >
                Approve for Patient
              </button>
            </div>
          ))}
        </div>
      </ClayCard>

      {/* API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[32px] max-w-lg w-full p-6 shadow-2xl flex flex-col gap-4 border border-white max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-[#0E8765]" />
                <h3 className="text-xl font-black text-slate-800 font-heading">
                  API Key & OAuth Setup
                </h3>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 font-bold flex items-center justify-center hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveKeys} className="flex flex-col gap-4 text-left">
              {/* 1. Gemini Key */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-black text-slate-700">
                    Google Gemini AI API Key (100% Free)
                  </label>
                  <a
                    href="https://aistudio.google.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-extrabold text-[#0E8765] hover:underline flex items-center gap-1"
                  >
                    <span>Get Key from Google AI Studio</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <input
                  type="password"
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full clay-input text-xs font-mono"
                />
                <span className="text-[10px] font-semibold text-slate-400 mt-1 block">
                  Enables live Gemini 1.5 Flash in Patient Chatbox & Voice Companion.
                </span>
              </div>

              {/* 2. Google OAuth Client ID */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-black text-slate-700">
                    Google OAuth 2.0 Web Client ID
                  </label>
                  <a
                    href="https://console.cloud.google.com/apis/credentials"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-extrabold text-[#0E8765] hover:underline flex items-center gap-1"
                  >
                    <span>Google Cloud Console</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <input
                  type="text"
                  value={googleClientId}
                  onChange={(e) => setGoogleClientId(e.target.value)}
                  placeholder="xxxx.apps.googleusercontent.com"
                  className="w-full clay-input text-xs font-mono"
                />
                <span className="text-[10px] font-semibold text-slate-400 mt-1 block">
                  Authorizes Sign-in with Google and Google Drive / Photos access.
                </span>
              </div>

              {/* 3. Google Picker API Key */}
              <div>
                <label className="text-xs font-black text-slate-700 block mb-1">
                  Google Picker API Key (Optional)
                </label>
                <input
                  type="password"
                  value={googleApiKey}
                  onChange={(e) => setGoogleApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full clay-input text-xs font-mono"
                />
                <span className="text-[10px] font-semibold text-slate-400 mt-1 block">
                  Used by Google Picker to browse Photos and Drive directly inside the app.
                </span>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl bg-[#0E8765] text-white font-black text-sm shadow-clay-primary hover:bg-[#0B6D52] flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Keys</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="py-3 px-5 rounded-2xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectedAccountsPage;
