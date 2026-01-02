import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import { SpotifyTrack } from '@/hooks/useSpotify';

interface PlayerState {
  currentTrack: SpotifyTrack | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  queue: SpotifyTrack[];
  currentIndex: number;
}

interface PlayerContextType extends PlayerState {
  playTrack: (track: SpotifyTrack, queue?: SpotifyTrack[]) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<PlayerState>({
    currentTrack: null,
    isPlaying: false,
    progress: 0,
    duration: 0,
    volume: 0.7,
    queue: [],
    currentIndex: 0,
  });

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = state.volume;

    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setState(prev => ({ ...prev, progress: audio.currentTime }));
    };

    const handleLoadedMetadata = () => {
      setState(prev => ({ ...prev, duration: audio.duration }));
    };

    const handleEnded = () => {
      nextTrack();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, []);

  const playTrack = useCallback((track: SpotifyTrack, queue?: SpotifyTrack[]) => {
    if (!audioRef.current) return;

    if (track.preview_url) {
      audioRef.current.src = track.preview_url;
      audioRef.current.play();
      setState(prev => ({
        ...prev,
        currentTrack: track,
        isPlaying: true,
        progress: 0,
        queue: queue || [track],
        currentIndex: queue ? queue.findIndex(t => t.id === track.id) : 0,
      }));
    } else {
      setState(prev => ({
        ...prev,
        currentTrack: track,
        isPlaying: false,
        queue: queue || [track],
        currentIndex: queue ? queue.findIndex(t => t.id === track.id) : 0,
      }));
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (!audioRef.current || !state.currentTrack?.preview_url) return;

    if (state.isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  }, [state.isPlaying, state.currentTrack]);

  const nextTrack = useCallback(() => {
    if (state.queue.length === 0) return;
    const nextIndex = (state.currentIndex + 1) % state.queue.length;
    playTrack(state.queue[nextIndex], state.queue);
  }, [state.queue, state.currentIndex, playTrack]);

  const previousTrack = useCallback(() => {
    if (state.queue.length === 0) return;
    const prevIndex = state.currentIndex === 0 ? state.queue.length - 1 : state.currentIndex - 1;
    playTrack(state.queue[prevIndex], state.queue);
  }, [state.queue, state.currentIndex, playTrack]);

  const seek = useCallback((time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setState(prev => ({ ...prev, progress: time }));
  }, []);

  const setVolume = useCallback((volume: number) => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
    setState(prev => ({ ...prev, volume }));
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        ...state,
        playTrack,
        togglePlay,
        nextTrack,
        previousTrack,
        seek,
        setVolume,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};
