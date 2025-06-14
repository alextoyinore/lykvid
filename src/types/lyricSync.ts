export interface LyricPhrase {
  text: string;
  startTime: number; // in seconds
  endTime: number; // in seconds
}

export interface SynchronizedLyrics {
  phrases: LyricPhrase[];
  audioDuration: number; // in seconds
}

export interface LyricSyncState {
  synchronizedLyrics: SynchronizedLyrics | null;
  currentPhrase: number | null; // index of currently selected phrase
  isPlaying: boolean;
  currentTime: number; // current playback time in seconds
  isSynchronized: boolean;
  audioBuffer: AudioBuffer | null;
}

export interface LyricSyncAction {
  type: 'PLAY' | 'PAUSE' | 'SEEK' | 'SELECT_PHRASE' | 'UPDATE_TIMING' | 'RESET';
  payload?: {
    time?: number;
    phraseIndex?: number;
    startTime?: number;
    endTime?: number;
  };
}

