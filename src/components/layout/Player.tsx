import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2, VolumeX, Maximize2, ListMusic, Mic2 } from 'lucide-react';
import { usePlayer } from '@/contexts/PlayerContext';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const formatTime = (seconds: number) => {
  if (isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const Player = () => {
  const {
    currentTrack,
    isPlaying,
    progress,
    duration,
    volume,
    togglePlay,
    nextTrack,
    previousTrack,
    seek,
    setVolume,
  } = usePlayer();

  const hasPreview = !!currentTrack?.preview_url;

  return (
    <footer className="h-20 bg-sidebar border-t border-border flex items-center px-4 gap-4">
      {/* Track Info */}
      <div className="flex items-center gap-3 min-w-[180px] w-[30%]">
        {currentTrack ? (
          <>
            <img
              src={currentTrack.album.images[0]?.url || '/placeholder.svg'}
              alt={currentTrack.album.name}
              className="h-14 w-14 rounded object-cover"
            />
            <div className="min-w-0">
              <p className="text-sm font-medium truncate hover:underline cursor-pointer">
                {currentTrack.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {currentTrack.artists.map((a, i) => (
                  <span key={a.id}>
                    {i > 0 && ', '}
                    <Link
                      to={`/artist/${a.id}`}
                      className="hover:underline hover:text-foreground"
                    >
                      {a.name}
                    </Link>
                  </span>
                ))}
              </p>
            </div>
          </>
        ) : (
          <div className="h-14 w-14 rounded bg-accent" />
        )}
      </div>

      {/* Player Controls */}
      <div className="flex-1 flex flex-col items-center justify-center gap-1 max-w-[722px]">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <Shuffle className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={previousTrack}
            disabled={!currentTrack}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <SkipBack className="h-5 w-5 fill-current" />
          </Button>
          <Button
            size="icon"
            onClick={togglePlay}
            disabled={!hasPreview}
            className={cn(
              'h-8 w-8 rounded-full bg-foreground text-background hover:bg-foreground hover:scale-105 transition-transform',
              !hasPreview && 'opacity-50'
            )}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4 fill-current" />
            ) : (
              <Play className="h-4 w-4 fill-current ml-0.5" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={nextTrack}
            disabled={!currentTrack}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <SkipForward className="h-5 w-5 fill-current" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <Repeat className="h-4 w-4" />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-2 w-full">
          <span className="text-xs text-muted-foreground w-10 text-right">
            {formatTime(progress)}
          </span>
          <Slider
            value={[progress]}
            max={duration || 30}
            step={0.1}
            onValueChange={([value]) => seek(value)}
            className="flex-1"
            disabled={!hasPreview}
          />
          <span className="text-xs text-muted-foreground w-10">
            {formatTime(duration || 30)}
          </span>
        </div>
        {!hasPreview && currentTrack && (
          <p className="text-xs text-muted-foreground">Preview not available</p>
        )}
      </div>

      {/* Volume & Other Controls */}
      <div className="flex items-center gap-2 justify-end min-w-[180px] w-[30%]">
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
          <Mic2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
          <ListMusic className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setVolume(volume === 0 ? 0.7 : 0)}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            {volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          <Slider
            value={[volume * 100]}
            max={100}
            step={1}
            onValueChange={([value]) => setVolume(value / 100)}
            className="w-24"
          />
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>
    </footer>
  );
};

export default Player;
