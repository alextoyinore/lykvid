import { useState, useEffect, useCallback } from 'react';
import { LyricSyncState, LyricSyncAction, SynchronizedLyrics } from '@/types/lyricSync';
import { createAudioContext } from '@/utils/audioContext';

export function useLyricSync(file: File | null, lyrics: string | null = null) {
  const [state, setState] = useState<LyricSyncState>({
    synchronizedLyrics: null,
    currentPhrase: null,
    isPlaying: false,
    currentTime: 0,
    isSynchronized: false,
    audioBuffer: null,
  });

  const { audioContext } = createAudioContext();

  useEffect(() => {
    if (file) {
      const loadAudio = async () => {
        try {
          const arrayBuffer = await file.arrayBuffer();
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
          setState(prev => ({ ...prev, audioBuffer }));
        } catch (error) {
          console.error('Error loading audio:', error);
        }
      };
      loadAudio();
    }
  }, [file, audioContext]);

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
    if (state.audioBuffer && !state.isPlaying) {
      const source = audioContext.createBufferSource();
      source.buffer = state.audioBuffer;
      source.connect(audioContext.destination);
      source.start(0, state.currentTime);
      setState(prev => ({ ...prev, isPlaying: true }));
    }
  }, [state.audioBuffer, state.isPlaying, state.currentTime, audioContext]);

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
      audioBuffer: null,
    });
  }, []);

  const setAudioBuffer = useCallback((buffer: AudioBuffer | null) => {
    setState(prev => ({ ...prev, audioBuffer: buffer }));
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
