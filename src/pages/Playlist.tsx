import { useParams } from 'react-router-dom';
import { usePlaylist } from '@/hooks/useSpotify';
import { usePlayer } from '@/contexts/PlayerContext';
import { Play, Pause, Clock, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import TrackCard from '@/components/cards/TrackCard';
import { useMemo } from 'react';

const Playlist = () => {
  const { id } = useParams<{ id: string }>();
  const { data: playlist, isLoading } = usePlaylist(id || '');
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer();

  const tracks = useMemo(() => {
    return playlist?.tracks?.items?.map((item: any) => item.track).filter(Boolean) || [];
  }, [playlist]);

  const isPlayingThisPlaylist = tracks.some((t: any) => t.id === currentTrack?.id);

  const handlePlayPlaylist = () => {
    if (isPlayingThisPlaylist) {
      togglePlay();
    } else if (tracks.length > 0) {
      playTrack(tracks[0], tracks);
    }
  };

  const totalDuration = useMemo(() => {
    const ms = tracks.reduce((acc: number, track: any) => acc + (track?.duration_ms || 0), 0);
    const hours = Math.floor(ms / 3600000);
    const mins = Math.floor((ms % 3600000) / 60000);
    return hours > 0 ? `${hours} hr ${mins} min` : `${mins} min`;
  }, [tracks]);

  // Calculate average color from playlist image
  const gradientColor = playlist?.images?.[0]?.url ? 'from-emerald-900/80' : 'from-card';

  if (isLoading) {
    return (
      <div className="pb-8">
        <div className="flex flex-col md:flex-row items-end gap-6 mb-8">
          <Skeleton className="w-48 h-48 md:w-56 md:h-56 rounded" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Music className="h-16 w-16 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Playlist not found</p>
      </div>
    );
  }

  return (
    <div className={`pb-8 -mx-4 lg:-mx-6 -mt-[72px] pt-[72px] px-4 lg:px-6 bg-gradient-to-b ${gradientColor} to-transparent`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row items-end gap-6 mb-6">
        {playlist.images?.[0] ? (
          <img
            src={playlist.images[0].url}
            alt={playlist.name}
            className="w-48 h-48 md:w-56 md:h-56 rounded shadow-2xl object-cover"
          />
        ) : (
          <div className="w-48 h-48 md:w-56 md:h-56 bg-accent rounded shadow-2xl flex items-center justify-center">
            <Music className="h-24 w-24 text-muted-foreground" />
          </div>
        )}
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground mb-2">Playlist</p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4 line-clamp-2">
            {playlist.name}
          </h1>
          {playlist.description && (
            <p
              className="text-sm text-muted-foreground mb-2 line-clamp-2"
              dangerouslySetInnerHTML={{ __html: playlist.description }}
            />
          )}
          <div className="flex items-center gap-1 text-sm text-foreground">
            <span className="font-semibold">{playlist.owner?.display_name}</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">{playlist.tracks?.total} songs</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">{totalDuration}</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6 mb-6">
        <Button
          onClick={handlePlayPlaylist}
          disabled={tracks.length === 0}
          className="w-14 h-14 rounded-full bg-primary hover:bg-spotify-green-hover hover:scale-105 transition-transform play-button-shadow"
        >
          {isPlayingThisPlaylist && isPlaying ? (
            <Pause className="h-6 w-6 fill-current" />
          ) : (
            <Play className="h-6 w-6 fill-current ml-1" />
          )}
        </Button>
      </div>

      {/* Track List Header */}
      <div className="grid grid-cols-[16px_4fr_2fr_minmax(120px,1fr)] md:grid-cols-[16px_4fr_3fr_minmax(120px,1fr)] gap-4 px-4 py-2 border-b border-border text-sm text-muted-foreground mb-2">
        <span>#</span>
        <span>Title</span>
        <span className="hidden md:block">Album</span>
        <span className="flex justify-end">
          <Clock className="h-4 w-4" />
        </span>
      </div>

      {/* Track List */}
      <div className="space-y-1">
        {tracks.map((track: any, index: number) => (
          <TrackCard key={`${track.id}-${index}`} track={track} index={index} queue={tracks} />
        ))}
      </div>
    </div>
  );
};

export default Playlist;
