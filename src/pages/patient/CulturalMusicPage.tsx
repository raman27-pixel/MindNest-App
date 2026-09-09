import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Music, Play, Pause, SkipBack, Volume2, Heart } from 'lucide-react';
import { db } from '../../services/db';
import { RegionalMusicTrack } from '../../types';

export const CulturalMusicPage: React.FC = () => {
  const navigate = useNavigate();
  const tracks: RegionalMusicTrack[] = db.getRegionalMusic();
  const [currentTrack, setCurrentTrack] = useState<RegionalMusicTrack>(tracks[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);

  // Gentle Web Audio tone synthesizer for copyright-safe folk melody simulation
  const togglePlay = (track: RegionalMusicTrack) => {
    if (currentTrack.id === track.id && isPlaying) {
      setIsPlaying(false);
      if (audioCtx) {
        audioCtx.close();
        setAudioCtx(null);
      }
      return;
    }

    setCurrentTrack(track);
    setIsPlaying(true);

    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(track.audioToneFrequency || 440, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 3);
      setAudioCtx(ctx);
    } catch (e) {
      console.log('Web Audio tone played');
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] pb-36 pt-3 px-4 max-w-md mx-auto flex flex-col">
      {/* Top Header matching Screen 9 */}
      <div className="flex items-center justify-between py-2 mb-2">
        <button
          onClick={() => navigate('/patient/home')}
          className="w-10 h-10 rounded-full bg-white shadow-clay-sm flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-all"
          aria-label="Go Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
            <Music className="w-5 h-5" />
          </div>
          <span className="text-base font-black text-slate-800 font-heading">
            My Music
          </span>
        </div>

        <div className="w-10" />
      </div>

      {/* Song List matching Screen 9 */}
      <div className="flex flex-col gap-3 pt-2">
        {tracks.map((track) => {
          const isSelected = currentTrack.id === track.id;
          return (
            <div
              key={track.id}
              onClick={() => togglePlay(track)}
              className={`bg-white rounded-[24px] p-3 shadow-clay-card border border-white flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-all ${
                isSelected ? 'ring-2 ring-[#0E8765]/40' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Square Album Art */}
                <div className="w-14 h-14 rounded-[18px] overflow-hidden bg-slate-100 shrink-0 relative">
                  <img
                    src={track.albumArt}
                    alt={track.title}
                    className="w-full h-full object-cover"
                  />
                  {isSelected && isPlaying && (
                    <div className="absolute inset-0 bg-[#0E8765]/50 flex items-center justify-center text-white">
                      <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    </div>
                  )}
                </div>

                {/* Title and Genre */}
                <div className="flex flex-col">
                  <span className="text-base font-black text-slate-800 font-heading">
                    {track.title}
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    {track.genre}
                  </span>
                </div>
              </div>

              {/* Play Button Icon */}
              <button
                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-clay-sm transition-all ${
                  isSelected && isPlaying
                    ? 'bg-[#0E8765] text-white'
                    : 'bg-[#F4F7FB] text-slate-600 hover:bg-slate-100'
                }`}
                aria-label={`Play ${track.title}`}
              >
                {isSelected && isPlaying ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Persistent Bottom Music Player matching Screen 9 */}
      <div className="fixed bottom-20 left-4 right-4 max-w-md mx-auto z-30">
        <div className="bg-white/95 backdrop-blur-md rounded-[26px] p-3 shadow-2xl border border-slate-200/80 flex flex-col gap-2">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-11 h-11 rounded-[16px] overflow-hidden bg-slate-100 shrink-0">
                <img
                  src={currentTrack.albumArt}
                  alt={currentTrack.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black text-slate-800 font-heading truncate max-w-[150px]">
                  {currentTrack.title}
                </span>
                <span className="text-[11px] font-bold text-slate-500">
                  {currentTrack.genre}
                </span>
              </div>
            </div>

            {/* Controls: SkipBack, Play/Pause, Speaker */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => togglePlay(currentTrack)}
                className="w-9 h-9 rounded-full bg-[#0E8765] text-white flex items-center justify-center shadow-md active:scale-95 transition-transform"
                aria-label="Play/Pause"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>
              <Volume2 className="w-5 h-5 text-slate-400 ml-1" />
            </div>
          </div>

          {/* Mini progress bar */}
          <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full bg-[#0E8765] rounded-full transition-all duration-300 ${
                isPlaying ? 'w-2/3' : 'w-1/3'
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
