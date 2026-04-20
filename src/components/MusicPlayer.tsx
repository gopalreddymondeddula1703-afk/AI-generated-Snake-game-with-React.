import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  Music2,
  Disc3,
  ListMusic
} from 'lucide-react';
import { TRACKS } from '../constants';
import { Track } from '../types';

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showPlaylist, setShowPlaylist] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(e => {
        console.error("Audio play failed:", e);
        setIsPlaying(false);
      });
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-md glass-panel rounded-3xl p-6 shadow-2xl relative overflow-hidden">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleNext}
      />

      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex justify-between items-center text-slate-400">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-widest uppercase neon-text-blue">AUDIO_LINK</span>
          </div>
          <button 
            onClick={() => setShowPlaylist(!showPlaylist)}
            className={`p-2 rounded-lg transition-colors ${showPlaylist ? 'bg-white/10 text-white' : 'hover:bg-white/5'}`}
          >
            <ListMusic className="w-5 h-5" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {!showPlaylist ? (
            <motion.div
              key="player"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-6"
            >
              {/* Title & Artist */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl border border-white/10 overflow-hidden shrink-0">
                   <img src={currentTrack.cover} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight leading-tight">{currentTrack.title}</h3>
                  <p className="text-xs text-white/40 uppercase tracking-widest">{currentTrack.artist}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-[10px] font-mono opacity-50">
                  <span>{formatTime(progress)}</span>
                  <div className="flex-1 progress-bar">
                    <motion.div 
                      className="progress-fill"
                      style={{ width: `${(progress / duration) * 100}%` }}
                    />
                  </div>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-center items-center gap-8">
                <button onClick={handlePrev} className="text-white/60 hover:text-white transition-opacity">
                  <SkipBack className="w-5 h-5 fill-current" />
                </button>
                <button 
                  onClick={togglePlay}
                  className="w-12 h-12 rounded-full border border-cyan-400 flex items-center justify-center text-cyan-400 hover:scale-105 active:scale-95 transition-transform"
                >
                  {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
                </button>
                <button onClick={handleNext} className="text-white/60 hover:text-white transition-opacity">
                  <SkipForward className="w-5 h-5 fill-current" />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="playlist"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-2 min-h-[160px]"
            >
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">NEURAL_QUEUE</h4>
              {TRACKS.map((track, idx) => (
                <button
                  key={track.id}
                  onClick={() => {
                    setCurrentTrackIndex(idx);
                    setIsPlaying(true);
                    setShowPlaylist(false);
                  }}
                  className={`flex items-center gap-4 p-2 rounded-xl transition-all ${
                    idx === currentTrackIndex 
                      ? 'bg-white/5 border border-white/10 text-cyan-400' 
                      : 'hover:bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="text-left flex-1">
                    <div className="text-xs font-bold truncate">{track.title}</div>
                    <div className="text-[10px] opacity-50">{track.artist}</div>
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Volume */}
        <div className="flex justify-end items-center gap-4 border-t border-white/10 pt-4">
          <div className="flex items-center gap-2">
            <Volume2 className="w-3 h-3 text-white/40" />
            <div className="w-24 h-1 bg-white/10 rounded-full">
              <div className="w-2/3 h-full bg-white/40 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
