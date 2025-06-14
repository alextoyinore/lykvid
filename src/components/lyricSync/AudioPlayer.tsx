import { Button } from "@/components/ui/button";
import { Play, Pause, FastForward, Rewind } from "lucide-react";

interface AudioPlayerProps {
  isPlaying: boolean;
  currentTime: number;
  audioDuration: number;
  onPlay: () => void;
  onPause: () => void;
  onSeek: (time: number) => void;
}

export function AudioPlayer({
  isPlaying,
  currentTime,
  audioDuration,
  onPlay,
  onPause,
  onSeek,
}: AudioPlayerProps) {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {formatTime(currentTime)}
        </span>
        <input
          type="range"
          min={0}
          max={audioDuration}
          step={0.1}
          value={currentTime}
          onChange={(e) => onSeek(parseFloat(e.target.value))}
          className="flex-1 mx-4 h-2 bg-muted/50"
        />
        <span className="text-sm text-muted-foreground">
          {formatTime(audioDuration)}
        </span>
      </div>
      <div className="flex gap-2">
        <Button
          onClick={() => onSeek(Math.max(0, currentTime - 10))}
          className="w-10 h-10"
        >
          <Rewind className="h-4 w-4" />
        </Button>
        <Button
          onClick={isPlaying ? onPause : onPlay}
          className="w-10 h-10"
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
        <Button
          onClick={() => onSeek(Math.min(audioDuration, currentTime + 10))}
          className="w-10 h-10"
        >
          <FastForward className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
