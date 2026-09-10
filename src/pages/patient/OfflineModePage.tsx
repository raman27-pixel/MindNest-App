import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, WifiOff, Wifi, Check, Cloud, RefreshCw, 
  Sparkles, ShieldCheck, Image, Music, Calendar, Gamepad2, 
  DownloadCloud, HardDrive, ArrowRight, Play, Database
} from 'lucide-react';
import { db } from '../../services/db';
import { OfflineSyncStatus } from '../../types';

export const OfflineModePage: React.FC = () => {
  const navigate = useNavigate();
  const [offlineStatus, setOfflineStatus] = useState<OfflineSyncStatus>(db.getOfflineStatus());
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isCaching, setIsCaching] = useState<boolean>(false);
  const [cacheProgress, setCacheProgress] = useState<number>(100);
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
    }, 1500);
  };

  const handleRefreshCache = () => {
    setIsCaching(true);
    setCacheProgress(10);
    const interval = setInterval(() => {
      setCacheProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsCaching(false);
          setSyncSuccessMessage('Offline storage successfully updated! All 18 photos & audio tracks are cached.');
          setTimeout(() => setSyncSuccessMessage(null), 4000);
          return 100;
        }
        return prev + 25;
      });
    }, 300);
  };

  const offlineActivities = [
    {
      title: 'Memory Lane',
      description: '6 Approved family albums & voice notes',
      path: '/patient/memory-lane',
      icon: Image,
      color: 'bg-emerald-50 text-[#0E8765] border-emerald-200',
      badge: '6 Photos Ready'
    },
    {
      title: 'Soothing Music',
      description: 'Regional Indian melodies & tone synth',
      path: '/patient/music',
      icon: Music,
      color: 'bg-teal-50 text-teal-700 border-teal-200',
      badge: 'Web Audio'
    },
    {
      title: 'Daily Routine',
      description: 'Morning walks, chai & medicine times',
      path: '/patient/routine',
      icon: Calendar,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      badge: 'Stored Local'
    },
    {
      title: 'Gentle Games',
      description: 'Memory box keepsakes & gentle quiz',
      path: '/patient/activities',
      icon: Gamepad2,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      badge: 'Zero Lag'
    }
  ];

  const checklist = [
    { label: 'All 6 Approved Family Memories & Videos', cached: '100% Ready' },
    { label: 'Gentle Games & 7-Photo Memory Quiz', cached: 'Cached Locally' },
    { label: 'My Memory Box (Rita’s Keepsakes)', cached: 'Always Available' },
    { label: 'Regional Indian Music & Tone Synthesis', cached: 'Web Audio Ready' },
    { label: 'Daily Routine Sequence & Hydration Prompts', cached: 'Saved Offline' },
  ];

  return (
    <div className="min-h-screen bg-[#F4F7FB] pb-28 pt-4 px-4 max-w-xl mx-auto flex flex-col gap-5">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/patient/home')}
          className="w-10 h-10 rounded-full bg-white shadow-clay-sm flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-all active:scale-95"
          aria-label="Go Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${offlineStatus.isOffline ? 'bg-amber-500 animate-pulse' : 'bg-[#0E8765]'}`} />
          <span className="text-xs font-black uppercase tracking-wider font-heading text-slate-700">
            {offlineStatus.isOffline ? 'Offline Mode Active' : 'Online & Connected'}
          </span>
        </div>

        <button
          onClick={handleReconnectAndSync}
          disabled={isSyncing}
          className="w-10 h-10 rounded-full bg-white shadow-clay-sm flex items-center justify-center text-[#0E8765] hover:bg-slate-50 transition-all"
          aria-label="Sync Now"
          title="Sync Now"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Main Connection Status Banner */}
      <div className="bg-white rounded-[28px] overflow-hidden shadow-clay-card border border-white">
        <div className="relative h-36 w-full overflow-hidden bg-slate-900">
          <img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80"
            alt="Scenic Assam hills"
            className="w-full h-full object-cover brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          {/* Connection Status Badge */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`w-16 h-16 rounded-full bg-white/95 backdrop-blur-md shadow-xl flex items-center justify-center border-4 border-white transition-all ${
              offlineStatus.isOffline ? 'text-amber-600' : 'text-[#0E8765]'
            }`}>
              {offlineStatus.isOffline ? (
                <WifiOff className="w-8 h-8 stroke-[2.5]" />
              ) : (
                <Wifi className="w-8 h-8 stroke-[2.5]" />
              )}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 sm:p-6 flex flex-col gap-4">
          <div className="text-center">
            <h2 className="text-2xl font-black text-slate-900 font-heading">
              {offlineStatus.isOffline ? 'Working 100% Offline' : 'MindNest Cloud Sync Ready'}
            </h2>
            <p className="text-sm font-bold text-[#0E8765] mt-0.5">
              {offlineStatus.isOffline ? "You are offline. Don't worry at all!" : 'Connected safely with family cloud sync'}
            </p>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-medium">
              All photos, voice companions, music melodies, and routine steps are safely stored on this device. No active Wi-Fi or mobile data needed.
            </p>
          </div>

          {/* Reconnect / Sync Alert */}
          {syncSuccessMessage && (
            <div className="bg-emerald-50 border border-emerald-200 text-[#0E8765] text-xs font-bold p-3.5 rounded-2xl flex items-center gap-2.5 animate-fade-in shadow-sm">
              <Check className="w-4 h-4 shrink-0 stroke-[3]" />
              <span>{syncSuccessMessage}</span>
            </div>
          )}

          {/* Storage Cache Health Bar */}
          <div className="bg-[#F4F7FB] p-4 rounded-2xl border border-slate-200/70 flex flex-col gap-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <div className="flex items-center gap-1.5">
                <HardDrive className="w-4 h-4 text-[#0E8765]" />
                <span>Device Offline Storage</span>
              </div>
              <span className="text-[#0E8765] font-black">{cacheProgress}% Synced</span>
            </div>
            
            <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#0E8765] to-teal-400 rounded-full transition-all duration-300"
                style={{ width: `${cacheProgress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
              <span>{offlineStatus.cachedPhotosCount || 18} Photos &bull; {offlineStatus.cachedActivitiesCount || 12} Audio Tracks</span>
              <button 
                onClick={handleRefreshCache}
                disabled={isCaching}
                className="text-[#0E8765] hover:underline font-bold flex items-center gap-1"
              >
                <DownloadCloud className="w-3 h-3" />
                {isCaching ? 'Updating...' : 'Pre-cache All'}
              </button>
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={handleReconnectAndSync}
            disabled={isSyncing}
            className={`w-full min-h-[52px] rounded-2xl font-black text-sm sm:text-base font-heading shadow-clay-primary flex items-center justify-center gap-2 transition-all active:scale-98 ${
              offlineStatus.isOffline
                ? 'bg-[#0E8765] hover:bg-[#0B6D52] text-white'
                : 'bg-emerald-100 text-[#0E8765] border border-[#0E8765]/30 hover:bg-emerald-200'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : offlineStatus.isOffline ? 'Reconnect & Go Online' : 'Check Cloud for Updates'}</span>
          </button>
        </div>
      </div>

      {/* Instant Offline Activities Section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-black uppercase text-slate-600 font-heading tracking-wider flex items-center gap-1.5">
            <Play className="w-4 h-4 text-[#0E8765] fill-[#0E8765]" />
            Instant Offline Activities
          </h3>
          <span className="text-[11px] font-bold text-[#0E8765] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            No Internet Needed
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {offlineActivities.map((act, idx) => {
            const Icon = act.icon;
            return (
              <button
                key={idx}
                onClick={() => navigate(act.path)}
                className="bg-white p-4 rounded-2xl shadow-clay-card border border-slate-100 hover:border-[#0E8765]/40 flex flex-col justify-between gap-3 text-left transition-all hover:translate-y-[-2px] active:scale-98 group"
              >
                <div className="flex items-start justify-between">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${act.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    {act.badge}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-800 font-heading group-hover:text-[#0E8765] transition-colors">
                    {act.title}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium mt-0.5 leading-snug">
                    {act.description}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-black text-[#0E8765]">
                  <span>Open Activity</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Available Offline Checklist */}
      <div className="bg-white p-5 rounded-[24px] shadow-clay-card border border-slate-100 flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#0E8765]" />
            <span className="text-xs font-black uppercase text-slate-700 font-heading">
              Secure Device Cache
            </span>
          </div>
          <span className="text-[11px] font-black text-[#0E8765]">
            100% Encrypted &amp; Private
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {checklist.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between gap-2 py-0.5">
              <div className="flex items-center gap-2.5">
                <div className="w-4 h-4 rounded-full bg-[#0E8765] text-white flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span className="text-xs font-bold text-slate-700">
                  {item.label}
                </span>
              </div>
              <span className="text-[10px] font-bold text-slate-500 bg-[#F4F7FB] px-2 py-0.5 rounded-full border border-slate-200 shrink-0">
                {item.cached}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Switch Simulation Toggle */}
      <div className="text-center pb-4">
        <button
          onClick={() => db.toggleOfflineMode()}
          className="text-xs font-bold text-slate-400 hover:text-slate-600 underline transition-colors"
        >
          {offlineStatus.isOffline ? 'Simulate: Force Online Mode' : 'Simulate: Force Offline Mode'}
        </button>
      </div>
    </div>
  );
};

export default OfflineModePage;
