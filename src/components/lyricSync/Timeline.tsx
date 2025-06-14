import { useState, useEffect } from 'react';
import { LyricPhrase } from '@/types/lyricSync';

interface TimelineProps {
  phrases: LyricPhrase[];
  currentTime: number;
  currentPhrase: number | null;
  isPlaying: boolean;
  onPhraseSelect: (index: number) => void;
  onUpdateTiming: (phraseIndex: number, startTime: number, endTime: number) => void;
}

export function Timeline({
  phrases,
  currentTime,
  currentPhrase,
  isPlaying,
  onPhraseSelect,
  onUpdateTiming,
}: TimelineProps) {
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState<number | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const handlePhraseClick = (index: number) => {
    onPhraseSelect(index);
  };

  const handlePhraseDragStart = (index: number, event: React.MouseEvent) => {
    setDragging(true);
    setDragStart(event.clientX);
    setDragIndex(index);
  };

  const handlePhraseDrag = (event: React.MouseEvent) => {
    if (!dragging || dragIndex === null || dragStart === null) return;

    const delta = (event.clientX - dragStart) / 1000; // Convert pixels to seconds
    const newStartTime = phrases[dragIndex].startTime + delta;
    const newEndTime = phrases[dragIndex].endTime + delta;

    onUpdateTiming(dragIndex, newStartTime, newEndTime);
    setDragStart(event.clientX);
  };

  const handlePhraseDragEnd = () => {
    setDragging(false);
    setDragStart(null);
    setDragIndex(null);
  };

  const totalDuration = phrases.length > 0 ? phrases[phrases.length - 1].endTime : 0;

  console.log(phrases);

  return (
    <div className="relative w-full h-96">
      {/* Timeline line */}
      <div className="absolute left-0 top-0 h-full w-px bg-muted/50" />
      
      {/* Progress */}
      <div 
        className="absolute left-0 top-0 h-1 bg-primary"
        style={{
          width: `${(currentTime / totalDuration) * 100}%`
        }}
      />
      
      {/* Cursor */}
      <div 
        className="absolute left-0 top-0 h-full w-px bg-primary/50"
        style={{
          left: `${(currentTime / totalDuration) * 100}%`
        }}
      />
      
      {/* Phrases */}
      {phrases.map((phrase, index) => (
        <div
          key={index}
          className={`absolute left-0 top-0 h-full cursor-pointer ${
            isPlaying && currentPhrase === index ? 'bg-primary/20' : ''
          }`}
          style={{
            left: `${(phrase.startTime / totalDuration) * 100}%`,
            width: `${((phrase.endTime - phrase.startTime) / totalDuration) * 100}%`
          }}
          onClick={() => handlePhraseClick(index)}
          onMouseDown={(e) => handlePhraseDragStart(index, e)}
          onMouseMove={handlePhraseDrag}
          onMouseUp={handlePhraseDragEnd}
          onMouseLeave={handlePhraseDragEnd}
        >
          {/* Start marker */}
          <div
            className="absolute left-0 top-0 h-2 w-2 rounded-full bg-primary"
            style={{
              top: '50%',
              transform: 'translateY(-50%)'
            }}
          />
          
          {/* End marker */}
          <div
            className="absolute right-0 top-0 h-2 w-2 rounded-full bg-primary"
            style={{
              top: '50%',
              transform: 'translateY(-50%)'
            }}
          />
          
          {/* Content */}
          <div className="absolute left-0 top-full mt-2 w-full text-sm">
            {phrase.text}
          </div>
        </div>
      ))}
    </div>
  );
}
