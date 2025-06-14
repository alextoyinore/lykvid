import { useState, useEffect, useCallback } from 'react';
import { LyricSyncState, LyricSyncAction, SynchronizedLyrics } from '@/types/lyricSync';
import { createAudioContext } from '@/utils/audioContext';

export function useLyricSync(lyrics: string | null) {
  const [state, setState] = useState<LyricSyncState>({
    synchronizedLyrics: null,
    currentPhrase: null,
    isPlaying: false,
    currentTime: 0,
    isSynchronized: false,
  });

  const { audioContext, audioBuffer, setAudioBuffer } = createAudioContext();

  // Initialize synchronized lyrics when lyrics are available
  useEffect(() => {
    if (lyrics && typeof lyrics === 'string') {
      // Split lyrics into phrases (simple implementation, can be improved)
      const phrases = lyrics.split('\n').filter(Boolean);
      const synchronizedLyrics: SynchronizedLyrics = {
        phrases: phrases.map((text, index) => ({
          text,
          startTime: index * 5, // temporary timing, will be adjusted
          endTime: (index + 1) * 5,
        })),
        audioDuration: phrases.length * 5,
      };
      setState(prev => ({ ...prev, synchronizedLyrics }));
    }
  }, [lyrics]);

  const play = useCallback(() => {
    if (audioBuffer && !state.isPlaying) {
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start(0, state.currentTime);
      setState(prev => ({ ...prev, isPlaying: true }));
    }
  }, [audioBuffer, state.isPlaying, state.currentTime, audioContext]);

  const pause = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: false }));
  }, []);

  const seek = useCallback((time: number) => {
    setState(prev => ({ ...prev, currentTime: time }));
    if (state.isPlaying) {
      pause();
      play();
    }
  }, [pause, play, state.isPlaying]);

  const selectPhrase = useCallback((index: number) => {
    setState(prev => ({ ...prev, currentPhrase: index }));
  }, []);

  const updateTiming = useCallback((phraseIndex: number, startTime: number, endTime: number) => {
    if (state.synchronizedLyrics) {
      const newPhrases = [...state.synchronizedLyrics.phrases];
      newPhrases[phraseIndex] = {
        ...newPhrases[phraseIndex],
        startTime,
        endTime,
      };
      setState(prev => ({
        ...prev,
        synchronizedLyrics: {
          ...state.synchronizedLyrics!,
          phrases: newPhrases,
          audioDuration: state.synchronizedLyrics!.audioDuration
        }
      }));
    }
  }, [state.synchronizedLyrics]);

  const reset = useCallback(() => {
    setState({
      synchronizedLyrics: null,
      currentPhrase: null,
      isPlaying: false,
      currentTime: 0,
      isSynchronized: false,
    });
  }, []);

  return {
    state,
    play,
    pause,
    seek,
    selectPhrase,
    updateTiming,
    reset,
    setAudioBuffer,
  };
}
