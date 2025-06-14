import { useRef } from 'react';

export function createAudioContext() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);

  if (!audioContextRef.current) {
    audioContextRef.current = new AudioContext();
  }

  const setAudioBuffer = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await audioContextRef.current!.decodeAudioData(arrayBuffer);
    audioBufferRef.current = audioBuffer;
  };

  return {
    audioContext: audioContextRef.current!,
    audioBuffer: audioBufferRef.current,
    setAudioBuffer,
  };
}
