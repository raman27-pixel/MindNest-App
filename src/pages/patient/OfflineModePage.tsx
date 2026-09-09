import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, WifiOff, Wifi, Check, Cloud, RefreshCw, Sparkles, ShieldCheck } from 'lucide-react';
import { db } from '../../services/db';
import { OfflineSyncStatus } from '../../types';

export const OfflineModePage: React.FC = () => {
  const navigate = useNavigate();
  const [offlineStatus, setOfflineStatus] = useState<OfflineSyncStatus>(db.getOfflineStatus());
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncSuccessMessage, setSyncSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    return db.subscribe(() => {
      setOfflineStatus(db.getOfflineStatus());
    });
  }, []);

  const handleReconnectAndSync = () => {
    setIsSyncing(true);
    setSyncSuccessMessage(null);

    setTimeout(() => {
      // Toggle to online if was offline
      if (offlineStatus.isOffline) {
        db.toggleOfflineMode();
      }
      db.syncOfflineData();
      setIsSyncing(false);
      setSyncSuccessMessage('Connected! All memories and activity logs are up-to-date.');
      setTimeout(() => {
        setSyncSuccessMessage(null);
      }, 4000);
    }, 1800);
  };

  const checklist = [
    { label: 'All 6 Approved Family Memories & Videos', cached: '100% Ready' },
    { label: 'Gentle Games & 7-Photo Memory Quiz', cached: 'Cached Locally' },
    { label: 'My Memory Box (Rita’s Keepsakes)', cached: 'Always Available' },
    { label: 'Regional Indian Music & Tone Synthesis', cached: 'Web Audio Ready' },
    { label: 'Daily Routine Sequence & Tasks', cached: 'Saved Offline' },
  ];

  return (
    <div className="min-h-screen bg-[#F4F7FB] pb-24 pt-3 px-4 max-w-md mx-auto flex flex-col justify-between">
      {/* Top Header */}
      <div className="flex items-center justify-between py-2">
        <button
          onClick={() => navigate('/patient/home')}
          className="w-10 h-10 rounded-full bg-white shadow-clay-sm flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-all active:scale-95"
          aria-label="Go Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <span className="text-xs font-black uppercase text-[#0E8765] tracking-wider font-heading">
          {offlineStatus.isOffline ? 'Offline Mode' : 'Online & Connected'}
        </span>

        <button
          onClick={handleReconnectAndSync}
          disabled={isSyncing}
          className="w-10 h-10 rounded-full bg-white shadow-clay-sm flex items-center justify-center text-[#0E8765] hover:bg-slate-50 transition-all"
          aria-label="Sync Now"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-[32px] overflow-hidden shadow-clay-card border border-white flex flex-col my-auto animate-fade-in">
        {/* Landscape header with connection badge */}
        <div className="relative h-44 w-full overflow-hidden bg-slate-900">
          <img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80"
            alt="Scenic Assam hills"
            className="w-full h-full object-cover brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Connection Status Badge */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`w-18 h-18 rounded-full bg-white/95 backdrop-blur-md shadow-xl flex items-center justify-center border-4 border-white transition-all ${
              offlineStatus.isOffline ? 'text-amber-600' : 'text-[#0E8765]'
            }`}>
              {offlineStatus.isOffline ? (
                <WifiOff className="w-9 h-9 stroke-[2.5]" />
              ) : (
                <Wifi className="w-9 h-9 stroke-[2.5]" />
              )}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 flex flex-col gap-4">
          <div className="flex flex-col text-center">
            <h2 className="text-2xl font-black text-slate-900 font-heading">
              {offlineStatus.isOffline ? 'Offline Mode Active' : 'MindNest Online'}
            </h2>
            <p className="text-sm font-black text-[#0E8765] mt-0.5">
              {offlineStatus.isOffline ? "You are offline. Don't worry at all!" : 'Connected safely with family cloud sync'}
            </p>
            <p className="text-xs font-semibold text-slate-500 mt-1 leading-relaxed">
              Your cherished family photos, voice prompts, and soothing games are permanently stored on this device.
            </p>
          </div>

          {/* Reconnect / Sync Alert */}
          {syncSuccessMessage && (
            <div className="bg-emerald-50 border border-emerald-200 text-[#0E8765] text-xs font-bold p-3 rounded-2xl flex items-center gap-2 animate-fade-in">
              <Check className="w-4 h-4 shrink-0 stroke-[3]" />
              <span>{syncSuccessMessage}</span>
            </div>
          )}

          {/* Available Offline Checklist */}
          <div className="bg-[#F4F7FB] p-4 rounded-[24px] flex flex-col gap-2.5 border border-slate-200/60">
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-xs font-black uppercase text-slate-400 font-heading">
                Stored On Your Device
              </span>
              <span className="text-[11px] font-black text-[#0E8765]">
                🔒 100% Private
              </span>
            </div>

            {checklist.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#0E8765] text-white flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-xs font-bold text-slate-700">
                    {item.label}
                  </span>
                </div>
                <span className="text-[10px] font-extrabold text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-200 shrink-0">
                  {item.cached}
                </span>
              </div>
            ))}
          </div>

          {/* Primary Action Button: Reconnect & Go Online */}
          <button
            onClick={handleReconnectAndSync}
            disabled={isSyncing}
            className={`w-full min-h-[56px] rounded-[22px] font-black text-base font-heading shadow-clay-primary flex items-center justify-center gap-2 transition-all active:scale-98 ${
              offlineStatus.isOffline
                ? 'bg-[#0E8765] hover:bg-[#0B6D52] text-white'
                : 'bg-emerald-100 text-[#0E8765] border border-[#0E8765]/30 hover:bg-emerald-200'
            }`}
          >
            <RefreshCw className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Connecting & Syncing...' : offlineStatus.isOffline ? 'Reconnect & Go Online' : 'Check for Updates'}</span>
          </button>

          {/* Last Synced Status */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs font-bold text-slate-500">
            <div className="flex items-center gap-1.5">
              <Cloud className="w-4 h-4 text-[#0E8765]" />
              <span>Last synced: {offlineStatus.lastSyncedAt}</span>
            </div>
            <span className={`w-2.5 h-2.5 rounded-full ${offlineStatus.isOffline ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`} />
          </div>
        </div>
      </div>

      {/* Switch Simulation Toggle */}
      <div className="text-center pt-2">
        <button
          onClick={() => db.toggleOfflineMode()}
          className="text-xs font-bold text-slate-400 hover:text-slate-600 underline"
        >
          {offlineStatus.isOffline ? 'Simulate: Force Online' : 'Simulate: Force Offline'}
        </button>
      </div>
    </div>
  );
};

export default OfflineModePage;
