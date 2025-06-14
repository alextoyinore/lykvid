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
    currentFrequency: 0
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

  const [currentSource, setCurrentSource] = useState<AudioBufferSourceNode | null>(null);
  const [timeUpdateInterval, setTimeUpdateInterval] = useState<NodeJS.Timeout | null>(null);

  const play = useCallback(() => {
    if (state.audioBuffer && !state.isPlaying) {
      // Clean up any existing source
      if (currentSource) {
        currentSource.stop();
        setCurrentSource(null);
      }

      const source = audioContext.createBufferSource();
      source.buffer = state.audioBuffer;
      
      // Create analyser node for beat detection
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.8;
      source.connect(analyser);
      analyser.connect(audioContext.destination);
      
      // Calculate when to stop the audio
      const duration = state.audioBuffer.duration;
      const startTime = audioContext.currentTime;
      const endTime = startTime + (duration - state.currentTime);
      
      // Start the audio
      source.start(0, state.currentTime);
      setCurrentSource(source);
      
      // Start time update interval
      const interval = setInterval(() => {
        if (state.audioBuffer) {
          const currentTime = Math.min(
            audioContext.currentTime - startTime + state.currentTime,
            state.synchronizedLyrics?.audioDuration || 0
          );
          
          // Get frequency data for beat detection
          const frequencyData = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(frequencyData);
          
          // Calculate average frequency
          const averageFrequency = frequencyData.reduce((a, b) => a + b) / frequencyData.length;
          
          // Update state with current time and frequency
          setState(prev => ({ 
            ...prev, 
            currentTime,
            currentFrequency: averageFrequency
          }));
          
          // Update current phrase based on time
          if (state.synchronizedLyrics) {
            const currentPhrase = state.synchronizedLyrics.phrases.findIndex(phrase => {
              return currentTime >= phrase.startTime && currentTime < phrase.endTime;
            });
            if (currentPhrase !== -1) {
              setState(prev => ({ ...prev, currentPhrase }));
            }
          }
        }
      }, 50); // Update every 50ms for better accuracy

      setTimeUpdateInterval(interval);
      
      setState(prev => ({ 
        ...prev, 
        isPlaying: true,
        currentFrequency: 0
      }));
    }
  }, [state.audioBuffer, state.isPlaying, state.currentTime, audioContext, currentSource, state.synchronizedLyrics]);

  const pause = useCallback(() => {
    if (currentSource) {
      currentSource.stop();
      setCurrentSource(null);
    }
    if (timeUpdateInterval) {
      clearInterval(timeUpdateInterval);
      setTimeUpdateInterval(null);
    }
    setState(prev => ({ ...prev, isPlaying: false }));
  }, [currentSource]);

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
      currentFrequency: 0,
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
